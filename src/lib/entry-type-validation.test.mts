import assert from "node:assert/strict";
import test from "node:test";

import {
  createEntryTypeSlugFromName,
  validateEntryTypeInput,
} from "./entry-type-validation.ts";

test("accepts a valid Compendium Entry Type", () => {
  const result = validateEntryTypeInput({
    name: "Spell",
    description: "Spell, power, or ability reference entries.",
    libraryKind: "compendium",
    visibility: "private",
    sortOrder: "20",
  });

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.deepEqual(result.values, {
      name: "Spell",
      slug: "spell",
      description: "Spell, power, or ability reference entries.",
      library_kind: "compendium",
      visibility: "private",
      sort_order: 20,
    });
  }
});

test("accepts a valid Settings Library Entry Type", () => {
  const result = validateEntryTypeInput({
    name: "Timeline Event",
    description:
      "Historical events, campaign milestones, prophecies, eras, or scheduled future events.",
    libraryKind: "settings_library",
    visibility: "private",
    sortOrder: "50",
  });

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.deepEqual(result.values, {
      name: "Timeline Event",
      slug: "timeline-event",
      description:
        "Historical events, campaign milestones, prophecies, eras, or scheduled future events.",
      library_kind: "settings_library",
      visibility: "private",
      sort_order: 50,
    });
  }
});

test("rejects a missing Entry Type name", () => {
  const result = validateEntryTypeInput({
    name: "",
    description: "",
    libraryKind: "compendium",
    visibility: "private",
    sortOrder: "0",
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.fieldErrors.name, "Entry Type name is required.");
  }
});

test("rejects an overly long Entry Type name", () => {
  const result = validateEntryTypeInput({
    name: "A".repeat(81),
    description: "",
    libraryKind: "compendium",
    visibility: "private",
    sortOrder: "0",
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.fieldErrors.name, "Entry Type name must be 80 characters or fewer.");
  }
});

test("rejects an invalid Entry Type library kind", () => {
  const result = validateEntryTypeInput({
    name: "Scene",
    description: "",
    libraryKind: "world",
    visibility: "private",
    sortOrder: "0",
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(
      result.fieldErrors.libraryKind,
      "Choose Compendium or Settings Library.",
    );
  }
});

test("rejects an invalid Entry Type visibility", () => {
  const result = validateEntryTypeInput({
    name: "Scene",
    description: "",
    libraryKind: "settings_library",
    visibility: "campaign",
    sortOrder: "0",
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.fieldErrors.visibility, "Choose private, shared, or public.");
  }
});

test("rejects invalid Entry Type sort orders", () => {
  for (const sortOrder of ["1.5", "-1", "10001", "abc"]) {
    const result = validateEntryTypeInput({
      name: "Scene",
      description: "",
      libraryKind: "settings_library",
      visibility: "private",
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

test("generates lowercase hyphen slugs from Entry Type names", () => {
  assert.equal(createEntryTypeSlugFromName("Timeline Event"), "timeline-event");
  assert.equal(createEntryTypeSlugFromName("  Custom / Field Type!  "), "custom-field-type");
});

test("enforces the Entry Type description max length", () => {
  const result = validateEntryTypeInput({
    name: "Rule",
    description: "A".repeat(1001),
    libraryKind: "compendium",
    visibility: "private",
    sortOrder: "10",
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.fieldErrors.description, "Description must be 1000 characters or fewer.");
  }
});
