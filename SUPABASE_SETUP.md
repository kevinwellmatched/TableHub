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

## Slice 5D: Project Entry Overrides Groundwork

Run this SQL in Supabase before manually testing Project Entry Overrides.

This slice documents the database changes only. It does not create a migration
file and does not change Supabase automatically.

```sql
create table if not exists public.project_entry_overrides (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  master_entry_id uuid not null references public.master_entries(id) on delete cascade,
  override_title text,
  override_summary text,
  override_body text,
  override_properties jsonb not null default '{}',
  override_visibility text,
  override_reason text,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, master_entry_id)
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'project_entry_overrides_visibility_check'
  ) then
    alter table public.project_entry_overrides
      add constraint project_entry_overrides_visibility_check
      check (
        override_visibility is null
        or override_visibility in ('inherit', 'visible', 'gm_only', 'hidden')
      );
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'project_entry_overrides_properties_object_check'
  ) then
    alter table public.project_entry_overrides
      add constraint project_entry_overrides_properties_object_check
      check (jsonb_typeof(override_properties) = 'object');
  end if;
end $$;

create or replace function public.set_project_entry_override_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_project_entry_override_updated_at
  on public.project_entry_overrides;

create trigger set_project_entry_override_updated_at
before update on public.project_entry_overrides
for each row
execute function public.set_project_entry_override_updated_at();

alter table public.project_entry_overrides enable row level security;

drop policy if exists "Project members can read project entry overrides"
  on public.project_entry_overrides;

create policy "Project members can read project entry overrides"
on public.project_entry_overrides
for select
to authenticated
using (
  exists (
    select 1
    from public.project_members pm
    where pm.project_id = project_entry_overrides.project_id
      and pm.user_id = auth.uid()
  )
);

drop policy if exists "Project owners and GMs can create reachable entry overrides"
  on public.project_entry_overrides;

create policy "Project owners and GMs can create reachable entry overrides"
on public.project_entry_overrides
for insert
to authenticated
with check (
  created_by = auth.uid()
  and exists (
    select 1
    from public.project_members pm
    where pm.project_id = project_entry_overrides.project_id
      and pm.user_id = auth.uid()
      and pm.role in ('owner', 'gm')
  )
  and exists (
    select 1
    from public.project_sources ps
    join public.master_entries me
      on me.id = project_entry_overrides.master_entry_id
    where ps.project_id = project_entry_overrides.project_id
      and (
        (
          ps.source_type = 'compendium'
          and me.library_kind = 'compendium'
          and ps.compendium_id = me.compendium_id
        )
        or (
          ps.source_type = 'settings_library'
          and me.library_kind = 'settings_library'
          and ps.settings_library_id = me.settings_library_id
        )
      )
  )
);

drop policy if exists "Project owners and GMs can update entry overrides"
  on public.project_entry_overrides;

create policy "Project owners and GMs can update entry overrides"
on public.project_entry_overrides
for update
to authenticated
using (
  exists (
    select 1
    from public.project_members pm
    where pm.project_id = project_entry_overrides.project_id
      and pm.user_id = auth.uid()
      and pm.role in ('owner', 'gm')
  )
)
with check (
  exists (
    select 1
    from public.project_members pm
    where pm.project_id = project_entry_overrides.project_id
      and pm.user_id = auth.uid()
      and pm.role in ('owner', 'gm')
  )
  and exists (
    select 1
    from public.project_sources ps
    join public.master_entries me
      on me.id = project_entry_overrides.master_entry_id
    where ps.project_id = project_entry_overrides.project_id
      and (
        (
          ps.source_type = 'compendium'
          and me.library_kind = 'compendium'
          and ps.compendium_id = me.compendium_id
        )
        or (
          ps.source_type = 'settings_library'
          and me.library_kind = 'settings_library'
          and ps.settings_library_id = me.settings_library_id
        )
      )
  )
);

drop policy if exists "Project owners and GMs can delete entry overrides"
  on public.project_entry_overrides;

create policy "Project owners and GMs can delete entry overrides"
on public.project_entry_overrides
for delete
to authenticated
using (
  exists (
    select 1
    from public.project_members pm
    where pm.project_id = project_entry_overrides.project_id
      and pm.user_id = auth.uid()
      and pm.role in ('owner', 'gm')
  )
);
```

Expected Row Level Security behavior:

- Project members can read overrides for Projects they can access.
- Project Owners and GMs can create, update, and delete overrides.
- Players and Viewers cannot create, update, or delete overrides.
- Overrides are allowed only for Master Entries reachable through a Compendium
  or Settings Library source attached to the Project.
- Game System sources stay out of entry override reachability for now because
  Systems are metadata containers at this app stage.

The app uses normal Supabase server clients and relies on RLS. Do not add a
service role key to the app.

