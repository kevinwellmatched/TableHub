# TableHub Roadmap

Version: 0.1

This roadmap uses vertical slices. Each slice should produce something visible, testable, and committable.

Branch pattern:

- `main` = stable and deployable
- `dev` = integration branch
- `feature/00-project-setup`
- `feature/01-app-shell`
- `feature/02-auth-profiles`
- etc.

Every slice should end with:

1. Working local build
2. Updated manual test checklist
3. Git commit
4. Push to GitHub
5. Short notes on what changed

---

## Slice 0: Repository and Project Setup

Status: Complete.

### Goal

Create the project foundation.

### Build

- Next.js App Router
- TypeScript
- Tailwind CSS
- ESLint
- Basic folder structure
- Documentation files
- Environment variable example file
- Supabase packages installed but not fully wired yet

### Suggested Initial Routes

- `/`
- `/dashboard`
- `/compendium`
- `/systems`
- `/settings-library`
- `/projects`
- `/campaigns`
- `/characters`
- `/files`
- `/account`

### Done When

- `npm run dev` starts the app
- App loads locally
- Placeholder homepage exists
- Docs exist
- `.env.example` exists
- No secrets are committed

---

## Slice 1: App Shell v1

Status: Complete in the current frontend-only slice.

### Goal

Make the app feel like TableHub even before the database exists.

### Build

- Main layout
- Sidebar navigation
- Header
- Search input placeholder
- Theme toggle
- Dark/light mode
- Responsive shell for desktop and mobile
- Placeholder cards for major sections

### Done When

- User can navigate between placeholder pages
- Dark mode works
- Light mode works
- Mobile layout remains readable and usable

---

## Slice 2: Authentication and Profiles

Status: Complete in the current auth/profile slice.

### Goal

Users can sign up, log in, log out, and have app profiles.

### Build

- Supabase Auth
- Sign up page
- Login page
- Logout action
- Protected app routes
- Profile table
- Username
- Display name
- Hidden email pattern
- Basic account page

### Done When

- User can create account
- User can log in
- User can log out
- User cannot access protected pages while logged out
- Username/display name can be viewed
- Emails are not shown in player-facing UI

---

## Slice 3: Projects and Membership

Status: Complete in the current projects/membership foundation slice.

### Goal

Create the workspace layer.

### Build

- Projects table
- Project members table
- Role model: Owner, GM, Player, Viewer
- Create project
- View project dashboard
- Basic membership display
- Ownership checks

### Done When

- Logged-in user can create a Project
- Creator becomes Owner
- Project appears on `/projects`
- Project detail dashboard loads
- Project routes enforce access rules

---

## Slice 4: Systems, Compendiums, and Settings Library

Status: In progress. Slice 4A Game Systems Foundation, Slice 4B Master Compendiums, Slice 4C Master Settings Libraries, Slice 4D Master Entry Types, and Slice 4E Basic Master Entries are complete in their foundation slices.

### Goal

Create reusable master libraries.

### Slice 4A: Game Systems Foundation

Status: Complete in the current systems foundation slice.

Build:

- Game Systems list page
- Create Game System page
- Game System detail dashboard
- Source/provenance metadata
- D&D 5e 2014 starter form prefill
- Supabase helpers that rely on Row Level Security

Done when:

- Logged-in user with a profile can create a system
- User is redirected to the system detail page after creation
- Created systems appear on `/systems`
- System detail page shows metadata and provenance fields
- Future system dashboard placeholders render
- Lint and build pass

### Slice 4B: Master Compendiums

Status: Complete in the current master compendiums foundation slice.

Goal:

- Add reusable compendium records that link to Game Systems.
- Keep master content safe for future Project linked copies and overrides.
- Do not import large content sets until provenance, visibility, and entry shape
  are clear.

Build:

- Compendium list page
- Create Compendium page
- Compendium detail dashboard
- Required Game System link
- Source/provenance metadata
- D&D 5e 2014 starter compendium prefill
- Supabase helpers that rely on Row Level Security

Done when:

- Logged-in user with a profile can open `/compendium`
- User can create a compendium linked to an accessible Game System
- User is redirected to the compendium detail page after creation
- Created compendiums appear on `/compendium`
- Compendium detail page shows linked system metadata and provenance fields
- Future compendium placeholder cards render
- No entries, imported rules text, SRD rows, book text, or 5etools data are added
- Test, lint, and build pass

### Slice 4C: Master Settings Libraries

Status: Complete in the current master Settings Libraries foundation slice.

Goal:

- Add reusable Settings Library records for setting-lore containers.
- Keep master content safe for future Project linked copies and overrides.
- Do not create entries or import notes, PDFs, Markdown, CSVs, maps, or lore
  content until provenance, visibility, and entry shape are clear.

Build:

- Settings Library list page
- Create Settings Library page
- Settings Library detail dashboard
- Source/provenance metadata
- Starter fantasy Settings Library prefill
- Supabase helpers that rely on Row Level Security

Done when:

- Logged-in user with a profile can open `/settings-library`
- User can create a Settings Library
- User is redirected to the Settings Library detail page after creation
- Created Settings Libraries appear on `/settings-library`
- Settings Library detail page shows provenance fields
- Future Settings Library placeholder cards render
- No setting entries, imported notes, PDFs, Markdown, CSVs, maps, or lore content
  are added
- Test, lint, and build pass

### Slice 4D: Master Entry Types

Status: Complete in the current master Entry Types foundation slice.

Goal:

- Add reusable Entry Type definitions for future Compendium entries and Settings
  Library entries.
- Keep this slice definition-only, with no actual entries, rich text, tags,
  folders, imports, field schemas, project links, or overrides.
