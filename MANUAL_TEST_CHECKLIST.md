# TableHub Manual Test Checklist

Version: 0.1

Use this checklist after each vertical slice.

For every slice:

1. Pull latest code.
2. Install dependencies if needed.
3. Start local dev server.
4. Test expected behavior manually.
5. Run lint/build if available.
6. Record known issues.
7. Commit only when the app runs.

---

## General Local Commands

From the project root in PowerShell:

```powershell
npm install
npm run dev
```

When available:

```powershell
npm run lint
npm run build
```

---

## Slice 0: Repository and Project Setup

### Expected

- Next.js app exists.
- TypeScript is enabled.
- Tailwind CSS is enabled.
- ESLint is enabled.
- Documentation files exist.
- `.env.example` exists.
- No real secrets are committed.

### Manual Tests

- [ ] Open project in VS Code.
- [ ] Run `npm install`.
- [ ] Run `npm run dev`.
- [ ] Open local app in browser.
- [ ] Confirm homepage loads.
- [ ] Confirm no console errors that block rendering.
- [ ] Confirm `PROJECT_BRIEF.md` exists.
- [ ] Confirm `ROADMAP.md` exists.
- [ ] Confirm `AGENTS.md` exists.
- [ ] Confirm `MANUAL_TEST_CHECKLIST.md` exists.
- [ ] Confirm `ARCHITECTURE.md` exists.
- [ ] Confirm `DATA_MODEL.md` exists.
- [ ] Confirm `.env.example` exists.
- [ ] Confirm `.env.local` is ignored by Git.
- [ ] Run `npm run lint` if configured.
- [ ] Run `npm run build` if configured.

### Known Issues

- None yet.

---

## Slice 1: App Shell v1

### Expected

- Sidebar navigation exists.
- Header exists.
- Search placeholder is visible.
- Dashboard cards render.
- Placeholder pages exist for each top-level section.
- Mobile navigation is usable.
- Light/dark foundations remain readable.
- Layout is usable on desktop and mobile.

### Manual Tests

- [ ] App loads locally.
- [ ] Confirm the sidebar links work on desktop.
- [ ] Confirm mobile navigation opens and links work on small screens.
- [ ] Confirm Dashboard cards render.
- [ ] Visit `/dashboard`.
- [ ] Visit `/compendium`.
- [ ] Visit `/systems`.
- [ ] Visit `/settings-library`.
- [ ] Visit `/projects`.
- [ ] Visit `/campaigns`.
- [ ] Visit `/characters`.
- [ ] Visit `/files`.
- [ ] Visit `/account`.
- [ ] Confirm `Search TableHub...` is visible.
- [ ] Confirm `Ctrl+K` is visible as a planned shortcut.
- [ ] Resize browser to mobile width.
- [ ] Confirm navigation remains usable.
- [ ] Confirm light/dark foundation does not break readability.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.

### Known Issues

- None yet.

---

## Slice 2: Authentication and Profiles

### Expected

- Supabase Auth is connected.
- User can sign up.
- User can log in.
- User can log out.
- Protected routes require login.
- User profile includes username and display name.
- Player-facing UI does not expose email addresses.

### Manual Tests

- [ ] `/login` renders.
- [ ] `/signup` renders.
- [ ] User can sign up with email/password.
- [ ] If email confirmation is required, the signup page shows a clear confirmation message.
- [ ] User can log in with email/password.
- [ ] Unauthenticated user is redirected from `/dashboard` to `/login`.
- [ ] Authenticated user without a profile is redirected to `/onboarding`.
- [ ] Onboarding validates username length and allowed characters.
- [ ] Onboarding validates display name length.
- [ ] Duplicate username errors are readable.
- [ ] Onboarding creates the profile.
- [ ] Authenticated user with a profile can visit `/dashboard`.
- [ ] Account page displays username and display name.
- [ ] Account page can update username/display name.
- [ ] App shell shows display name and username, not email.
- [ ] Logout works.
- [ ] Run `npm run test`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.

### Known Issues

- The Supabase `profiles` table and RLS policies must exist in the project database before manual auth testing.

---

## Slice 3: Projects and Membership Foundations

### Expected

- User can create a Project.
- Creator becomes Owner.
- Project appears on `/projects`.
- Project detail page acts as the future project command center.
- Project routes enforce access.

### Manual Tests

- [ ] Logged-out user cannot access `/projects`.
- [ ] Logged-in user with profile can access `/projects`.
- [ ] Empty projects state appears.
- [ ] User can open `/projects/new`.
- [ ] Project name is required.
- [ ] Project name max length is enforced.
- [ ] Description max length is enforced.
- [ ] User can create a project.
- [ ] User is redirected to project detail page after creation.
- [ ] Created project appears on `/projects`.
- [ ] Project detail page loads.
- [ ] Project dashboard placeholder cards render.
- [ ] Another user cannot access the project unless they are a member.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.

