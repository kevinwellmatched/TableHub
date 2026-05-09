# TableHub Architecture

Version: 0.1

This file is a living technical overview. Keep it beginner-readable.

---

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase Postgres
- Supabase Storage
- Supabase Row Level Security
- Vercel deployment
- GitHub source control
- Codex-assisted local development

---

## App Layers

TableHub is organized into four major conceptual layers.

### 1. Master Library Layer

Reusable original content.

TableHub is moving toward this product model:

```text
System
  -> Library Source
      -> Master Entry
          -> Project Source Link
              -> Project Entry Override
```

A Library Source is a reusable source/container under a System, such as a core
rulebook, supplement, setting book, adventure module, GM screen, table
collection, homebrew packet, or import batch. Compendiums and Settings
Libraries are the current concrete container tables. Do not destructively
migrate, delete, or rename those tables yet.

Use "Adventures & Modules" instead of "Adventures & Campaigns" when describing
source categories so reusable source containers are not confused with active
Campaign play spaces.

Examples:

- Game systems
- Master compendiums
- Master Settings Libraries
- Entry Type definitions
- Master Entries
- Campaign templates
- Entry templates
- Character sheet templates

Master content should be protected from accidental mutation.

Game Systems are the first concrete Master Library record. A Game System stores
ruleset metadata such as name, edition, publisher, ruleset year, visibility,
version, and source/provenance fields. Slice 4A does not import compendium
content, rules text, spells, classes, SRD data, Markdown books, or PDFs. It only
creates the foundation future imports can attach to cleanly.

Master Compendiums are the second concrete Master Library record. A Compendium
links to one Game System and stores current Library Source container metadata
such as name, description, visibility, source category, source subtype, clone
policy, default player visibility, version, and source/provenance fields.
Slice 5C adds the source metadata fields non-destructively to the existing
`compendiums` table. Slice 4B does not create compendium entries and does not import spells,
monsters, classes, items, SRD rows, book text, third-party data, or 5etools
data. It only creates the safe container that future entry and import slices can
attach to.

Master Settings Libraries are the third concrete Master Library record. A
Settings Library stores current Library Source metadata for reusable setting and
world lore, such as name, description, visibility, genre, tone, version, and
source/provenance fields. Slice 5C adds optional Game System linking plus source
category, source subtype, clone policy, and default player visibility fields to
the existing `settings_libraries` table. Slice 4C does not create setting entries, NPCs,
places, factions, deities, maps, timelines, lore pages, imports, or third-party
lore content. It only creates the safe container that future entry, import,
reveal, and Project-link slices can attach to.

Entry Types are the fourth concrete Master Library foundation record. An Entry
Type stores reusable category metadata for future Compendium entries and
Settings Library entries, such as Rule, Spell, NPC, Place, or a custom type.
Slice 4D creates definitions only. It does not create actual entries, rich-text
body content, tags, folders, imports, field schemas, Project links, or
overrides.

