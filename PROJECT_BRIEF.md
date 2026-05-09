# TableHub Project Brief

Version: 0.1  
Primary builder: Kev  
Development model: ChatGPT for planning, Codex for implementation, GitHub for source control

---

## Mission

TableHub is a private-first tabletop roleplaying game hub for GMs and players. It centralizes the tools normally scattered across paid memberships, websites, apps, books, PDFs, paper character sheets, Discord, virtual tabletop tools, and campaign wikis.

The goal is faster, smoother play with fewer context switches.

TableHub should become the home base for:

- Game system compendiums
- Campaign/project dashboards
- Character sheets and character binders
- Settings/lore libraries
- Player journals and party notes
- Dice rolling
- Search
- Files, maps, handouts, portraits, and embedded media

The first target system is **D&D 5e 2014**.

---

## Product Identity

TableHub has three major faces.

### 1. Compendium Library

A book-style, readable, browsable, searchable library for game systems and rules content.

Examples of content:

- Rules
- Classes
- Subclasses
- Species/ancestries
- Backgrounds
- Feats
- Spells
- Items
- Monsters
- Conditions
- NPCs
- Vehicles
- Custom entry types

### 2. GM Workspace

A GM-facing dashboard for preparing and running games.

Examples of content:

- Projects
- Campaigns
- Settings Library entries
- NPCs
- Places
- Factions
- Quests
- Session notes
- GM-only notes
- Revealed lore
- Maps and handouts
- Dice history
- Relationship trackers
- Timeline/calendar

### 3. Player Binder

A player-facing dashboard for active games.

Examples of content:

- Characters
- Character sheets
- Private journals
- Party journals
- Inventory
- Quests
- Relationships
- Revealed lore
- Session notes
- Roll history

---

## Core Vibe

Clean modern dashboard. Dark mode first. Spacious, elegant, readable, and beginner-friendly.

Inspiration:

- LegendKeeper
- D&D Beyond
- Netflix-style browsing for compendiums/systems/campaigns

Avoid:

- Archives of Nethys-style density
- Wikipedia-style visual flatness
- Fandom.com chaos

### Base Design Palette

- Black: `#000000`
- Prussian Blue: `#14213D`
- Orange/Gold: `#FCA311`
- Alabaster: `#E5E5E5`
- White: `#FFFFFF`

The app should support dark mode and light mode. GMs should eventually be able to choose campaign themes.

---

## Confirmed Top-Level Navigation

Use these labels for the first app shell:

1. Dashboard
2. Compendium
3. Systems
4. Settings Library
5. Projects
6. Campaigns
7. Characters
8. Files
9. Account

Search should be prominent globally and should eventually support a `Ctrl+K` command palette.

---

## Core Definitions

### Game System

A ruleset such as D&D 5e 2014, D&D 5e 2024/5.5e, Pathfinder 2e, Daggerheart, Shadowdark, Mothership, or a custom system.

### Compendium

A reusable master library of rules/reference content tied to a system or usable generically.

### Settings Library

A reusable lore/world bible. This replaces the earlier placeholder term "Worlds."

Examples:

- Places
- Factions
- NPCs
- Deities
- Timelines
- Histories
- Maps
- Secrets
- Custom lore entry types

### Project

A workspace that combines one or more systems, compendiums, settings, and campaigns.

A Project may contain multiple campaigns.

When a game system, compendium, campaign template, or settings library is added to a Project, the Project gets editable linked copies/overrides. The original master content must remain safe.

### Campaign

An active game space inside a Project. A campaign can also be reused as a template in multiple projects.

Users see Campaigns when they are the GM or have accepted an invite.

### Character

A player or GM-created character. A character can belong to multiple campaigns historically, but only one campaign is active at a time.

---

## Foundational Architecture Rule

TableHub uses **linked copies with overrides**.

Master content stays intact. Project-level and campaign-level changes are stored as overrides.

Example:

- Master spell: Fireball, 8d6 fire damage
- Project override: Fireball deals 6d6 fire damage in this campaign

The original compendium entry is not mutated.

The app must support:

- Original text
- Project-modified text
- Manual update from master content
- Versioning
- House rules
- Clear display of what has been overridden

This rule applies to:

- Game systems
- Compendium entries
- Settings Library entries
- Campaign templates
- Character sheet templates

---

## Roles

Primary roles:

- Owner
- GM
- Player
- Viewer

Rules:

- A user can be GM in one campaign and player in another.
- A campaign has one GM at a time, but GM ownership can be transferred.
- Viewers can only read.
- Players can create private journals, party notes, characters, and certain uploads such as icons/portraits.
- GMs can reveal GM-only content to players.
- GMs can reveal only part of a page through toggleable inline reveal boxes.
- Permissions must be enforced at the database level, not only hidden in the UI.

---

## Privacy and Safety

- Anyone with an email can create an account.
- Users create a globally unique username.
- Users also have a changeable display name.
- Player emails should not be visible to other players.
- Campaign invites can be sent by username, email, or share link.
- Invite expiration should be configurable by the GM.
- Campaigns are invite-only.
- Public profiles may exist eventually.
- Minors may use the app, so safety and privacy defaults matter.
- Payment information may exist later, but not in the first build.


## Content Source Principle

TableHub may ship with SRD, ORC, Creative Commons, public-domain, explicitly permitted, partner-approved, or original demo content.

Users may privately import their own documents, notes, PDFs, Markdown files, and reference material for personal or workspace use. Private imported material must remain private to that user or workspace unless a later approved sharing model explicitly allows otherwise.

Local development may use private or restricted source material as test fixtures, but those files must not be committed, bundled, seeded, marketed, or exposed as TableHub-provided content. Restricted reference-only material must stay private/restricted even when it helps a local owner test a workflow.

Every future import workflow should preserve source/provenance metadata and clearly distinguish TableHub-distributable content from private user uploads, local developer fixtures, and restricted reference-only material. Offline PDF-to-Markdown or AI-assisted cleanup tools should be treated as reviewable preprocessing; TableHub should consume normalized source packages with explicit manifests before any later import execution.

The first import execution is local/admin-only. It consumes normalized Markdown
source packages, dry-runs by default, and requires an explicit owner ID plus a
local service role key before writing to existing master-library tables. This is
not a public upload system, PDF parser, or AI cleanup workflow.

---

## First Table-Ready Demo Scenario

Build toward this first demo:

Create a D&D 5e 2014 fantasy project using:

- One starter game system
- One starter compendium
- One starter Settings Library
- One project
- One campaign
- One GM account
- Two player accounts
- Two characters
- Three lore/wiki pages
- A dice roller
- Basic project-scoped search
- Player-visible and GM-only content

---

## Not in the First Build

Do not build these in the earliest slices:

- Full VTT
- 3D animated dice
- Payments
- Public marketplace
- Mobile app
- Advanced AI lore generation
- Automated imports from third-party character builders
- Fully generalized multi-system rules engine

These can come later.

---

## MVP Stages

### Stage 1: Foundation MVP

The app exists and users can log in.

Done when:

- Next.js app runs locally
- GitHub repo exists
- Vercel deployment works
- Supabase project is connected
- Users can sign up, log in, and log out
- Users have username/display name profiles
- App shell exists
- Dark/light mode exists
- Seed/test data exists

### Stage 2: Creator MVP

Users can create and organize content.

Done when:

- Game Systems can be created
- Compendiums can be created
- Settings Libraries can be created
- Projects can be created
- Systems/compendiums/settings can be attached to Projects
- Entries support tags, folders, visibility, custom fields, and rich text
- `[[wiki links]]` work
- Basic search works

### Stage 3: Table-Ready Alpha

The app is usable during a real session.

Done when:

- D&D 5e 2014 character sheet v1 exists
- Basic stat calculations exist
- Manual overrides exist
- Dice roller supports common notation
- Roll history exists
- Character sheet roll buttons exist
- Compendium entries can be linked/copied/dragged to sheets
- Player journals exist
- Party notes exist
- Campaign dashboard exists
- Files/images can be attached
- Permission-aware search works
- Manual test checklist exists for every slice
