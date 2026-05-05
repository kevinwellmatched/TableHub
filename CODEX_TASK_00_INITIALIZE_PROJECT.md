# Codex Task 00: Initialize TableHub Project

Paste this prompt into Codex while it is opened in the empty local TableHub project folder.

---

You are working on TableHub, a private-first tabletop roleplaying game hub for GMs and players.

Your task is to initialize the repository foundation only.

Do not build auth, database tables, rich text editing, dice rolling, character sheets, or real Supabase integration yet. This first task is just the clean project foundation.

## Requirements

Use:

- Next.js App Router
- TypeScript
- Tailwind CSS
- ESLint
- npm
- Windows PowerShell-compatible commands
- Beginner-readable code and comments

## Step 1: Inspect the Folder

First inspect the current folder.

If it is empty, scaffold the app in the current folder.

If it is not empty, do not delete anything important. Report what you found and make the safest minimal changes.

## Step 2: Scaffold Next.js

If the folder is empty, create the Next.js app in the current directory using a command equivalent to:

```powershell
npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir --import-alias "@/*"
```

Use sensible defaults when prompted.

## Step 3: Install Initial Dependencies

Install only foundational dependencies:

```powershell
npm install @supabase/supabase-js @supabase/ssr lucide-react clsx tailwind-merge class-variance-authority
```

Do not add a rich text editor yet.
Do not add a dice parser yet.
Do not add shadcn/ui yet unless you explain why and keep the setup minimal.

## Step 4: Add Planning Docs

Create these files in the project root if they do not already exist:

- `PROJECT_BRIEF.md`
- `ROADMAP.md`
- `AGENTS.md`
- `MANUAL_TEST_CHECKLIST.md`
- `ARCHITECTURE.md`
- `DATA_MODEL.md`
- `.env.example`

Use the existing TableHub planning direction:

- App name: TableHub
- First system: D&D 5e 2014
- Primary sections: Dashboard, Compendium, Systems, Settings Library, Projects, Campaigns, Characters, Files, Account
- Core architecture: linked copies with overrides
- Master compendium/settings content must remain safe
- Project and campaign edits must not mutate master originals
- Permissions must eventually be enforced with Supabase RLS
- Player emails must not be visible to other players

For `ARCHITECTURE.md`, write a concise first version covering:

- Stack
- App layers
- Master library layer
- Project layer
- Campaign layer
- Character layer
- Linked copies with overrides
- Supabase/RLS security principle

For `DATA_MODEL.md`, write a concise first version covering likely future tables:

- profiles
- game_systems
- compendiums
- compendium_entries
- settings_libraries
- setting_entries
- projects
- project_members
- project_sources
- project_entry_overrides
- campaigns
- campaign_members
- characters
- character_campaigns
- tags
- folders
- files
- dice_rolls
- journals
- session_notes

Do not create database migrations yet.

## Step 5: Add Environment Example

Create `.env.example` with placeholder names only:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Ensure `.env.local` is ignored by Git.

## Step 6: Create Basic Placeholder App Shell

Create a simple but polished placeholder home/dashboard.

It should:

- Use the TableHub name
- Use the black/gold/navy/alabaster palette
- Show the primary sections as cards
- Mention that Supabase is not connected yet
- Be responsive
- Use Tailwind
- Support dark-mode-friendly styling, even if full theme toggle comes in the next slice

Do not overbuild. This is a foundation slice.

## Step 7: Verify

Run:

```powershell
npm run lint
npm run build
```

If either fails, fix the issue.

## Step 8: Report Back

When done, summarize:

- Files created
- Dependencies installed
- Commands run
- Whether lint/build passed
- Any known issues
- Suggested git commit message

Suggested commit message:

```text
chore: initialize tablehub project foundation
```