Master Entries are the fifth concrete Master Library foundation record. A Master
Entry is shared by Compendiums and Settings Libraries through one
`master_entries` model. Each entry belongs to exactly one parent library, points
to one Entry Type, and stores aliases, summary, body content, JSON properties,
visibility, version, and source/provenance metadata. Slice 6A adds the basic
rich text editor foundation for the existing body fields. It uses the shared
Tiptap editor component for writing and a shared safe body renderer for reading.
Existing text fields still store the content; no rich text tables are added.
Slice 6A.1 keeps `master_entries.library_kind` as the internal structural field
for the current concrete parent tables while polishing user-facing copy toward
Library Source language. Source categories such as Core Rulebooks, Expansions &
Supplements, Setting & World Lore, and Adventures & Modules live on the parent
Compendium or Settings Library source container; they are not Master Entry
`library_kind` values.
Slice 6B adds Markdown paste conversion inside the existing rich text editor.
Plain-text paste that looks like common Markdown is converted to sanitized rich
text HTML before it enters the editor. This is not an import pipeline; it keeps
using the existing `body` text field and safe renderer.
Slice 6C adds wiki-link syntax recognition for `[[Entry Name]]` and
`[[Entry Name|label]]` during display. Wiki links render as distinct,
non-navigating link-like text with an accessible target label. The original
syntax remains stored as normal body text in existing fields.
Slice 6D resolves wiki links to real Master Entries when there is exactly one
safe match in the current rendering context. Master Entry pages resolve against
accessible sibling entries in the same Compendium or Settings Library. Missing
or ambiguous matches remain non-navigating wiki-link text.
Slices 6A through 6D do not add backlinks, broken-link placeholders, hover
previews, autocomplete, reveal blocks, GM sections, tabs, tags, folders, import
execution, file embeds, AI generation, collaboration, public marketplace
behavior, SRD content, copyrighted book text, 5etools imports, new tables,
schema changes, or SQL. Slice 6E adds import source package manifest types,
validation helpers, and a tiny original/fake example manifest only; it still
does not import records or read source files.

System provenance fields record license and source information so future SRD
imports, private Markdown/PDF/CSV imports, manual entries, and external
references do not become unclear or unsafe. Future Projects will link to Game
Systems and store Project-specific overrides separately instead of mutating the
master system record.

Compendium provenance fields serve the same purpose for future reference
content. Any future compendium entry, import, or external reference must track
where the content came from and what license or ownership note applies. Future
Projects will link to Compendiums through linked copies with overrides, not by
directly changing master Compendium records.

Settings Library provenance fields serve the same purpose for future setting
lore. Any future setting entry, note import, campaign export, or external
reference must track where the content came from. Future Projects will link to
Settings Libraries through linked copies with overrides, not by directly
changing master Settings Library records.

Entry Types prepare both Compendium and Settings Library entry creation without
creating any content yet. Future entries should point to Entry Types, and future
Project customization must use linked copies with overrides rather than direct
mutation of master definitions or master entries.

Master Entries are original reusable content. Future Project customization must
use linked copies with overrides instead of directly mutating a master entry.
The app reads and writes Master Entries with normal Supabase clients and relies
on Row Level Security for access.

Slice 4F adds navigation polish around this layer. Slice 5C.1 promotes the
protected `/master-library` overview into the top-level `Library` sidebar item.
The page links together Systems, Library Sources, Entry Types, and Master
Entries as one reusable-original workflow while preserving `/compendium`,
`/settings-library`, `/entry-types`, and `/master-entries` as concrete internal
routes. It does not add database schema, SQL, new tables, imports, tags/folders,
rich text editing, Project sources, or overrides.

### 2. Project Layer

A Project is a workspace that should eventually choose one primary System,
attach compatible Library Sources into its Project Library, and contain active
Campaigns.

Projects use linked copies with overrides.

A Project can have:

- One primary System
- One or more compendiums
- One or more Settings Libraries
- One or more campaigns
- Project-specific overrides
- Members and roles
- Files
- Tags/folders
- Visibility rules

Slice 5A implements the first Project Source links, which are the current
foundation for the Project Library. A Project can attach an accessible Game
System, Compendium, or Settings Library through `project_sources`. The app shows
these links on the Project detail page and provides a small
`/projects/[projectId]/sources` management page. These links do not copy
entries, create overrides, import data, or change master records. Those
behaviors remain later work.

Slice 5C adds optional `projects.primary_game_system_id` support. New Projects
can choose a primary System when one is available, existing Projects can remain
unset, and Project Source attachment gently prefers sources that match the
primary System without blocking the existing attach flow.

Slice 5D adds the first Project Entry Override groundwork. Project Owners and
GMs can open `/projects/[projectId]/library`, view Master Entries reachable
through attached Compendium and Settings Library sources, and save a
Project-specific override at `/projects/[projectId]/library/[masterEntryId]`.
The effective Project Entry is resolved by combining the original Master Entry
with the override row. The original `master_entries` row is never updated from a
Project page.

