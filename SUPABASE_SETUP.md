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