### Known Issues

- The Supabase `projects`, `project_members`, and `create_project` SQL must exist in the project database before manual Project testing.

---

## Slice 4A: Game Systems Foundation

### Expected

- User can create Game Systems.
- User can list accessible Game Systems.
- User can view a Game System detail dashboard.
- Game Systems include source/provenance metadata.
- D&D 5e 2014 starter metadata can be prefilled.
- No compendium book content is seeded or imported.

### Manual Tests

- [ ] Logged-out user cannot access `/systems`.
- [ ] Logged-in user with profile can access `/systems`.
- [ ] Empty systems state appears.
- [ ] User can open `/systems/new`.
- [ ] System name is required.
- [ ] Long system name is rejected.
- [ ] User can create a custom system.
- [ ] User can prefill the D&D 5e 2014 starter system.
- [ ] User is redirected to system detail page after creation.
- [ ] Created system appears on `/systems`.
- [ ] System detail page loads.
- [ ] Source/provenance metadata displays.
- [ ] Placeholder system dashboard cards render.
- [ ] Another user cannot edit the system.
- [ ] Private systems are not visible to unrelated users.
- [ ] Public systems are visible to authenticated users.
- [ ] Run `npm run test`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.

### Known Issues

- The Supabase `game_systems` table and RLS policies must exist in the project
  database before manual Game Systems testing.

---

## Slice 4B: Master Compendiums

### Expected

- User can create compendiums linked to Game Systems.
- Compendiums remain reusable master-library records.
- Compendiums include source/provenance metadata.
- No entries, imported rules text, SRD rows, book text, third-party data, or
  5etools data are added in this slice.

### Manual Tests

- [ ] Logged-out user cannot access `/compendium`.
- [ ] Logged-in user with profile can access `/compendium`.
- [ ] Empty state appears.
- [ ] User can open `/compendium/new`.
- [ ] User must select a game system.
- [ ] User can create a compendium linked to a game system.
- [ ] Starter D&D 5e 2014 compendium prefill works.
- [ ] Created compendium appears on `/compendium`.
- [ ] Compendium detail page loads.
- [ ] Linked game system metadata appears.
- [ ] Source/provenance metadata appears.
- [ ] Another user cannot edit/delete private compendiums.
- [ ] Private compendiums are not visible to unrelated users.
- [ ] Public compendiums are visible to authenticated users.
- [ ] No compendium entries or imported rules text exist yet.
- [ ] Run `npm run test`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.

### Known Issues

- The Supabase `compendiums` table and RLS policies must exist in the project
  database before manual Master Compendium testing.

---

## Slice 4C: Master Settings Libraries

### Expected

- User can create Settings Libraries.
- Settings Libraries remain reusable master-library records.
- Settings Libraries include source/provenance metadata.
- No setting entries, imported notes, PDFs, Markdown, CSVs, maps, or lore content
  are added in this slice.
- Future Project customization must use linked copies with overrides.

### Manual Tests

- [ ] Logged-out user cannot access `/settings-library`.
- [ ] Logged-in user with profile can access `/settings-library`.
- [ ] Empty state appears.
- [ ] User can open `/settings-library/new`.
- [ ] Name is required.
- [ ] Long name is rejected.
- [ ] Description max length is enforced.
- [ ] Genre max length is enforced.
- [ ] Tone max length is enforced.
- [ ] Source URL validation works.
- [ ] User can create a Settings Library.
- [ ] Starter fantasy Settings Library prefill works.
- [ ] User is redirected to the detail page after creation.
- [ ] Created Settings Library appears on `/settings-library`.
- [ ] Settings Library detail page loads.
- [ ] Source/provenance metadata appears.
- [ ] Placeholder cards for future entries/project links/imports render.
- [ ] Another user cannot edit/delete private Settings Libraries.
- [ ] Private Settings Libraries are not visible to unrelated users.
- [ ] Public Settings Libraries are visible to authenticated users.
- [ ] No setting entries or imported lore content exist yet.
- [ ] Run `npm run test`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.

### Known Issues

- The Supabase `settings_libraries` table and RLS policies must exist in the
  project database before manual Master Settings Library testing.

---

## Slice 4D: Master Entry Types

### Expected

- User can create reusable Entry Type definitions.
- Entry Types support future Compendium entries and Settings Library entries.
- Entry Types are definitions only.
- No actual compendium entries, setting entries, rich text, body content, tags,
  folders, imports, field schemas, project links, overrides, copyrighted rules
  text, or lore content are added in this slice.
