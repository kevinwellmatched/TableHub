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

Examples:

- Game systems
- Master compendiums
- Master Settings Libraries
- Campaign templates
- Entry templates
- Character sheet templates

Master content should be protected from accidental mutation.

Game Systems are the first concrete Master Library record. A Game System stores
ruleset metadata such as name, edition, publisher, ruleset year, visibility,
version, and source/provenance fields. Slice 4A does not import compendium
content, rules text, spells, classes, SRD data, Markdown books, or PDFs. It only
creates the foundation future imports can attach to cleanly.

System provenance fields record license and source information so future SRD
imports, private Markdown/PDF/CSV imports, manual entries, and external
references do not become unclear or unsafe. Future Projects will link to Game
Systems and store Project-specific overrides separately instead of mutating the
master system record.

### 2. Project Layer

A Project is a workspace that combines systems, compendiums, settings, and campaigns.

Projects use linked copies with overrides.

A Project can have:

- One or more systems
- One or more compendiums
- One or more Settings Libraries
- One or more campaigns
- Project-specific overrides
- Members and roles
- Files
- Tags/folders
- Visibility rules

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