## Slice 5E: Project Library Visibility and Player Read Mode

Run this SQL in Supabase before manually testing Player or Viewer Project
Library reads.

This slice tightens the Slice 5D override read policy. Slice 5D allowed all
Project members to read Project Entry Override rows while the UI was
Owner/GM-only. Slice 5E removes that broad read path because override rows can
contain GM notes, override reasons, hidden titles, and hidden body text.

This SQL is policy/function-only. It does not create new app tables, rename
Compendiums or Settings Libraries, or create a unified `library_sources` table.

```sql
create schema if not exists private;

create or replace function private.current_project_role(target_project_id uuid)
returns text
language sql
security definer
set search_path = public
as $$
  select pm.role
  from public.project_members pm
  where pm.project_id = target_project_id
    and pm.user_id = auth.uid()
  limit 1;
$$;

create or replace function private.resolve_project_library_visibility(
  source_default_visibility text,
  override_visibility text
)
returns text
language sql
immutable
set search_path = public
as $$
  select case
    when override_visibility = 'visible' then 'visible'
    when override_visibility = 'gm_only' then 'gm_only'
    when override_visibility = 'hidden' then 'hidden'
    when source_default_visibility = 'visible' then 'visible'
    when source_default_visibility = 'gm_only' then 'gm_only'
    else 'gm_only'
  end;
$$;

create or replace function private.project_entry_source_default_visibility(
  target_project_id uuid,
  entry_library_kind text,
  entry_compendium_id uuid,
  entry_settings_library_id uuid
)
returns text
language sql
security definer
set search_path = public
as $$
  select case
    when entry_library_kind = 'compendium' then (
      select c.default_player_visibility
      from public.project_sources ps
      join public.compendiums c
        on c.id = ps.compendium_id
      where ps.project_id = target_project_id
        and ps.source_type = 'compendium'
        and ps.compendium_id = entry_compendium_id
      limit 1
    )
    when entry_library_kind = 'settings_library' then (
      select sl.default_player_visibility
      from public.project_sources ps
      join public.settings_libraries sl
        on sl.id = ps.settings_library_id
      where ps.project_id = target_project_id
        and ps.source_type = 'settings_library'
        and ps.settings_library_id = entry_settings_library_id
      limit 1
    )
    else null
  end;
$$;

create or replace function private.can_read_project_library_entry(
  target_project_id uuid,
  target_master_entry_id uuid,
  entry_library_kind text,
  entry_compendium_id uuid,
  entry_settings_library_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_role text;
  source_default_visibility text;
  entry_override_visibility text;
  resolved_visibility text;
begin
  current_role := private.current_project_role(target_project_id);

  if current_role is null then
    return false;
  end if;

  source_default_visibility := private.project_entry_source_default_visibility(
    target_project_id,
    entry_library_kind,
    entry_compendium_id,
    entry_settings_library_id
  );

  if source_default_visibility is null then
    return false;
  end if;

  if current_role in ('owner', 'gm') then
    return true;
  end if;

  if current_role not in ('player', 'viewer') then
    return false;
  end if;

  select peo.override_visibility
  into entry_override_visibility
  from public.project_entry_overrides peo
  where peo.project_id = target_project_id
    and peo.master_entry_id = target_master_entry_id
  limit 1;

  resolved_visibility := private.resolve_project_library_visibility(
    source_default_visibility,
    entry_override_visibility
  );

  return resolved_visibility = 'visible';
end;
$$;

create or replace function private.read_project_library_entries_for_current_user(
  target_project_id uuid,
  target_master_entry_id uuid default null
)
returns table (
  master_entry_id uuid,
  source_type text,
  source_id uuid,
  source_name text,
  effective_title text,
  effective_summary text,
  effective_body text,
  effective_properties jsonb
)
language sql
security definer
set search_path = public
as $$
  select
    me.id as master_entry_id,
    ps.source_type,
    case
      when ps.source_type = 'compendium' then ps.compendium_id
      else ps.settings_library_id
    end as source_id,
    ps.source_name,
    coalesce(nullif(peo.override_title, ''), me.title) as effective_title,
    coalesce(nullif(peo.override_summary, ''), me.summary) as effective_summary,
    coalesce(nullif(peo.override_body, ''), me.body) as effective_body,
    coalesce(me.properties, '{}'::jsonb)
      || coalesce(peo.override_properties, '{}'::jsonb) as effective_properties
  from public.project_sources ps
  join public.master_entries me
    on (
      ps.source_type = 'compendium'
      and me.library_kind = 'compendium'
      and me.compendium_id = ps.compendium_id
    )
    or (
      ps.source_type = 'settings_library'
      and me.library_kind = 'settings_library'
      and me.settings_library_id = ps.settings_library_id
    )
  left join public.project_entry_overrides peo
    on peo.project_id = ps.project_id
    and peo.master_entry_id = me.id
  where ps.project_id = target_project_id
    and ps.source_type in ('compendium', 'settings_library')
    and (target_master_entry_id is null or me.id = target_master_entry_id)
    and private.can_read_project_library_entry(
      ps.project_id,
      me.id,
      me.library_kind,
      me.compendium_id,
      me.settings_library_id
    )
  order by ps.source_name, me.sort_order, effective_title;
$$;

create or replace function public.read_project_library_entries(
  target_project_id uuid,
  target_master_entry_id uuid default null
)
returns table (
  master_entry_id uuid,
  source_type text,
  source_id uuid,
  source_name text,
  effective_title text,
  effective_summary text,
  effective_body text,
  effective_properties jsonb
)
language sql
security invoker
set search_path = public
as $$
  select *
  from private.read_project_library_entries_for_current_user(
    target_project_id,
    target_master_entry_id
  );
$$;

grant usage on schema private to authenticated;
grant execute on function private.current_project_role(uuid) to authenticated;
grant execute on function private.resolve_project_library_visibility(text, text)
  to authenticated;
grant execute on function private.project_entry_source_default_visibility(
  uuid,
  text,
  uuid,
  uuid
) to authenticated;
grant execute on function private.can_read_project_library_entry(
  uuid,
  uuid,
  text,
  uuid,
  uuid
) to authenticated;
grant execute on function private.read_project_library_entries_for_current_user(
  uuid,
  uuid
) to authenticated;
grant execute on function public.read_project_library_entries(uuid, uuid)
  to authenticated;

drop policy if exists "Project members can read project entry overrides"
  on public.project_entry_overrides;

drop policy if exists "Project owners and GMs can read project entry overrides"
  on public.project_entry_overrides;

create policy "Project owners and GMs can read project entry overrides"
on public.project_entry_overrides
for select
to authenticated
using (
  private.current_project_role(project_entry_overrides.project_id)
    in ('owner', 'gm')
  and exists (
    select 1
    from public.project_sources ps
    join public.master_entries me
      on me.id = project_entry_overrides.master_entry_id
    where ps.project_id = project_entry_overrides.project_id
      and (
        (
          ps.source_type = 'compendium'
          and me.library_kind = 'compendium'
          and ps.compendium_id = me.compendium_id
        )
        or (
          ps.source_type = 'settings_library'
          and me.library_kind = 'settings_library'
          and ps.settings_library_id = me.settings_library_id
        )
      )
  )
);

drop policy if exists "Project members can read reachable project library master entries"
  on public.master_entries;

create policy "Project members can read reachable project library master entries"
on public.master_entries
for select
to authenticated
using (
  exists (
    select 1
    from public.project_sources ps
    where (
      (
        ps.source_type = 'compendium'
        and master_entries.library_kind = 'compendium'
        and ps.compendium_id = master_entries.compendium_id
      )
      or (
        ps.source_type = 'settings_library'
        and master_entries.library_kind = 'settings_library'
        and ps.settings_library_id = master_entries.settings_library_id
      )
    )
    and private.can_read_project_library_entry(
      ps.project_id,
      master_entries.id,
      master_entries.library_kind,
      master_entries.compendium_id,
      master_entries.settings_library_id
    )
  )
);
```