- Future Project customization must use linked copies with overrides.

### Manual Tests

- [ ] Logged-out user cannot access `/entry-types`.
- [ ] Logged-in user with profile can access `/entry-types`.
- [ ] Empty state appears.
- [ ] User can open `/entry-types/new`.
- [ ] Name is required.
- [ ] Long name is rejected.
- [ ] Description max length is enforced.
- [ ] Invalid library kind is rejected.
- [ ] Invalid visibility is rejected.
- [ ] Invalid sort order is rejected.
- [ ] Starter preset fills the form.
- [ ] User can create a Compendium Entry Type.
- [ ] User can create a Settings Library Entry Type.
- [ ] User is redirected to detail page after creation.
- [ ] Created Entry Type appears on `/entry-types`.
- [ ] Entry Type detail page loads.
- [ ] Placeholder cards for future entries/fields/overrides render.
- [ ] Private Entry Types are not visible to unrelated users.
- [ ] Public Entry Types are visible to authenticated users.
- [ ] No actual compendium entries or setting entries exist yet.
- [ ] Run `npm run test`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.

### Known Issues

- The Supabase `entry_types` table and RLS policies must exist in the project
  database before manual Master Entry Types testing.

---

## Slice 4E: Basic Master Entries Foundation

### Expected

- User can create basic original Master Entries.
- Master Entries use one shared table for Compendium entries and Settings
  Library entries.
- Each Master Entry belongs to exactly one parent Compendium or Settings
  Library and points to one Entry Type.
- Body content is plain text or Markdown textarea content only.
- Properties are stored as JSON object data.
- No rich text editing, Markdown paste conversion, wiki links, tags, folders,
  imports, Project links, Project overrides, public marketplace behavior, SRD
  content, copyrighted book text, or 5etools imports are added in this slice.
- Future Project customization must use linked copies with overrides.

### Manual Tests

- [ ] Logged-out user cannot access `/master-entries`.
- [ ] Logged-in user with profile can access `/master-entries`.
- [ ] Empty state appears.
- [ ] User can open `/master-entries/new`.
- [ ] Helpful message appears if no Compendiums, Settings Libraries, or Entry
      Types exist.
- [ ] Title is required.
- [ ] Long title is rejected.
- [ ] Invalid library kind is rejected.
- [ ] Parent library is required.
- [ ] Parent mismatch is rejected.
- [ ] Entry Type is required.
- [ ] Too many aliases are rejected.
- [ ] Invalid body format is rejected.
- [ ] Invalid properties JSON is rejected.
- [ ] Properties JSON array is rejected.
- [ ] Invalid visibility is rejected.
- [ ] Invalid sort order is rejected.
- [ ] Invalid source URL is rejected.
- [ ] Starter preset fills the form.
- [ ] User can create a Compendium Master Entry.
- [ ] User can create a Settings Library Master Entry.
- [ ] User is redirected to detail page after creation.
- [ ] Created entry appears on `/master-entries`.
- [ ] Created entry appears or is linked from its parent Compendium or Settings
      Library detail page.
- [ ] Master Entry detail page loads.
- [ ] Body, aliases, properties, source/provenance, and placeholder cards
      render.
- [ ] Private Master Entries are not visible to unrelated users.
- [ ] Public Master Entries under public parent libraries are visible to
      authenticated users.
- [ ] Public Master Entries under private parent libraries are not visible to
      unrelated users.
- [ ] No imports, tags/folders, Project links, or overrides exist yet.
- [ ] Run `npm.cmd run test`.
- [ ] Run `npm.cmd run lint`.
- [ ] Run `npm.cmd run build`.

### Known Issues

- The Supabase `master_entries` table and RLS policies must exist in the project
  database before manual Basic Master Entries testing.

---

## Slice 4F: Master Library Navigation Polish

### Expected

- `/master-library` is a protected overview for reusable original content.
- Overview cards connect Systems, Compendiums, Settings Libraries, Entry Types,
  and Master Entries.
- Existing master-library list and detail pages have compact cross-links.
- Empty states explain the next useful step.
- This slice adds navigation polish only.
- No SQL, new tables, imports, tags/folders, rich text editor, Project sources,
  or overrides are added.

### Manual Tests

- [ ] Logged-out user cannot access `/master-library`.
- [ ] Logged-in user with profile can access `/master-library`.
- [ ] Master Library overview page loads.
- [ ] Overview cards render for Systems, Compendiums, Settings Libraries, Entry
      Types, and Master Entries.
