import assert from "node:assert/strict";
import test from "node:test";

import { dashboardCards, getActiveNavItem, navItems } from "./tablehub-data.ts";

test("keeps Library as the reusable-content sidebar hub", () => {
  assert.deepEqual(
    navItems.map((item) => [item.title, item.href]),
    [
      ["Dashboard", "/dashboard"],
      ["Library", "/master-library"],
      ["Systems", "/systems"],
      ["Projects", "/projects"],
      ["Campaigns", "/campaigns"],
      ["Characters", "/characters"],
      ["Files", "/files"],
      ["Account", "/account"],
    ],
  );

  assert.equal(
    navItems.some((item) => item.title === "Compendium"),
    false,
  );
  assert.equal(
    navItems.some((item) => item.title === "Settings Library"),
    false,
  );
});

test("keeps Dashboard cards aligned to Library taxonomy", () => {
  const cardTitles = dashboardCards.map((card) => card.title);

  assert.equal(cardTitles.includes("Library"), true);
  assert.equal(cardTitles.includes("Compendium"), false);
  assert.equal(cardTitles.includes("Settings Library"), false);
});

test("groups concrete Library workflows under the Library sidebar item", () => {
  assert.equal(getActiveNavItem("/master-library")?.title, "Library");
  assert.equal(getActiveNavItem("/compendium")?.title, "Library");
  assert.equal(getActiveNavItem("/settings-library/new")?.title, "Library");
  assert.equal(getActiveNavItem("/entry-types")?.title, "Library");
  assert.equal(getActiveNavItem("/master-entries/abc")?.title, "Library");
  assert.equal(getActiveNavItem("/systems")?.title, "Systems");
});
