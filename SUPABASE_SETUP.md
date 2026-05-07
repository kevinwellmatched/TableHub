# TableHub Supabase Setup

This slice assumes you already created `.env.local` in the project root.

Use these values:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Do not add a service role key to this app. The service role key can bypass Row
Level Security and should never be exposed to browser code.

## Profiles Table

Run this SQL in the Supabase SQL editor. It is safe to rerun if the table or
these named policies already exist:

```sql
create extension if not exists citext;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username citext unique not null,
  display_name text not null,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can read their own profile" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;

create policy "Users can read their own profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

create policy "Users can insert their own profile"
on public.profiles
for insert
to authenticated
with check ((select auth.uid()) = id);

create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);
```

The app reads and writes only the logged-in user's profile row.

## Slice 3: Projects and Membership

Slice 3 assumes the Project SQL has already been run in Supabase.

The database should now include:

- `public.projects`
- `public.project_members`
- `public.create_project(project_name text, project_description text)`

The `projects` table stores the reusable workspace. A Project is where future
campaigns, systems, compendiums, Settings Library sources, files, permissions,
and project-specific overrides will connect.

The `project_members` table stores which users belong to each Project and what
role they have there:

- Owner
- GM
- Player
- Viewer

The app creates Projects by calling `create_project`. That database function
should insert the Project and the creator's Owner membership together. This
keeps the first membership from being forgotten.

Project access should be protected with Supabase Row Level Security. App code
should use normal Supabase server clients and rely on RLS instead of using a
service role key.

## Slice 4A: Game Systems Foundation

Slice 4A assumes the Game Systems SQL has already been run in Supabase.

The database should now include:

- `public.game_systems`

The `game_systems` table stores reusable master-library records for rulesets
such as D&D 5e 2014, Pathfinder 2e, Daggerheart, Shadowdark, Mothership, or a
custom system.

Important fields include:

- `name`
- `slug`
- `edition`
- `publisher`
- `description`
- `ruleset_year`
- `visibility`
- `license_name`
- `license_url`
- `source_type`
- `source_url`
- `source_notes`
- `version`
- `created_by`

Source and license fields are required now so future SRD imports, private
Markdown/PDF/CSV imports, copy/paste imports, and manual entries can keep clear
provenance. Slice 4A stores system metadata only. It does not seed copyrighted
book text, compendium entries, spells, classes, monsters, Markdown books, PDFs,
or 5etools data.

Expected Row Level Security behavior:

- Authenticated users can read systems they created.
- Authenticated users can read systems marked `public`.
- Only the creator can create, update, or delete their systems.
- `shared` is reserved for later collaboration behavior and currently behaves
  like private content.

The app uses normal Supabase server clients and relies on RLS. Do not add a
service role key to the app.

## Slice 4C: Master Settings Libraries

Slice 4C assumes the Master Settings Libraries SQL has already been run in
Supabase.

The database should now include:

- `public.settings_libraries`

The `settings_libraries` table stores reusable master-library containers for
setting lore. It stores metadata only and does not store setting entries yet.

Important fields include:

- `owner_id`
- `name`
- `slug`
- `description`
- `visibility`
- `genre`
- `tone`
- `source_type`
- `source_url`
- `source_notes`
- `version`

Source fields are included now so future manual entries, owned-note references,
Markdown/PDF/CSV imports, campaign exports, and external references can keep
clear provenance. Slice 4C stores Settings Library containers only. It does not
seed or import NPCs, places, factions, deities, maps, timelines, lore pages,
setting entries, copyrighted text, third-party data, notes, PDFs, Markdown, or
CSVs.

Expected Row Level Security behavior:

- Authenticated users can read Settings Libraries they own.
- Authenticated users can read Settings Libraries marked `public`.
- Only the owner can create, update, or delete their Settings Libraries.
- `shared` is reserved for later collaboration behavior and currently behaves
  like private content unless later policies expand it.

Future Project customization must use linked copies with overrides. A Project
should not directly mutate a master Settings Library record.

The app uses normal Supabase server clients and relies on RLS. Do not add a
service role key to the app.

## Slice 4B: Master Compendiums

Slice 4B assumes the Master Compendiums SQL has already been run in Supabase.

The database should now include:

- `public.compendiums`

The `compendiums` table stores reusable master-library containers for rules and
reference material. Each Compendium links to one Game System through
`game_system_id`.

Important fields include:

- `owner_id`
- `game_system_id`
- `name`
- `slug`
- `description`
- `visibility`
- `license_name`
- `license_url`
- `source_type`
- `source_url`
- `source_notes`
- `version`

Source and license fields are included now so future manual entries, SRD
content, owned-book references, Markdown/PDF/CSV imports, and external
references can keep clear provenance. Slice 4B stores compendium containers
only. It does not seed or import spells, monsters, classes, items, compendium
entries, SRD rows, copyrighted book text, third-party data, or 5etools data.

Expected Row Level Security behavior:

