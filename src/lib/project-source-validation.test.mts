import assert from "node:assert/strict";
import test from "node:test";

import {
  PROJECT_SOURCE_TYPES,
  formatProjectSourceType,
  validateAttachProjectSourceInput,
  validateRemoveProjectSourceInput,
} from "./project-source-validation.ts";

test("keeps Project Source types limited to the Slice 5A sources", () => {
  assert.deepEqual(PROJECT_SOURCE_TYPES, [
    "game_system",
    "compendium",
    "settings_library",
  ]);
});

test("accepts valid Project Source attach details", () => {
  const result = validateAttachProjectSourceInput({
    projectId: "11111111-1111-4111-8111-111111111111",
    sourceType: "settings_library",
    sourceId: "22222222-2222-4222-8222-222222222222",
  });

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.deepEqual(result.values, {
      project_id: "11111111-1111-4111-8111-111111111111",
      source_type: "settings_library",
      source_id: "22222222-2222-4222-8222-222222222222",
    });
  }
});

test("rejects missing Project Source attach details", () => {
  const result = validateAttachProjectSourceInput({
    projectId: "",
    sourceType: "",
    sourceId: "",
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.fieldErrors.projectId, "Project is required.");
    assert.equal(result.fieldErrors.sourceType, "Choose a supported source type.");
    assert.equal(result.fieldErrors.sourceId, "Choose a source to attach.");
  }
});

test("rejects unsupported Project Source types", () => {
  const result = validateAttachProjectSourceInput({
    projectId: "11111111-1111-4111-8111-111111111111",
    sourceType: "campaign_template",
    sourceId: "22222222-2222-4222-8222-222222222222",
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.fieldErrors.sourceType, "Choose a supported source type.");
  }
});

test("accepts valid Project Source remove details", () => {
  const result = validateRemoveProjectSourceInput({
    projectId: "11111111-1111-4111-8111-111111111111",
    projectSourceId: "33333333-3333-4333-8333-333333333333",
  });

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.deepEqual(result.values, {
      project_id: "11111111-1111-4111-8111-111111111111",
      project_source_id: "33333333-3333-4333-8333-333333333333",
    });
  }
});

test("formats Project Source type labels", () => {
  assert.equal(formatProjectSourceType("game_system"), "Game System");
  assert.equal(formatProjectSourceType("compendium"), "Compendium");
  assert.equal(formatProjectSourceType("settings_library"), "Settings Library");
});
