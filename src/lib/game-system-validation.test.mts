import assert from "node:assert/strict";
import test from "node:test";

import {
  DND_5E_2014_STARTER_SYSTEM,
  createSlugFromName,
  validateGameSystemInput,
} from "./game-system-validation.ts";

test("creates lowercase kebab-case slugs from system names", () => {
  assert.equal(createSlugFromName("D&D 5e 2014"), "dnd-5e-2014");
  assert.equal(createSlugFromName("  Custom / System Agnostic!  "), "custom-system-agnostic");
});

test("accepts valid game system details", () => {
  const result = validateGameSystemInput({
    name: "D&D 5e 2014",
    edition: "5th Edition",
    publisher: "Wizards of the Coast",
    description: "The 2014 fantasy ruleset foundation.",
    rulesetYear: "2014",
    visibility: "private",
    licenseName: "Manual metadata",
    licenseUrl: "https://example.com/license",
    sourceType: "manual",
    sourceUrl: "https://example.com/source",
    sourceNotes: "No book text imported.",
    version: "2014.1",
  });

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.deepEqual(result.values, {
      name: "D&D 5e 2014",
      slug: "dnd-5e-2014",
      edition: "5th Edition",
      publisher: "Wizards of the Coast",
      description: "The 2014 fantasy ruleset foundation.",
      ruleset_year: 2014,
      visibility: "private",
      license_name: "Manual metadata",
      license_url: "https://example.com/license",
      source_type: "manual",
      source_url: "https://example.com/source",
      source_notes: "No book text imported.",
      version: "2014.1",
    });
  }
});

test("rejects missing and overly long required values", () => {
  const result = validateGameSystemInput({
    name: "",
    edition: "",
    publisher: "",
    description: "",
    rulesetYear: "",
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
    assert.equal(result.fieldErrors.name, "System name is required.");
    assert.equal(result.fieldErrors.version, "Version is required.");
  }
});

test("rejects invalid years, URLs, visibility, and source type", () => {
  const result = validateGameSystemInput({
    name: "Daggerheart",
    edition: "",
    publisher: "",
    description: "",
    rulesetYear: "1800",
    visibility: "campaign",
    licenseName: "",
    licenseUrl: "not a url",
    sourceType: "scraped_site",
    sourceUrl: "also bad",
    sourceNotes: "",
    version: "1.0.0",
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(
      result.fieldErrors.rulesetYear,
      "Ruleset year must be blank or between 1900 and 2200.",
    );
    assert.equal(result.fieldErrors.visibility, "Choose private, shared, or public.");
    assert.equal(result.fieldErrors.licenseUrl, "Enter a valid URL, or leave it blank.");
    assert.equal(result.fieldErrors.sourceType, "Choose a supported source type.");
    assert.equal(result.fieldErrors.sourceUrl, "Enter a valid URL, or leave it blank.");
  }
});

test("provides safe D&D 5e 2014 starter metadata only", () => {
  assert.deepEqual(DND_5E_2014_STARTER_SYSTEM, {
    name: "D&D 5e 2014",
    edition: "5th Edition",
    publisher: "Wizards of the Coast",
    description:
      "The 2014 fifth edition fantasy roleplaying ruleset foundation for TableHub development.",
    rulesetYear: "2014",
    visibility: "private",
    licenseName: "",
    licenseUrl: "",
    sourceType: "manual",
    sourceUrl: "",
    sourceNotes: "System metadata only. No compendium book content imported in Slice 4A.",
    version: "2014.1",
  });
});
