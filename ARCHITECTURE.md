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

---

## First Target System

D&D 5e 2014.

Build the first automated sheet around generic D&D 5e-compatible concepts, then expand later to D&D 5e 2024/5.5e and other systems.

---

## Future Systems

The architecture should eventually support many systems, including system-agnostic projects.

Avoid hardcoding all game logic directly into UI components. System-specific rules should eventually live in data-driven templates, formulas, and rule definitions.
