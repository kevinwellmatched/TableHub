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
- [ ] Confirm `.env.example` exists.
- [ ] Confirm `.env.local` is ignored by Git.
- [ ] Run `npm run lint` if configured.
- [ ] Run `npm run build` if configured.

### Known Issues

- None yet.

---

## Slice 1: App Shell

### Expected

- Sidebar navigation exists.
- Header exists.
- Placeholder pages exist.
- Dark/light mode works.
- Search placeholder is visible.
- Layout is usable on desktop and mobile.

### Manual Tests

- [ ] Visit `/dashboard`.
- [ ] Visit `/compendium`.
- [ ] Visit `/systems`.
- [ ] Visit `/settings-library`.
- [ ] Visit `/projects`.
- [ ] Visit `/campaigns`.
- [ ] Visit `/characters`.
- [ ] Visit `/files`.
- [ ] Visit `/account`.
- [ ] Toggle dark/light mode.
- [ ] Resize browser to mobile width.
- [ ] Confirm navigation remains usable.

### Known Issues

- Not started.

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

- [ ] Sign up with test email.
- [ ] Log out.
- [ ] Log back in.
- [ ] Try protected route while logged out.
- [ ] Create/update username.
- [ ] Create/update display name.
- [ ] Confirm email does not display on campaign/player screens.

### Known Issues

- Not started.

---

## Slice 3: Projects and Membership

### Expected

- User can create a Project.
- Creator becomes Owner.
- Project appears on dashboard.
- Project routes enforce access.

### Manual Tests

- [ ] Create a Project.
- [ ] Confirm Project appears in list.
- [ ] Open Project dashboard.
- [ ] Confirm current user is Owner.
- [ ] Confirm logged-out users cannot access Project route.
- [ ] Confirm unrelated users cannot access Project route.

### Known Issues

- Not started.

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