Slice 5E adds the first player-safe read mode for the Project Library. Owners
and GMs still get the management experience with all reachable entries,
original values, effective values, override reasons, and edit/reset controls.
Players and Viewers get a read-only Project Library that returns only entries
resolved as visible to them.

Project Library player visibility is resolved from the attached source default
player visibility plus `project_entry_overrides.override_visibility`.
`master_entries.visibility` remains master-library visibility and must not be
treated as Project player visibility. Player and Viewer read mode must not
return hidden entries, GM-only entries, override reasons, or original vs
overridden comparison data.

Slice 6A also lets Project Owners and GMs write rich text HTML into
`project_entry_overrides.override_body` through the same shared editor. Project
Library rendering uses the safe body renderer and resolves Project override
body format conservatively: override bodies that look like HTML render as
sanitized HTML, while legacy plain text continues to render safely. Reveal
controls, Project search, imports, tags/folders, inline reveal blocks, and
campaign-level overrides remain later work. Slice 6B reuses this same editor
paste behavior for Project Entry Override bodies without adding an
`override_body_format` column. Slice 6C uses the same safe renderer to style
wiki-link syntax in effective Project Library bodies without resolving links or
returning extra hidden data. Slice 6D resolves Project Library wiki links to
`/projects/[projectId]/library/[masterEntryId]` only when the match is unique
inside the same Project Library context. Owner and GM candidate sets can include
all reachable Project Library entries. Player and Viewer candidate sets come
from the visible-only read mode, so hidden or GM-only entries behave the same as
unresolved links and are not revealed.

Reveal controls, Project search, imports, tags/folders, wiki-link refinements,
inline reveal blocks, and campaign-level overrides remain later work.

### 3. Campaign Layer

A Campaign is an active play space inside a Project.

Campaigns include:

- GM dashboard
- Players
- Characters
- Quests
- Journals
- Party notes
- Session notes
- Dice history
- Handouts
- Revealed lore
- Relationship trackers
- Maps/files

Campaigns can also be reused as templates.

### 4. Character Layer

Characters can exist across campaigns historically, but only one campaign is active at a time.

Characters include:

- Profile
- Character sheet
- Tabs
- Custom fields
- Inventory
- Notes
- Relationships
- Rules links
- Manual overrides

---

## Linked Copies with Overrides

This is the central architecture pattern.

Master content remains unchanged. Project or campaign customization is stored separately as override data.

Pattern:

- `master_entry` stores canonical content.
- `project_source` links a project to master content.
- `project_entry_override` stores changes for that project.
- UI resolves the effective entry by combining master content plus overrides.

Current implementation status:

- Slice 5A implements `project_sources` for Game Systems, Compendiums, and
  Settings Libraries.
- Slice 5C adds Library Source metadata and optional Project primary System
  groundwork.
- Slice 5D begins `project_entry_overrides`, effective Project Entry
  resolution, original vs overridden field display, and reset/delete override
  actions.
- Slice 5E adds Project Library visibility resolution and Player/Viewer
  read-only mode for entries resolved as visible.
- Slice 6D resolves wiki links only to unique, safe matches in Master Entry and
  Project Library body rendering.
- Manual master updates, imports, search, tags/folders, backlinks, broken-link
  creation, hover previews, autocomplete, campaign-level overrides, and inline
  reveal controls are still deferred.

Benefits:

- Protects original compendium/settings content
- Supports house rules
- Supports versioning
- Allows manual update from master content
- Allows original vs modified display
- Prevents accidental data loss

---


## Import Pipeline and Content Provenance Direction

Future imports should use a source package pipeline rather than treating raw PDFs or Markdown blobs as trusted structured data.

Recommended pipeline:

```text
Source document, PDF, Markdown files, CSV, or external source
  -> extraction / cleanup tool
  -> normalized Markdown or structured source package
  -> manifest with provenance, license, and distribution metadata
  -> validation / dry run report
  -> import into Game System, Library Source container, Entry Types, and Master Entries
```

PDF-to-Markdown tools should initially be treated as offline preprocessing tools, not direct production import features. The importer should consume normalized source packages with explicit manifests.

Slice 6E defines that manifest shape in `src/lib/import-source-package.ts`.
Manifests are JSON- or object-shaped metadata for later tooling; this slice does
not decide YAML support, crawl files, parse Markdown, parse PDFs, call AI
services, create jobs, or write to the database.

Future import manifests should distinguish between:

- TableHub-provided distributable content, such as SRD, ORC, Creative Commons, public-domain, explicitly licensed, partner-approved, or original demo content
- Private user-owned imports, such as a user's own PDFs, notes, Markdown files, or reference material
- Local developer fixtures used only for private development and stress testing
- Restricted reference material that may help local testing but must not be bundled, seeded, marketed, or exposed as TableHub-provided content

Slice 6E uses these conceptual distribution statuses:

- `tablehub_distributable`
- `private_user_upload`
- `local_dev_fixture`
- `restricted_reference_only`

The importer should validate source metadata, entry type mapping, slug strategy, external IDs, file pointers, and distribution status before writing records. Missing or ambiguous license/provenance metadata should fail dry-run validation or default to private/restricted handling.

Optional extraction metadata may preserve offline preprocessing context such as
original filename, original file type, SHA-256, extraction tool name/version,
extraction method, extraction date, page count, chunk count, extraction notes,
and whether human review is required. AI-assisted extraction is only reviewable
preprocessing metadata; it is not authoritative TableHub rules text.

Current source/provenance fields on Game Systems, Compendiums, Settings Libraries, and Master Entries remain the active storage path until a later approved schema slice adds dedicated import tables or package records.

---

## Security Principle

Permissions must be enforced with Supabase Row Level Security once database tables are exposed through the browser.

UI hiding is not enough.

Examples:

- GM-only content should not be returned to players.
- Player emails should not be visible to other players.
- Project-scoped search should only return content the user can access.
- Invite-only campaigns should require membership.

## Project Membership Access

Projects are the first real workspace object in TableHub. Access is based on
membership rows in `project_members`.

Current Project roles are:

- Owner
- GM
- Player
- Viewer

The browser app uses normal Supabase server clients and the public anon key. It
does not use a service role key and does not bypass Row Level Security.

When the app reads Projects, it relies on database RLS to decide which rows the
current user can see. UI filtering can make pages friendlier, but it is not the
security boundary. If a user is not a member of a Project, the database should
not return that Project to the app.

New Projects are created through the `create_project` RPC so the Project row and
the creator's Owner membership are created in one database operation.

Project Sources are created through the `attach_project_source` RPC. The app
uses normal Supabase server clients, passes the requested Project and source,
and lets the database validate membership, RLS visibility, and duplicate rules.
Removing a Project Source uses a filtered delete against `project_sources`; RLS
decides whether the row can actually be removed.

## Auth and Profiles

TableHub uses Supabase Auth with cookie-based server-side rendering helpers.

The app has public auth pages for login and signup, then protects the main app
sections behind a logged-in session. A user must also create a profile with a
username and display name before entering the app shell.

Only profile fields that are safe to show in tabletop spaces should appear in
the app shell. Sign-in email addresses are private account data, not normal
profile fields.

---

## First Target System

D&D 5e 2014.

Build the first automated sheet around generic D&D 5e-compatible concepts, then expand later to D&D 5e 2024/5.5e and other systems.

---

## Future Systems

The architecture should eventually support many systems, including system-agnostic projects.

Avoid hardcoding all game logic directly into UI components. System-specific rules should eventually live in data-driven templates, formulas, and rule definitions.
