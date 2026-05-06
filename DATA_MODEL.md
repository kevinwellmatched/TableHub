# TableHub Data Model

Version: 0.1

This is a first-pass conceptual data model. It is not yet a migration file.

---

## Identity and Profiles

### profiles

Extends Supabase Auth users.

Current Slice 2 table:

- id uuid primary key references auth.users(id) on delete cascade
- username citext unique not null
- display_name text not null
- avatar_url text
- created_at timestamptz not null default now()
- updated_at timestamptz not null default now()

Rules:

- Username should be globally unique.
- Display name should be changeable.
- Email should not be shown to other players.
- Browser-visible profile reads and writes should be limited to the current user's row with Supabase Row Level Security.

---

## Systems and Compendiums

### game_systems

Represents a reusable master-library ruleset.

Examples:

- D&D 5e 2014
- D&D 5e 2024
- Pathfinder 2e
- Daggerheart
- Custom/System Agnostic

Current Slice 4A table:

- id uuid primary key
- name text not null
- slug text not null
- edition text
- publisher text
- description text
- ruleset_year integer
- visibility text not null
- license_name text
- license_url text
- source_type text not null
- source_url text
- source_notes text
- version text not null
- created_by uuid not null references auth.users(id)
- created_at timestamptz not null default now()
- updated_at timestamptz not null default now()

Rules:

- A Game System is the safe master record for a ruleset. Projects should link to
  systems later instead of mutating them directly.
- Visibility currently supports `private`, `shared`, and `public`.
- `shared` is reserved for later collaboration behavior and currently behaves
  like private content.
- Authenticated users can read their own systems and public systems.
- Only the creator should create, update, or delete their systems.
- Access is enforced with Supabase Row Level Security.

Source and provenance fields:

- `license_name`
- `license_url`
- `source_type`
- `source_url`
- `source_notes`
- `version`

These fields exist so future SRD imports, private Markdown/PDF/CSV imports,
manual entries, and external references can be tracked clearly. TableHub should
know where system metadata and future content came from before compendiums,
entries, and imports are added. This helps avoid unsafe or unclear content
provenance.

### compendiums

Reusable master-library rules/reference containers.

Current Slice 4B table:

- id uuid primary key
- owner_id uuid not null references auth.users(id)
- game_system_id uuid not null references public.game_systems(id)
- name text not null
- slug text not null
- description text
- visibility text not null
- license_name text
- license_url text
- source_type text not null
- source_url text
- source_notes text
- version text not null
- created_at timestamptz not null default now()
- updated_at timestamptz not null default now()

Rules:

- A Compendium is a master-library record linked to one Game System.
- Slice 4B stores the compendium container only. It does not create entries,
  spells, monsters, classes, items, SRD rows, book text, or imported rules text.
- Visibility supports `private`, `shared`, and `public`.
- `shared` is reserved for later collaboration behavior and currently behaves
  like private content unless the database policies say otherwise.
- Authenticated users can read their own compendiums and public compendiums.
- Only the owner should create, update, or delete their compendiums.
- Access is enforced with Supabase Row Level Security.
- Future Project customization must use linked copies with overrides instead of
  mutating the master Compendium directly.

Source and provenance fields:

- `license_name`
- `license_url`
- `source_type`
- `source_url`
- `source_notes`
- `version`

These fields prepare TableHub for future manual entries, SRD content, owned-book
references, Markdown/PDF/CSV imports, and external references. Future entries
and import tools must preserve provenance clearly and must not use 5etools as a
direct import source.

### compendium_entries

Entries inside compendiums.

Likely fields:

- id
- compendium_id
- entry_type
- title
- slug
- aliases
- summary
- body
- properties
- visibility
- version
- created_at
- updated_at

Entry types should support built-in and custom types.

---

## Settings Library

### settings_libraries

Reusable lore/world bibles.

Likely fields:

- id
- owner_id
- name
- description
- visibility
- version
- created_at
- updated_at

### setting_entries

Entries inside a Settings Library.

Likely fields:

- id
- settings_library_id
- entry_type
- title
- slug
- aliases
- summary
- body
- properties
- visibility
- version
- created_at
- updated_at

Examples:

- NPC
- Location
- Faction
- Deity
- Timeline Event
- Region
- Organization
- Custom type