- Authenticated users can read compendiums they own.
- Authenticated users can read compendiums marked `public`.
- Only the owner can create, update, or delete their compendiums.
- `shared` is reserved for later collaboration behavior and currently behaves
  like private content unless later policies expand it.

Future Project customization must use linked copies with overrides. A Project
should not directly mutate a master Compendium record.

The app uses normal Supabase server clients and relies on RLS. Do not add a
service role key to the app.

## Slice 4D: Master Entry Types

Slice 4D assumes the Master Entry Types SQL has already been run in Supabase.

The database should now include:

- `public.entry_types`

The `entry_types` table stores reusable type definitions for future Compendium
entries and Settings Library entries. It stores metadata only and does not store
actual entries yet.

Important fields include:

- `owner_id`
- `library_kind`
- `name`
- `slug`
- `description`
- `visibility`
- `sort_order`

`library_kind` must be either `compendium` or `settings_library`. Use the label
"Settings Library," not "Worlds," for setting-lore libraries. These
definitions prepare future entries such as rules, spells, items, monsters, NPCs,
places, factions, deities, timeline events, and custom creator-defined types.
Slice 4D does not create those entries. It does not store rich text, body
content, tags, folders, custom field schemas, imports, copyrighted rules text,
or lore content.

Expected Row Level Security behavior:

- Authenticated users can read Entry Types they own.
- Authenticated users can read Entry Types marked `public`.
- Only the owner can create, update, or delete their Entry Types.
- `shared` is reserved for later collaboration behavior and currently behaves
  like private content unless later policies expand it.

Future Compendium and Settings Library entries should point to Entry Types.
Future Project customization must use linked copies with overrides. A Project
should not directly mutate master Entry Types, master Compendium entries, or
master Settings Library entries.

The app uses normal Supabase server clients and relies on RLS. Do not add a
service role key to the app.

## Slice 4E: Basic Master Entries Foundation

Slice 4E assumes the Basic Master Entries SQL has already been run in Supabase.

The database should now include:

- `public.master_entries`

The `master_entries` table stores reusable original entries for both
Compendiums and Settings Libraries. It is one shared model; this slice does not
create separate `compendium_entries` or `setting_entries` app systems.

Important fields include:

- `owner_id`
- `library_kind`
- `compendium_id`
- `settings_library_id`
- `entry_type_id`
- `title`
- `slug`
- `aliases`
- `summary`
- `body`
- `body_format`
- `properties`
- `visibility`
- `sort_order`
- `license_name`
- `license_url`
- `source_type`
- `source_url`
- `source_notes`
- `version`

Each Master Entry belongs to exactly one parent library. Compendium entries use
`library_kind = 'compendium'` and a `compendium_id`. Settings Library entries
use `library_kind = 'settings_library'` and a `settings_library_id`. Every entry
also points to one `entry_types` row.

Slice 4E stores simple plain text or Markdown textarea content only.
`properties` stores JSON object data. It does not add rich text editing,
Markdown paste conversion, wiki links, tags, folders, imports, Project links,
Project overrides, marketplace behavior, SRD content, copyrighted rules text, or
5etools imports.

Expected Row Level Security behavior:

- Authenticated users can read Master Entries they own.
- Authenticated users can read public Master Entries when the parent library is
  also public.
- Public Master Entries under private parent libraries should not be visible to
  unrelated users.
- Only the owner can create, update, or delete their Master Entries.
- `shared` is reserved for later collaboration behavior and currently behaves
  like private content unless later policies expand it.

Master Entries are original reusable content. Future Project customization must
use linked copies with overrides. A Project should not directly mutate a Master
Entry.

The app uses normal Supabase server clients and relies on RLS. Do not add a
service role key to the app.

## Slice 5A: Project Sources Foundation

Slice 5A assumes the Project Sources SQL has already been run in Supabase.

The database should now include:

- `public.project_sources`
- `public.attach_project_source(target_project_id uuid, target_source_type text, target_source_id uuid)`
- helper functions for Project role checks
- RLS policies for reading and deleting Project Sources

The `project_sources` table links a Project to accessible master source records.
It does not copy entries and does not create project-specific overrides.

Important fields include:

- `project_id`
- `source_type`
- `game_system_id`
- `compendium_id`
- `settings_library_id`
- `source_name`
- `source_version`
- `added_by`

Supported Slice 5A source types are:

- `game_system`
- `compendium`
- `settings_library`

The app calls `attach_project_source` to attach a source. The RPC should check
the current user's Project role and the user's RLS-backed access to the source.
The app removes source links with a filtered delete from `project_sources`.

Expected Row Level Security behavior:

- Project members can read Project Source links for Projects they can access.
- Project Owners and GMs can attach and remove supported source links.
- Players and Viewers should not be able to attach or remove source links.
- Source options should only include master records the current user can read.

Slice 5A does not add `project_entry_overrides`, an override editor, original
vs modified rendering, manual updates from master content, rich text editing,
imports, tags/folders, Project search, or campaign source linking. Those remain
later slices, with `project_entry_overrides` deferred to Slice 5B.

The app uses normal Supabase server clients and relies on RLS. Do not add a
service role key to the app.