Expected Row Level Security behavior:

- Owners and GMs can read all reachable Project Library entries.
- Owners and GMs can read and manage Project Entry Override rows.
- Players and Viewers cannot directly read Project Entry Override rows.
- Players and Viewers use the `read_project_library_entries` RPC, which returns
  only effective visible entry fields and never returns override reasons or
  original-vs-overridden comparison data.
- Players and Viewers can read only Master Entries that are reachable through
  an attached Compendium or Settings Library source and resolved as visible.
- `master_entries.visibility` remains master-library visibility. It is not
  reinterpreted as Project player visibility.
- Game System sources stay out of entry listing for now because Systems are
  metadata containers at this app stage.

The app uses normal Supabase server clients and relies on RLS plus the safe
read RPC. Do not add a service role key to the app.

## Slice 5C: Library Source Metadata Schema Groundwork

Run this SQL in Supabase before manually testing Slice 5C forms. It is
non-destructive: it does not drop tables, rename tables, move Master Entries, or
create a unified `library_sources` table.

```sql
alter table public.projects
add column if not exists primary_game_system_id uuid references public.game_systems(id);

alter table public.compendiums
add column if not exists source_category text not null default 'expansion_supplement',
add column if not exists source_subtype text not null default 'supplement',
add column if not exists clone_policy text not null default 'locked_to_system',
add column if not exists default_player_visibility text not null default 'visible';

alter table public.settings_libraries
add column if not exists game_system_id uuid references public.game_systems(id),
add column if not exists source_category text not null default 'setting_world_lore',
add column if not exists source_subtype text not null default 'campaign_setting',
add column if not exists clone_policy text not null default 'cloneable_to_system',
add column if not exists default_player_visibility text not null default 'gm_only';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'compendiums_source_category_check'
  ) then
    alter table public.compendiums
    add constraint compendiums_source_category_check
    check (source_category in (
      'core_rulebook',
      'expansion_supplement',
      'setting_world_lore',
      'adventure_module',
      'other'
    ));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'compendiums_source_subtype_check'
  ) then
    alter table public.compendiums
    add constraint compendiums_source_subtype_check
    check (source_subtype in (
      'srd',
      'core_rulebook',
      'starter_set',
      'beginner_box',
      'rules_cyclopedia',
      'expansion_book',
      'supplement',
      'splatbook',
      'sourcebook',
      'bestiary',
      'monster_book',
      'campaign_setting',
      'gazetteer',
      'worldbook',
      'lorebook',
      'adventure',
      'module',
      'adventure_path',
      'adventure_anthology',
      'dungeon',
      'hexcrawl',
      'gm_screen',
      'rollable_table_collection',
      'reference_sheet',
      'homebrew_packet',
      'import_batch',
      'other'
    ));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'compendiums_clone_policy_check'
  ) then
    alter table public.compendiums
    add constraint compendiums_clone_policy_check
    check (clone_policy in (
      'locked_to_system',
      'cloneable_to_system',
      'system_agnostic'
    ));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'compendiums_default_player_visibility_check'
  ) then
    alter table public.compendiums
    add constraint compendiums_default_player_visibility_check
    check (default_player_visibility in ('visible', 'gm_only', 'mixed'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'settings_libraries_source_category_check'
  ) then
    alter table public.settings_libraries
    add constraint settings_libraries_source_category_check
    check (source_category in (
      'core_rulebook',
      'expansion_supplement',
      'setting_world_lore',
      'adventure_module',
      'other'
    ));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'settings_libraries_source_subtype_check'
  ) then
    alter table public.settings_libraries
    add constraint settings_libraries_source_subtype_check
    check (source_subtype in (
      'srd',
      'core_rulebook',
      'starter_set',
      'beginner_box',
      'rules_cyclopedia',
      'expansion_book',
      'supplement',
      'splatbook',
      'sourcebook',
      'bestiary',
      'monster_book',
      'campaign_setting',
      'gazetteer',
      'worldbook',
      'lorebook',
      'adventure',
      'module',
      'adventure_path',
      'adventure_anthology',
      'dungeon',
      'hexcrawl',
      'gm_screen',
      'rollable_table_collection',
      'reference_sheet',
      'homebrew_packet',
      'import_batch',
      'other'
    ));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'settings_libraries_clone_policy_check'
  ) then
    alter table public.settings_libraries
    add constraint settings_libraries_clone_policy_check
    check (clone_policy in (
      'locked_to_system',
      'cloneable_to_system',
      'system_agnostic'
    ));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'settings_libraries_default_player_visibility_check'
  ) then
    alter table public.settings_libraries
    add constraint settings_libraries_default_player_visibility_check
    check (default_player_visibility in ('visible', 'gm_only', 'mixed'));
  end if;
end $$;
```

