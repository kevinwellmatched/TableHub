import assert from "node:assert/strict";
import test from "node:test";

import {
  DND_5E_2014_STARTER_COMPENDIUM,
  createSlugFromName,
  validateCompendiumInput,
} from "./compendium-validation.ts";

test("creates lowercase kebab-case slugs from compendium names", () => {
  assert.equal(
    createSlugFromName("D&D 5e 2014 Starter Compendium"),
    "dnd-5e-2014-starter-compendium",
  );
  assert.equal(createSlugFromName("  Homebrew / Private Notes!  "), "homebrew-private-notes");
});

test("accepts valid compendium details", () => {
  const result = validateCompendiumInput({
    name: "D&D 5e 2014 Starter Compendium",
    description: "A safe metadata container with no imported rules text.",
    gameSystemId: "11111111-1111-4111-8111-111111111111",
    visibility: "private",
    licenseName: "Manual placeholder",
    licenseUrl: "https://example.com/license",
    sourceType: "manual",
    sourceUrl: "https://example.com/source",
    sourceNotes: "No rules text imported.",
    version: "0.1",
  });

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.deepEqual(result.values, {
      name: "D&D 5e 2014 Starter Compendium",
      slug: "dnd-5e-2014-starter-compendium",
      description: "A safe metadata container with no imported rules text.",
      game_system_id: "11111111-1111-4111-8111-111111111111",
      visibility: "private",
      license_name: "Manual placeholder",
      license_url: "https://example.com/license",
      source_type: "manual",
      source_url: "https://example.com/source",
      source_notes: "No rules text imported.",
      version: "0.1",
    });
  }
});

test("rejects missing required compendium values", () => {
  const result = validateCompendiumInput({
    name: "",
    description: "",
    gameSystemId: "",
    visibility: "private",
    licenseName: "",
    licenseUrl: "",
    sourceType: "manual",
    sourceUrl: "",
    sourceNotes: "",
    version: "",
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.fieldErrors.name, "Compendium name is required.");
    assert.equal(result.fieldErrors.gameSystemId, "Choose a game system.");
    assert.equal(result.fieldErrors.version, "Version is required.");
  }
});

test("rejects invalid visibility, source type, and URLs", () => {
  const result = validateCompendiumInput({
    name: "Unsafe Import",
    description: "",
    gameSystemId: "11111111-1111-4111-8111-111111111111",
    visibility: "campaign",
    licenseName: "",
    licenseUrl: "not a url",
    sourceType: "scraped_site",
    sourceUrl: "also bad",
    sourceNotes: "",
    version: "0.1",
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.fieldErrors.visibility, "Choose private, shared, or public.");
    assert.equal(result.fieldErrors.licenseUrl, "Enter a valid URL, or leave it blank.");
    assert.equal(result.fieldErrors.sourceType, "Choose a supported source type.");
    assert.equal(result.fieldErrors.sourceUrl, "Enter a valid URL, or leave it blank.");
  }
});

test("provides safe D&D 5e 2014 starter compendium metadata only", () => {
  assert.deepEqual(DND_5E_2014_STARTER_COMPENDIUM, {
    name: "D&D 5e 2014 Starter Compendium",
    description:
      "A starter master compendium container for D&D 5e 2014 reference content. No book text or SRD entries have been imported yet.",
    gameSystemId: "",
    visibility: "private",
    licenseName: "Manual placeholder",
    licenseUrl: "",
    sourceType: "manual",
    sourceUrl: "",
    sourceNotes:
      "Container only. No rules text, SRD content, book text, or third-party data imported.",
    version: "0.1",
  });
});
