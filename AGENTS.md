# AGENTS.md

This file gives coding agents project-specific instructions for TableHub.

## Project Summary

TableHub is a private-first tabletop roleplaying game hub for GMs and players.

It combines:

- Reusable Library hub
- GM workspace
- Player binder
- Settings/lore wiki
- Character sheets
- Dice roller
- Search
- Files and handouts

The first supported system is **D&D 5e 2014**.

## Development Philosophy

Build in small vertical slices.

Prefer:

- Clear code over clever code
- Beginner-readable comments
- Small components
- Explicit data flow
- Safe defaults
- Working checkpoints

Avoid:

- Huge rewrites without asking
- Large new dependencies without explaining why
- Hardcoded secrets
- UI-only security
- Mutating master compendium/settings content directly
- Overbuilding advanced systems before the foundation works

## Tech Stack

Use:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase for auth, database, storage, and RLS
- Vercel-compatible patterns
- Git branches per feature slice

## Local Development

Primary local environment:

- Windows
- PowerShell
- VS Code
- Node.js
- npm
- Git
- GitHub

Do not assume WSL2 unless explicitly requested.

## Core Architecture Rule: Linked Copies with Overrides

Master content must remain safe.

TableHub is moving toward this product model:

```text
System
  -> Library Source
      -> Master Entry
          -> Project Source Link
              -> Project Entry Override
```

Library Source is the product vocabulary for reusable source containers under a System. Compendiums and Settings Libraries are the current concrete container tables; do not destructively migrate, delete, or rename them until a later approved schema slice.

Use "Adventures & Modules" instead of "Adventures & Campaigns" for source categories so source books are not confused with active Campaigns.

When a system, Library Source, campaign template, entry template, or character sheet template is added to a Project, the Project should use linked copies with overrides.

Do not directly mutate the original master content when a Project or Campaign customizes it.

Pattern:

- Master entry stores canonical/original data.
- Project link references the master entry.
- Project override stores field-level differences.
- UI can show original, modified, and override status.
- Manual update from master content should be possible later.

Slice 5D begins this safely with `project_entry_overrides` and Project-scoped
library routes. Slice 5E adds Player/Viewer read mode for only the Project
Library entries resolved as visible. Keep Project Entry Override work separate
from Master Entry editing, and keep player-facing reveal controls for a later
approved slice.

Project Library player visibility resolves from Library Source default player
visibility plus `project_entry_overrides.override_visibility`. Do not
reinterpret `master_entries.visibility` as player-facing Project visibility.

## Permissions

Permissions must be enforced at the database level with Supabase Row Level Security when data is exposed through Supabase.

Do not rely only on hiding UI elements.

Roles:

- Owner
- GM
- Player
- Viewer

General rules:

- Owners can see everything in their owned spaces.
- A user can be GM in one campaign and Player in another.
- A campaign has one GM at a time, but GM ownership can be transferred.
- Viewers can only read.
- Players can create private journals, party notes, characters, and selected uploads.
- Player emails should not be visible to other players.
- Players should only search/view permissible entries.
- GM-only content must remain hidden from players unless revealed.

## Navigation Labels

Use these initial app sections:

- Dashboard
- Library
- Systems
- Projects
- Campaigns
- Characters
- Files
- Account

`Library` links to `/master-library`. The concrete `/compendium`,
`/settings-library`, `/entry-types`, and `/master-entries` workflows remain
reachable from Library pages and internal links, but they should not be separate
top-level sidebar items.

Avoid using "Games" as a major technical model unless clarified later.

## Design Direction

Use a clean modern dashboard.

Dark mode first, with light mode support.

Base palette:

- Black: `#000000`
- Prussian Blue: `#14213D`
- Orange/Gold: `#FCA311`
- Alabaster: `#E5E5E5`
- White: `#FFFFFF`

The UI should feel spacious, elegant, readable, and beginner-friendly.

Use subtle hover effects and transitions. Do not overdo animations.

## Rich Text and Wiki Direction

Slice 6A adds the shared rich text foundation:

- Use `src/components/editor/rich-text-editor.tsx` for Master Entry and Project Override body editing.
- Use the shared safe body renderer before showing stored entry HTML.
- Sanitize rich text output before rendering.
- Store Master Entry rich text in `master_entries.body` with `body_format = 'html'` when the database allows it.
- Store Project Override rich text in `project_entry_overrides.override_body`.

Slice 6B adds Markdown paste conversion inside that existing editor:

- Convert Markdown-looking plain-text paste to sanitized rich text HTML.
- Keep normal rich HTML paste on the editor's existing safe path.
- Keep ordinary pasted plain text readable as paragraphs.
- Do not treat this as an import workflow or a stored Markdown migration.

Slice 6C adds wiki-link syntax display groundwork:

- Recognize `[[Entry Name]]` and `[[Entry Name|label]]` only when rendering body content.
- Store the original syntax as normal body text in the existing fields.
- Render wiki syntax as non-navigating, link-like text with an accessible target label.

Slice 6D adds wiki-link resolution foundation:

- Resolve `[[Entry Name]]` and `[[Entry Name|label]]` only while rendering body content.
- Master Entry pages resolve against accessible entries in the same Compendium or Settings Library first.
- Project Library pages resolve against entries reachable in the same Project Library context.
- Player and Viewer Project Library resolution must use only visible read-mode entries and must not leak hidden or GM-only targets.
- Missing or ambiguous matches remain non-navigating wiki-link text.
- Do not add backlinks, broken-link placeholder creation, hover previews, autocomplete, search integration, imports, tabs, reveal blocks, tags/folders, file embeds, AI generation, collaboration, new tables, schema changes, or SQL without a later approved slice.

