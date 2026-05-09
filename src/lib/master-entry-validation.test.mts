import assert from "node:assert/strict";
import test from "node:test";

import {
  createMasterEntrySlugFromTitle,
  validateMasterEntryBodyInput,
  validateMasterEntryInput,
} from "./master-entry-validation.ts";

const validCompendiumInput = {
  libraryKind: "compendium",
  compendiumId: "11111111-1111-4111-8111-111111111111",
  settingsLibraryId: "",
  entryTypeId: "22222222-2222-4222-8222-222222222222",
  title: "Sample Rule Note",
  aliases: "Rule Note, Test Rule",
  summary: "A simple master compendium entry.",
  body: "Placeholder text only.",
  bodyFormat: "markdown",
  properties: "{\"difficulty\":\"basic\"}",
  visibility: "private",
  sortOrder: "10",
  licenseName: "",
  licenseUrl: "",
  sourceType: "manual",
  sourceUrl: "",
  sourceNotes: "No copyrighted text.",
  version: "0.1",
};

test("accepts a valid Compendium master entry", () => {
  const result = validateMasterEntryInput(validCompendiumInput);

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.deepEqual(result.values, {
      library_kind: "compendium",
      compendium_id: "11111111-1111-4111-8111-111111111111",
      settings_library_id: null,
      entry_type_id: "22222222-2222-4222-8222-222222222222",
      title: "Sample Rule Note",
      slug: "sample-rule-note",
      aliases: ["Rule Note", "Test Rule"],
      summary: "A simple master compendium entry.",
      body: "Placeholder text only.",
      body_format: "markdown",
      properties: { difficulty: "basic" },
      visibility: "private",
      sort_order: 10,
      license_name: "",
      license_url: "",
      source_type: "manual",
      source_url: "",
      source_notes: "No copyrighted text.",
      version: "0.1",
    });
  }
});

test("accepts a valid Settings Library master entry", () => {
  const result = validateMasterEntryInput({
    ...validCompendiumInput,
    libraryKind: "settings_library",
    compendiumId: "",
    settingsLibraryId: "33333333-3333-4333-8333-333333333333",
    title: "Sample NPC Note",
  });

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.values.library_kind, "settings_library");
    assert.equal(result.values.compendium_id, null);
    assert.equal(
      result.values.settings_library_id,
      "33333333-3333-4333-8333-333333333333",
    );
    assert.equal(result.values.slug, "sample-npc-note");
  }
});

test("accepts rich text HTML as a Master Entry body format", () => {
  const result = validateMasterEntryInput({
    ...validCompendiumInput,
    body: "<h2>Scene</h2><p><strong>Read-aloud text.</strong></p>",
    bodyFormat: "html",
  });

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.values.body_format, "html");
  }
});

test("validates a rich text Master Entry body update", () => {
  const result = validateMasterEntryBodyInput({
    masterEntryId: "entry-1",
    body: '<p><strong>Updated body</strong><script>alert("no")</script></p>',
    bodyFormat: "html",
  });

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.values.body_format, "html");
    assert.equal(result.values.body.includes("<script"), false);
    assert.equal(result.values.body.includes("<strong>Updated body</strong>"), true);
  }
});

test("rejects a missing title", () => {
  const result = validateMasterEntryInput({
    ...validCompendiumInput,
    title: "",
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.fieldErrors.title, "Master Entry title is required.");
  }
});

test("rejects an overly long title", () => {
  const result = validateMasterEntryInput({
    ...validCompendiumInput,
    title: "A".repeat(161),
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(
      result.fieldErrors.title,
      "Title must be 160 characters or fewer.",
    );
  }
});

test("rejects an invalid library kind", () => {
  const result = validateMasterEntryInput({
    ...validCompendiumInput,
    libraryKind: "world",
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(
      result.fieldErrors.libraryKind,
      "Choose a rules/reference source or a setting/lore source.",
    );
  }
});

test("rejects a missing parent library id", () => {
  const result = validateMasterEntryInput({
    ...validCompendiumInput,
    compendiumId: "",
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(
      result.fieldErrors.compendiumId,
      "Choose a parent rules/reference source.",
    );
  }
});

test("rejects a parent library mismatch", () => {
  const result = validateMasterEntryInput({
    ...validCompendiumInput,
    settingsLibraryId: "33333333-3333-4333-8333-333333333333",
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(
      result.fieldErrors.settingsLibraryId,
      "Setting/lore source must be empty for rules/reference entries.",
    );
  }
});

test("rejects a missing Entry Type id", () => {
  const result = validateMasterEntryInput({
    ...validCompendiumInput,
    entryTypeId: "",
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.fieldErrors.entryTypeId, "Choose an Entry Type.");
  }
});

test("rejects too many aliases", () => {
  const result = validateMasterEntryInput({
    ...validCompendiumInput,
    aliases: Array.from({ length: 21 }, (_, index) => `Alias ${index}`).join(", "),
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.fieldErrors.aliases, "Use 20 aliases or fewer.");
  }
});

test("rejects an invalid body format", () => {
  const result = validateMasterEntryInput({
    ...validCompendiumInput,
    bodyFormat: "rich_html",
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(
      result.fieldErrors.bodyFormat,
      "Choose plain text, Markdown, or rich text HTML.",
    );
  }
});

test("rejects invalid properties JSON", () => {
  const result = validateMasterEntryInput({
    ...validCompendiumInput,
    properties: "{\"broken\"",
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.fieldErrors.properties, "Properties must be valid JSON object text.");
  }
});

test("rejects a properties JSON array", () => {
  const result = validateMasterEntryInput({
    ...validCompendiumInput,
    properties: "[\"not\", \"object\"]",
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.fieldErrors.properties, "Properties must be a JSON object.");
  }
});

test("rejects an invalid visibility", () => {
  const result = validateMasterEntryInput({
    ...validCompendiumInput,
    visibility: "gm_only",
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.fieldErrors.visibility, "Choose private, shared, or public.");
  }
});

test("rejects invalid sort orders", () => {
  for (const sortOrder of ["1.5", "-1", "10001", "abc"]) {
    const result = validateMasterEntryInput({
      ...validCompendiumInput,
      sortOrder,
    });

    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(
        result.fieldErrors.sortOrder,
        "Sort order must be a whole number from 0 to 10000.",
      );
    }
  }
});

test("generates lowercase hyphen slugs from titles", () => {
  assert.equal(createMasterEntrySlugFromTitle("  Sample / Rule Note!  "), "sample-rule-note");
  assert.equal(createMasterEntrySlugFromTitle("NPC & Ally"), "npc-ally");
});

test("rejects invalid source URLs", () => {
  const result = validateMasterEntryInput({
    ...validCompendiumInput,
    sourceUrl: "not a url",
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.fieldErrors.sourceUrl, "Source URL must be a valid URL.");
  }
});
