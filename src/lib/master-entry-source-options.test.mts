import assert from "node:assert/strict";
import test from "node:test";

import {
  formatMasterEntryParentSourceOption,
  formatMasterEntrySourceContainerType,
} from "./master-entry-source-options.ts";
import { validateMasterEntryInput } from "./master-entry-validation.ts";

const validInput = {
  libraryKind: "compendium",
  compendiumId: "11111111-1111-4111-8111-111111111111",
  settingsLibraryId: "",
  entryTypeId: "22222222-2222-4222-8222-222222222222",
  title: "Sample Rule Note",
  aliases: "",
  summary: "",
  body: "",
  bodyFormat: "html",
  properties: "{}",
  visibility: "private",
  sortOrder: "0",
  licenseName: "",
  licenseUrl: "",
  sourceType: "manual",
  sourceUrl: "",
  sourceNotes: "",
  version: "0.1",
};

test("labels Master Entry source container types without changing stored values", () => {
  assert.equal(
    formatMasterEntrySourceContainerType("compendium"),
    "Rules / reference source",
  );
  assert.equal(
    formatMasterEntrySourceContainerType("settings_library"),
    "Setting / lore source",
  );
});

test("formats parent source options with Library Source category labels", () => {
  assert.equal(
    formatMasterEntryParentSourceOption({
      name: "D&D 5e 2014 Basic Rules",
      source_category: "core_rulebook",
    }),
    "D&D 5e 2014 Basic Rules - Core Rulebooks",
  );
  assert.equal(
    formatMasterEntryParentSourceOption({
      name: "Goblin Caves",
      source_category: "adventure_module",
    }),
    "Goblin Caves - Adventures & Modules",
  );
});

test("keeps Library Source categories out of Master Entry library_kind", () => {
  for (const libraryKind of [
    "core_rulebook",
    "expansion_supplement",
    "setting_world_lore",
    "adventure_module",
    "other",
  ]) {
    const result = validateMasterEntryInput({
      ...validInput,
      libraryKind,
    });

    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(
        result.fieldErrors.libraryKind,
        "Choose a rules/reference source or a setting/lore source.",
      );
    }
  }
});
