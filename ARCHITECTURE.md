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
such as name, description, visibility, version, and source/provenance fields.
Slice 4B does not create compendium entries and does not import spells,
monsters, classes, items, SRD rows, book text, third-party data, or 5etools
data. It only creates the safe container that future entry and import slices can
attach to.

Master Settings Libraries are the third concrete Master Library record. A
Settings Library stores current Library Source metadata for reusable setting and
world lore, such as name, description, visibility, genre, tone, version, and
source/provenance fields. Slice 4C does not create setting entries, NPCs,
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
to one Entry Type, and stores simple plain text or Markdown textarea content,
aliases, summary, JSON properties, visibility, version, and source/provenance
metadata. Slice 4E does not add rich text editing, Markdown paste conversion,
wiki links, tags, folders, imports, Project links, Project overrides, public
marketplace behavior, SRD content, copyrighted book text, or 5etools imports.

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

Slice 4F adds navigation polish around this layer. The protected
`/master-library` overview page links together Game Systems, Compendiums,
Settings Libraries, Entry Types, and Master Entries as one reusable-original
workflow. It does not add database schema, SQL, new tables, imports,
tags/folders, rich text editing, Project sources, or overrides. Slice 5 begins
Project source linking and override groundwork.

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
- Slice 5C is expected to begin `project_entry_overrides`.
- Original vs modified rendering, manual master updates, imports, search,
  tags/folders, and rich text editing are still deferred.

Benefits:

- Protects original compendium/settings content
- Supports house rules
- Supports versioning
- Allows manual update from master content
- Allows original vs modified display
- Prevents accidental data loss

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
