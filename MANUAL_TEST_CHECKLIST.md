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

## Slice 4: Systems, Compendiums, and Settings Library

### Expected

- User can create systems.
- User can create compendiums.
- User can create Settings Libraries.
- User can create basic entries.
- Entries support tags/folders at a basic level.

### Manual Tests

- [ ] Create D&D 5e 2014 system.
- [ ] Create starter compendium.
- [ ] Create starter Settings Library.
- [ ] Create basic compendium entry.
- [ ] Create basic Settings Library entry.
- [ ] Add tags.
- [ ] Add folders/categories.
- [ ] Confirm entries appear in lists.

### Known Issues

- Not started.

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
