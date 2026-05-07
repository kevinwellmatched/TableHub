# TableHub Data Model

Version: 0.1

This is a first-pass conceptual data model. It is not yet a migration file.

TableHub is moving toward:

```text
System
  -> Library Source
      -> Master Entry
          -> Project Source Link
              -> Project Entry Override
```

Slice 5A adds Project Source linking only. It links Projects to accessible
master Game Systems, Compendiums, and Settings Libraries without mutating the
master records and without adding project entry overrides yet.

Slice 5B adds Library Source taxonomy helpers and documentation alignment only.
It does not add a migration, rename tables, delete tables, or change existing
routes. Compendiums and Settings Libraries remain the current concrete
container tables while Library Source becomes the product vocabulary for
reusable source containers.

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

## Systems and Library Sources

### Library Source taxonomy

Library Source is the product vocabulary for reusable source containers under a
System. The current concrete container tables are still `compendiums` and
`settings_libraries`.

Controlled source categories:

- `core_rulebook` - Core Rulebooks
- `expansion_supplement` - Expansions & Supplements
- `setting_world_lore` - Setting & World Lore
- `adventure_module` - Adventures & Modules
- `other` - Other

Use "Adventures & Modules" instead of "Adventures & Campaigns" to avoid
confusing reusable adventure sources with active Campaign records.

Default clone policy by category:

- Core Rulebooks -> `locked_to_system`
- Expansions & Supplements -> `locked_to_system`
- Setting & World Lore -> `cloneable_to_system`
- Adventures & Modules -> `cloneable_to_system`
- Other -> `locked_to_system` unless a later subtype indicates `system_agnostic`

Default player visibility by category:

- Core Rulebooks -> `visible`
- Expansions & Supplements -> `visible`
- Setting & World Lore -> `gm_only`
- Adventures & Modules -> `gm_only`
- Other -> `mixed`

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

Current concrete Library Source containers for rules/reference material.

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

- A Compendium is a current Library Source record linked to one Game System.
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

### entry_types

Reusable type definitions for future Compendium and Settings Library entries.

Current Slice 4D table:

- id uuid primary key
- owner_id uuid not null references auth.users(id)
- library_kind text not null
- name text not null
- slug text not null
- description text
- visibility text not null
- sort_order integer not null default 0
- created_at timestamptz not null default now()
- updated_at timestamptz not null default now()

Rules:

- Slice 4D stores Entry Type definitions only. It does not create actual
  Compendium entries or Settings Library entries.
- `library_kind` is either `compendium` or `settings_library`.
- Use the label "Settings Library," not "Worlds," for setting-lore libraries.
- Visibility supports `private`, `shared`, and `public`.
- Authenticated users can read their own Entry Types and public Entry Types.
- Only the owner should create, update, or delete their Entry Types.
- Access is enforced with Supabase Row Level Security.
- Entry Types do not store rich-text body content, tags, folders, imports, or
  custom field schemas yet.
- Future entries should point to Entry Types instead of storing an unstructured
  type label.
- Future Project customization must use linked copies with overrides instead of
  mutating master Entry Types or master entries directly.
- Starter presets are metadata only and must not import copyrighted rules text
  or lore content.

### master_entries

Shared original entries for both Compendiums and Settings Libraries.

Current Slice 4E table:

- id uuid primary key
- owner_id uuid not null references auth.users(id)
- library_kind text not null
- compendium_id uuid references public.compendiums(id)
- settings_library_id uuid references public.settings_libraries(id)
- entry_type_id uuid not null references public.entry_types(id)
- title text not null
- slug text not null
- aliases text[] not null default '{}'
- summary text
- body text
- body_format text not null
- properties jsonb not null default '{}'
- visibility text not null
- sort_order integer not null default 0
- license_name text
- license_url text
- source_type text not null
- source_url text
- source_notes text
- version text not null
- created_at timestamptz not null default now()
- updated_at timestamptz not null default now()

Rules:

- `master_entries` is the shared table for both Compendium entries and Settings
  Library entries. Do not create separate app systems for `compendium_entries`
  and `setting_entries` yet.