- [ ] Counts or list summaries render without crashing.
- [ ] Each overview card links to the correct list page.
- [ ] Create links go to the correct new pages.
- [ ] `/systems` links back to Master Library overview.
- [ ] `/compendium` links back to Master Library overview.
- [ ] `/settings-library` links back to Master Library overview.
- [ ] `/entry-types` links back to Master Library overview.
- [ ] `/master-entries` links back to Master Library overview.
- [ ] Detail pages show breadcrumb/back links where implemented.
- [ ] Parent library links from Master Entry detail work where metadata exists.
- [ ] Entry Type links from Master Entry detail work where metadata exists.
- [ ] Empty states explain the next step.
- [ ] Mobile layout remains usable.
- [ ] No new SQL was added.
- [ ] No imports, tags/folders, rich text, Project sources, or overrides were
      added.
- [ ] Run `npm.cmd run test`.
- [ ] Run `npm.cmd run lint`.
- [ ] Run `npm.cmd run build`.

### Known Issues

- Logged-in manual testing still depends on the existing Supabase database and
  RLS setup from Slices 2 through 4E.

---

## Slice 5: Project Imports and Linked Overrides

### Expected

- A Project can link to master content.
- Project overrides do not mutate master content.
- UI marks overrides clearly.

### Manual Tests

- [ ] Attach starter compendium to Project.
- [ ] Open linked master entry from Project.
- [ ] Override a field in Project context.
- [ ] Confirm Project shows overridden value.
- [ ] Confirm master entry remains unchanged.
- [ ] Confirm UI indicates field is overridden.

### Known Issues

- Not started.

---

## Slice 6: Rich Text Wiki and Entry Editing

### Expected

- Rich-text editor exists.
- Markdown paste conversion works.
- `[[wiki links]]` work.
- Overview and GM Notes tabs exist.
- Custom tabs can be added.
- Custom fields/properties exist.

### Manual Tests

- [ ] Create lore entry.
- [ ] Paste Markdown.
- [ ] Save rich-text content.
- [ ] Add `[[linked entry]]`.
- [ ] Create a broken link placeholder.
- [ ] Add GM Notes.
- [ ] Log in as Player and confirm GM Notes are hidden.
- [ ] Add custom tab.
- [ ] Add custom field.

### Known Issues

- Not started.

---

## Slice 7: Search

### Expected

- Global search exists.
- Project-scoped search exists.
- Filters exist.
- Fuzzy/alias matching works.
- Results obey permissions.
- `Ctrl+K` opens command palette.

### Manual Tests

- [ ] Search globally.
- [ ] Search within Project.
- [ ] Search by tag.
- [ ] Search by alias.
- [ ] Misspell a term and confirm fuzzy result.
- [ ] Log in as Player and confirm GM-only results do not appear.
- [ ] Press `Ctrl+K`.

### Known Issues

- Not started.

---

## Slice 8: Characters v1

### Expected

- Player can create character.
- GM can create character for player.
- Character has profile and custom fields.
- Character can be assigned to campaign.
- One active campaign per character.
- Manual overrides are marked.

### Manual Tests

- [ ] Create character as Player.
- [ ] Create character as GM for Player.
- [ ] Assign character to campaign.
- [ ] Add custom field.
- [ ] Add tab.
- [ ] Add manual override.
- [ ] Confirm override warning appears.

### Known Issues

- Not started.

---

## Slice 9: Dice Roller

### Expected

Dice roller supports common notation and visibility.

### Manual Tests

- [ ] Roll `d20`.
- [ ] Roll `2d6`.
- [ ] Roll `1d20+5`.
- [ ] Roll with advantage.
- [ ] Roll with disadvantage.
- [ ] Roll keep highest.
- [ ] Roll keep lowest.
- [ ] Roll exploding dice.
- [ ] Roll success counting.
- [ ] Make public roll.
- [ ] Make private roll.
- [ ] Make GM-only roll.
- [ ] Confirm roll history respects visibility.

### Known Issues

- Not started.

---

## Slice 10: Journals, Notes, Files, and Handouts

### Expected

- Private journals exist.
- Party journals exist.
- GM can see private journals per project rules.
- Player notes can be promoted into official entries.
- Files can be uploaded and attached.
- Handouts support visibility.

### Manual Tests

- [ ] Create private journal entry.
- [ ] Create party journal entry.
- [ ] Link journal entry to lore page.
- [ ] GM promotes note to official wiki entry.
- [ ] Upload portrait/icon.
- [ ] Upload handout.
- [ ] Attach file to entry.
- [ ] Reveal handout to players.
- [ ] Confirm hidden files are not visible to players.

### Known Issues

- Not started.