Slice 6E defines import source package manifest design only:

- Use `src/lib/import-source-package.ts` for manifest types and lightweight validation helpers.
- Manifest entries point to normalized source files; they must not include entry body content directly.
- Supported conceptual distribution statuses are `tablehub_distributable`, `private_user_upload`, `local_dev_fixture`, and `restricted_reference_only`.
- Optional extraction metadata may record offline preprocessing details such as source filename, file type, SHA-256, extraction method, page count, chunk count, extraction notes, and review-required state.
- PDF-to-Markdown tools are offline preprocessing tools for now. Do not copy prototype code, add PDF parsing, add AI calls, or add conversion jobs to TableHub in this slice.
- Slice 6E does not add import execution, a CLI import script, upload UI, file crawling, database writes, new tables, Supabase SQL, or schema changes.

Future entries should support:

- Rich text
- Markdown paste conversion refinements
- Wiki link resolution refinements
- Aliases
- Tags
- Folders
- Custom fields/properties
- Templates
- Tabs
- Hover previews
- GM-only sections
- Toggleable inline reveal boxes

Do not attempt all of this in the first slice.

## Character Sheet Direction

First target: D&D 5e 2014.

Long-term character sheets should support:

- Generic custom field sheet builder
- System-specific automated sheets
- Formula-based calculations
- Hover explanations for formulas
- Manual overrides
- Clear override warnings
- Customizable tabs
- System-specific default tabs
- Drag/drop or add-from-compendium behavior

Do not build the entire rules engine in the foundation slice.

## Dice Roller Direction

Long-term dice roller should support:

- `d20`
- `2d6`
- `1d20+5`
- Advantage/disadvantage
- Keep highest / keep lowest
- Exploding dice
- Success counting
- Daggerheart-style mechanics later
- Public/private/GM-only rolls
- Roll history
- Character sheet roll buttons
- Compendium entry roll buttons

Plain results first. Animated dice later.

## Search Direction

Search is a core product feature.

Long-term search should support:

- Global search
- Project-scoped search
- Filters
- Fuzzy matching
- Alias matching
- Rich-text body search
- Permission-aware results
- Hover previews
- `Ctrl+K` command palette
- Semantic/AI search later

## File and Upload Direction

Future uploads should support:

- Portraits
- Icons
- Maps
- Handouts
- Symbols
- PDFs
- Audio/video embeds
- Galleries
- Visibility rules
- Searchable metadata

No full VTT in MVP.


## Content Import and Licensing Rules

TableHub must distinguish clearly between four content sources:

1. TableHub-provided distributable content
2. Private user-owned imports
3. Local developer test fixtures
4. Restricted reference-only material

TableHub-provided content may only include SRD, ORC, Creative Commons, public-domain, explicitly licensed, partner-approved, or original demo content. Do not seed, bundle, market, or expose restricted/private rules text as TableHub-provided content.

Private user imports may include a user's own documents, notes, PDFs, Markdown files, or private reference material. These imports must remain private to that user or workspace unless a later approved sharing model explicitly allows otherwise.

Local developer fixtures may use private test material during development, but restricted/private files must not be committed, bundled, seeded, marketed, or exposed as TableHub-provided content. Use ignored local folders for private import fixtures and tiny original/fake fixtures for repository tests.

Restricted reference-only material may help a local owner understand or test an import path, but it must stay private/restricted and must not be treated as TableHub-provided distributable content.

Future import workflows must preserve source/provenance metadata, including source name, publisher or creator, license name, license URL when available, source URL when available, source notes, source category, source subtype, external source IDs, and whether TableHub may redistribute the content.

AI-assisted extraction or cleanup metadata is reviewable preprocessing context, not authoritative rules text. Human review should be required before any later import execution trusts that output.

If licensing or redistribution rights are unclear, the importer should treat the content as private/restricted by default and should not make it TableHub-distributable.

## Security Rules

Never commit secrets.

Use `.env.local` for local secrets and `.env.example` for documented variable names.

If creating database tables exposed through the browser, design for RLS from the beginning.

Treat hidden content seriously:

- GM-only content must not leak through API responses.
- Player email addresses must not appear in player-facing UI.
- Invite links should support expiration settings.

## Testing Rules

After every feature slice, update `MANUAL_TEST_CHECKLIST.md`.

For each slice, include:

- What changed
- How to run it locally
- Manual tests
- Known gaps
- Follow-up tasks

When practical, run:

```powershell
npm run lint
npm run build
```

Do not mark a slice complete if the app does not start locally.

## Documentation Rules

Keep these files updated:

- `PROJECT_BRIEF.md`
- `ROADMAP.md`
- `ARCHITECTURE.md`
- `DATA_MODEL.md`
- `MANUAL_TEST_CHECKLIST.md`
- `AGENTS.md`
- `.env.example`

Documentation should be plain English and beginner-readable.

## Dependency Rule

Before adding a major dependency, explain:

1. What it does
2. Why it is needed
3. What lighter alternative was considered

For small standard dependencies, proceed if they are clearly appropriate.

## Commit Style

Use clear commit messages.

Examples:

- `chore: initialize nextjs app`
- `docs: add project planning files`
- `feat: add app shell navigation`
- `feat: add supabase auth`
- `fix: protect dashboard route`

## Important Product Warning

This project can easily become enormous. Build the bones first.

Do not build the Death Star before the login screen.