---

## Projects

### projects

A workspace combining systems, compendiums, settings, and campaigns.

Current Slice 3 table:

- id uuid primary key
- owner_id uuid not null references auth.users(id)
- name text not null
- description text
- created_at timestamptz not null default now()
- updated_at timestamptz not null default now()

Rules:

- A Project is the main reusable workspace container.
- Projects are protected by Supabase Row Level Security.
- A user should only be able to read Projects where they have a matching membership.
- The original master system, compendium, or Settings Library content should not be mutated from a Project. Project-specific changes belong in linked source and override tables in later slices.

### project_members

Membership and role inside a project.

Current Slice 3 table:

- id uuid primary key
- project_id uuid not null references public.projects(id) on delete cascade
- user_id uuid not null references auth.users(id) on delete cascade
- role text not null
- created_at timestamptz not null default now()
- updated_at timestamptz not null default now()

Roles:

- Owner
- GM
- Player
- Viewer

Role meaning:

- Owner can manage the whole Project and its membership.
- GM can prepare and run table material inside the Project.
- Player can use player-facing tools and content that has been made available.
- Viewer can read permitted Project content without editing it.

Slice 3 also adds `public.create_project(project_name text, project_description text)`.
The app uses this database function when creating a Project so the Project row
and the creator's Owner membership are created together.

### project_sources

Links a project to master sources.

Likely fields:

- id
- project_id
- source_type
- source_id
- source_version
- created_at
- updated_at

Source types:

- game_system
- compendium
- settings_library
- campaign_template
- character_sheet_template

### project_entry_overrides

Stores project-specific overrides for linked entries.

Likely fields:

- id
- project_id
- source_entry_type
- source_entry_id
- override_data
- override_reason
- created_by
- created_at
- updated_at

This table is critical. It prevents project edits from mutating master content.

---

## Campaigns

### campaigns

An active play space inside a project.

Likely fields:

- id
- project_id
- template_source_id
- name
- description
- status
- theme
- current_gm_id
- created_at
- updated_at

### campaign_members

Membership inside a campaign.

Likely fields:

- id
- campaign_id
- user_id
- role
- invite_status
- created_at
- updated_at

### campaign_invites

Likely fields:

- id
- campaign_id
- invited_by
- invite_type
- invite_target
- token
- expires_at
- accepted_at
- created_at

Invite types:

- username
- email
- share_link

---

## Characters

### characters

Represents a player or GM-created character.

Likely fields:

- id
- owner_id
- name
- display_name
- avatar_url
- game_system_id
- active_campaign_id
- profile_data
- sheet_data
- override_data
- created_at
- updated_at

### character_campaigns

Tracks campaign history.

Likely fields:

- id
- character_id
- campaign_id
- status
- joined_at
- left_at

---

## Organization

### tags

Likely fields:

- id
- owner_id
- project_id
- name
- color
- created_at

### taggings

Likely fields:

- id
- tag_id
- target_type
- target_id
- created_at

### folders

Likely fields:

- id
- owner_id
- project_id
- parent_folder_id
- name
- sort_order
- created_at
- updated_at

### folder_items

Likely fields:

- id
- folder_id
- target_type
- target_id
- sort_order

---

## Files and Media

### files

Likely fields:

- id
- owner_id
- project_id
- campaign_id
- storage_path
- file_type
- title
- description
- tags
- visibility
- metadata
- created_at
- updated_at

Files should support:

- portraits
- icons
- maps
- handouts
- PDFs
- images
- audio/video embeds later

---

## Journals and Notes

### journals

Likely fields:

- id
- campaign_id
- owner_id
- journal_type
- title
- body
- visibility
- created_at
- updated_at

Journal types:

- private
- party
- GM
- session

### session_notes

Likely fields:

- id
- campaign_id
- session_number
- title
- body
- date_played
- visibility
- created_by
- created_at
- updated_at

---

## Dice

### dice_rolls

Likely fields:

- id
- campaign_id
- character_id
- rolled_by
- notation
- result
- breakdown
- visibility
- created_at

Visibility:

- public
- private
- GM-only

---

## Search

Search should eventually index:

- title
- aliases
- summary
- body
- tags
- properties
- linked entries
- files metadata

Search must respect permissions.