- Each Master Entry belongs to exactly one parent library. If `library_kind` is
  `compendium`, `compendium_id` is required and `settings_library_id` must be
  empty. If `library_kind` is `settings_library`, `settings_library_id` is
  required and `compendium_id` must be empty.
- Each Master Entry points to one Entry Type.
- Body content is simple plain text or Markdown textarea content for now.
- `properties` stores optional structured JSON object data.
- Visibility supports `private`, `shared`, and `public`.
- Access is enforced with Supabase Row Level Security.
- Slice 4E does not add rich text editing, Markdown paste conversion, wiki
  links, tags, folders, imports, project linking, project overrides, public
  marketplace behavior, 5etools imports, SRD content, or copyrighted book text.
- Master Entries are original reusable content. Future Project customization
  must use linked copies with overrides instead of mutating Master Entries
  directly.
- Use the label "Settings Library," not "Worlds," for setting-lore libraries.

---

## Settings Library

### settings_libraries

Current concrete Library Source containers for setting and world lore.

Current Slice 4C table:

- id uuid primary key
- owner_id uuid not null references auth.users(id)
- name text not null
- slug text not null
- description text
- visibility text not null
- genre text
- tone text
- source_type text not null
- source_url text
- source_notes text
- version text not null
- created_at timestamptz not null default now()
- updated_at timestamptz not null default now()

Rules:

- A Settings Library is a current Library Source record for reusable setting lore.
- Slice 4C stores the Settings Library container only. It does not create setting
  entries, NPCs, places, factions, deities, maps, timelines, lore pages, or
  imported lore content.
- Visibility supports `private`, `shared`, and `public`.
- `shared` is reserved for later collaboration behavior and currently behaves
  like private content unless the database policies say otherwise.
- Authenticated users can read their own Settings Libraries and public Settings
  Libraries.
- Only the owner should create, update, or delete their Settings Libraries.
- Access is enforced with Supabase Row Level Security.
- Future Project customization must use linked copies with overrides instead of
  mutating the master Settings Library directly.

Source and provenance fields:

- `source_type`
- `source_url`
- `source_notes`
- `version`

These fields prepare TableHub for future manual entries, owned-note references,
Markdown/PDF/CSV imports, campaign exports, and external references. Future
entries and import tools must preserve provenance clearly.

Settings Library entries now use the shared `master_entries` table. Separate
Settings Library entry app systems are intentionally deferred.

---

## Projects

### projects

A workspace that should eventually choose one primary System, attach compatible
Library Sources into its Project Library, and contain active Campaigns.

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
- Project Library means the set of Library Sources attached to a Project.

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

Links a Project to master sources. This is the current database foundation for
the Project Library.

Current Slice 5A table:

- id uuid primary key
- project_id uuid not null references public.projects(id) on delete cascade
- source_type text not null
- game_system_id uuid references public.game_systems(id)
- compendium_id uuid references public.compendiums(id)
- settings_library_id uuid references public.settings_libraries(id)
- source_name text not null
- source_version text
- added_by uuid references auth.users(id)
- created_at timestamptz not null default now()
- updated_at timestamptz not null default now()

Source types:

- game_system
- compendium
- settings_library

Rules:

- Slice 5A only links master sources to Projects.
- A Project Source points to exactly one supported master source.
- The app currently limits source types to `game_system`, `compendium`, and
  `settings_library`.
- Campaign templates and character sheet templates are not part of Slice 5A.
- Project Source links do not copy entries and do not create overrides yet.
- The original Game System, Compendium, Settings Library, and Master Entry rows
  must not be mutated from a Project.
- Owner and GM management is shown in the UI when the current Project role is
  available, but Supabase RLS remains the real permission boundary.
- The app uses `public.attach_project_source` to create links so the database
  can validate role and source access in one place.

### project_entry_overrides

Stores project-specific overrides for linked entries.

Deferred to Slice 5C.

Likely future fields:

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
It is not implemented in Slice 5A.

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