- Prepare future entries to point to Entry Types instead of storing loose type
  labels.

Build:

- Entry Types utility list page at `/entry-types`
- Create Entry Type page at `/entry-types/new`
- Entry Type detail dashboard at `/entry-types/[entryTypeId]`
- Starter preset buttons for Compendium and Settings Library types
- Supabase helpers that rely on Row Level Security

Done when:

- Logged-in user with a profile can open `/entry-types`
- User can create Compendium Entry Types and Settings Library Entry Types
- User is redirected to the Entry Type detail page after creation
- Created Entry Types appear on `/entry-types`
- Entry Type detail page shows placeholder cards for future entries, fields,
  tags, folders, and project overrides
- No actual compendium entries, setting entries, imported rules text, or lore
  content are added
- Test, lint, and build pass

### Slice 4E: Basic Master Entries Foundation

Status: Complete in the current basic Master Entries foundation slice.

Goal:

- Add basic reusable original entries for Compendiums and Settings Libraries.
- Use one shared `master_entries` model for both library kinds.
- Keep content simple with textarea plain text or Markdown only.
- Keep future Project customization safe through linked copies with overrides.

Build:

- Master Entries utility list page at `/master-entries`
- Create Master Entry page at `/master-entries/new`
- Master Entry detail page at `/master-entries/[masterEntryId]`
- Supabase helpers that rely on Row Level Security
- Starter preset buttons for placeholder Compendium and Settings Library notes
- Links from Compendium, Settings Library, and Entry Type foundation pages

Done when:

- Logged-in user with a profile can open `/master-entries`
- User can create Compendium Master Entries and Settings Library Master Entries
- User is redirected to the Master Entry detail page after creation
- Created entries appear on `/master-entries`
- Created entries are linked from parent Compendium or Settings Library detail
  pages
- Master Entry detail page shows aliases, body, properties, source/provenance,
  and placeholder cards
- No rich text editing, imports, tags, folders, wiki links, Project links,
  Project overrides, SRD content, copyrighted book text, or 5etools imports are
  added
- Test, lint, and build pass

---

## Slice 5: Project Imports and Linked Overrides

### Goal

Prove the core architecture.

### Build

- Attach systems to projects
- Attach compendiums to projects
- Attach settings libraries to projects
- Store project-level overrides separately from master entries
- Show original and modified versions
- Manual update from master content

### Done When

- A Project can use a master compendium entry
- The Project can override that entry
- The master entry remains unchanged
- UI clearly marks overridden fields

---

## Slice 6: Rich Text Wiki and Entry Editing

### Goal

Make lore and compendium content pleasant to write and read.

### Build

- Rich-text editor
- Markdown paste conversion
- `[[wiki links]]`
- Broken link placeholders
- Aliases
- Hover preview groundwork
- Overview and GM Notes tabs
- Custom named tabs
- Add-tab button
- Custom fields/properties panel
- Entry templates

### Done When

- User can create and edit rich text entries
- Markdown can be pasted and converted
- Wiki links can connect entries
- GM Notes are protected
- Custom fields display in a sidebar/panel

---

## Slice 7: Search

### Goal

Make search a core feature, not an afterthought.

### Build

- Global search
- Project-scoped search
- Filters
- Fuzzy matching
- Alias matching
- Body-content search
- Permission-aware results
- `Ctrl+K` command palette
- Hover previews

### Done When

- Search works globally
- Search works inside a Project
- Players only see permitted results
- Aliases are searchable
- Command palette opens with `Ctrl+K`

---

## Slice 8: Characters v1

### Goal

Create usable character binders before deep automation.

### Build

- Character list
- Character profile
- Campaign assignment
- One active campaign per character
- Custom fields
- Tabs
- Basic D&D 5e 2014 sheet shell
- Manual override warnings

### Done When

- Player can create a character
- GM can create a character for a player
- Character can be assigned to a campaign
- Character can have custom fields/tabs
- Manual overrides are visibly marked

---

## Slice 9: Dice Roller

### Goal

Add table utility.

### Build

Support:

- `d20`
- `2d6`
- `1d20+5`
- Advantage/disadvantage
- Keep highest / keep lowest
- Exploding dice
- Success counting
- Private, public, and GM-only rolls
- Roll history
- Character sheet roll buttons
- Compendium entry roll buttons

### Done When

- User can roll common dice notation
- Rolls can be public/private/GM-only
- Roll history respects visibility
- Character buttons can trigger rolls

---

## Slice 10: Journals, Notes, Files, and Handouts

### Goal

Support campaign play and player note-taking.

### Build

- Private journals
- GM-visible private journals
- Party journals
- Session notes
- Player-created notes
- GM promotion of player notes into official wiki entries
- Image/file uploads
- Handout visibility
- Searchable file metadata
- Galleries for Projects/Campaigns/Settings Libraries

### Done When

- Players can keep private and party notes
- GM can review/promote player notes
- Files can be attached to entries
- Handouts can be revealed
- Files are searchable by title/tags/metadata

---

## Later Major Milestones

### Multi-System Character Sheet Engine

- Formula engine
- Custom system builders
- GM-editable formulas
- Hover explanations for formulas
- System-specific defaults
- Drag-and-drop compendium features
- Character importers

### Interactive Maps

- Image maps first
- Pins and markers
- Revealed/hidden map regions
- Linked map pins to entries
- No full VTT until much later

### AI Features

- Turn rough notes into structured wiki/session notes
- Generate NPCs
- Summarize sessions
- Suggest links
- Help with character backstories
- Cite/link used lore
- Respect GM-only content
- GM toggle: AI may or may not invent canon
