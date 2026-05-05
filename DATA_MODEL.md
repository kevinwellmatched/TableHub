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

Represents a ruleset.

Examples:

- D&D 5e 2014
- D&D 5e 2024
- Pathfinder 2e
- Daggerheart
- Custom/System Agnostic

Likely fields:

- id
- owner_id
- name
- slug
- edition
- description
- visibility
- version
- created_at
- updated_at

### compendiums

Reusable rules/reference libraries.

Likely fields:

- id
- owner_id
- game_system_id
- name
- description
- visibility
- version
- created_at
- updated_at

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

Likely fields:

- id
- owner_id
- name
- description
- theme
- created_at
- updated_at

### project_members

Membership and role inside a project.

Likely fields:

- id
- project_id
- user_id
- role
- created_at
- updated_at

Roles:

- Owner
- GM
- Player
- Viewer

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
