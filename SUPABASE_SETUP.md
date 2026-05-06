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