Notes:

- `projects.primary_game_system_id` is nullable in this slice. Existing Projects
  do not need a backfill before the app can load them.
- `settings_libraries.game_system_id` is nullable. This supports system-neutral
  lore sources and avoids forcing a backfill.
- The app still creates Projects through `public.create_project`, then saves the
  optional primary System with a normal RLS-protected update. If the SQL above
  has not been run yet, Project creation should still complete without saving
  the primary System.
- Project Sources remain Slice 5A links. This slice only filters available
  Compendium and Settings Library choices gently when a Project has a primary
  System.
- The app uses normal Supabase server clients and relies on RLS. Do not add a
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
later slices, with `project_entry_overrides` deferred to Slice 5D.

The app uses normal Supabase server clients and relies on RLS. Do not add a
service role key to the app.

## Slice 5B: Library Source Taxonomy Alignment

Slice 5B does not require new Supabase SQL.

This slice introduces Library Source vocabulary and shared app constants only.
TableHub is moving toward:

```text
System
  -> Library Source
      -> Master Entry
          -> Project Source Link
              -> Project Entry Override
```

Compendiums and Settings Libraries remain the current concrete container tables.
Do not destructively migrate, delete, or rename them yet.

Project Library means the Library Sources attached to a Project. Projects should
eventually have one primary System, then attach compatible Library Sources.

Use "Adventures & Modules" instead of "Adventures & Campaigns" when describing
source categories so reusable adventure sources are not confused with active
Campaign play spaces.

The app uses normal Supabase server clients and relies on RLS. Do not add a
service role key to the app.
