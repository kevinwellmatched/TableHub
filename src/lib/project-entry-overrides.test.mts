import assert from "node:assert/strict";
import test from "node:test";

import {
  getProjectEntryOverrideStatus,
  resolveProjectEntry,
  validateProjectEntryOverrideInput,
  type ProjectEntryOverrideRow,
  type ProjectEntryOriginal,
} from "./project-entry-overrides.ts";

const originalEntry: ProjectEntryOriginal = {
  id: "entry-1",
  title: "Original title",
  summary: "Original summary",
  body: "Original body",
  properties: {
    challenge: 2,
    terrain: "forest",
  },
  visibility: "private",
};

const overrideRow: ProjectEntryOverrideRow = {
  id: "override-1",
  project_id: "project-1",
  master_entry_id: "entry-1",
  override_title: "Project title",
  override_summary: "Project summary",
  override_body: "Project body",
  override_properties: {
    terrain: "ruins",
    mood: "tense",
  },
  override_visibility: "gm_only",
  override_reason: "Adjusted for this table.",
  created_by: "user-1",
  created_at: "2026-05-07T12:00:00.000Z",
  updated_at: "2026-05-07T12:00:00.000Z",
};

test("resolves an effective Project Entry from original values and overrides", () => {
  const effectiveEntry = resolveProjectEntry(originalEntry, overrideRow);

  assert.equal(effectiveEntry.title, "Project title");
  assert.equal(effectiveEntry.summary, "Project summary");
  assert.equal(effectiveEntry.body, "Project body");
  assert.equal(effectiveEntry.visibility, "gm_only");
  assert.deepEqual(effectiveEntry.properties, {
    challenge: 2,
    terrain: "ruins",
    mood: "tense",
  });
  assert.equal(effectiveEntry.original.title, "Original title");
  assert.equal(effectiveEntry.override, overrideRow);
});

test("falls back to original fields when text overrides are empty", () => {
  const effectiveEntry = resolveProjectEntry(originalEntry, {
    ...overrideRow,
    override_title: "  ",
    override_summary: "",
    override_body: null,
    override_visibility: "inherit",
  });

  assert.equal(effectiveEntry.title, "Original title");
  assert.equal(effectiveEntry.summary, "Original summary");
  assert.equal(effectiveEntry.body, "Original body");
  assert.equal(effectiveEntry.visibility, "private");
});

test("detects which Project Entry fields are overridden", () => {
  const status = getProjectEntryOverrideStatus(originalEntry, overrideRow);

  assert.deepEqual(status, {
    title: true,
    summary: true,
    body: true,
    properties: true,
    visibility: true,
  });
});

test("does not mark inherited or empty fields as overridden", () => {
  const status = getProjectEntryOverrideStatus(originalEntry, {
    ...overrideRow,
    override_title: "",
    override_summary: null,
    override_body: null,
    override_properties: {},
    override_visibility: "inherit",
  });

  assert.deepEqual(status, {
    title: false,
    summary: false,
    body: false,
    properties: false,
    visibility: false,
  });
});

test("validates Project Entry Override input", () => {
  const result = validateProjectEntryOverrideInput({
    projectId: "project-1",
    masterEntryId: "entry-1",
    overrideTitle: " Project title ",
    overrideSummary: " Project summary ",
    overrideBody: " Project body ",
    overrideProperties: '{"terrain":"ruins"}',
    overrideVisibility: "visible",
    overrideReason: " This version matches the table. ",
  });

  assert.equal(result.ok, true);

  if (result.ok) {
    assert.deepEqual(result.values, {
      project_id: "project-1",
      master_entry_id: "entry-1",
      override_title: "Project title",
      override_summary: "Project summary",
      override_body: "Project body",
      override_properties: {
        terrain: "ruins",
      },
      override_visibility: "visible",
      override_reason: "This version matches the table.",
    });
  }
});

test("rejects invalid override visibility", () => {
  const result = validateProjectEntryOverrideInput({
    projectId: "project-1",
    masterEntryId: "entry-1",
    overrideTitle: "",
    overrideSummary: "",
    overrideBody: "",
    overrideProperties: "{}",
    overrideVisibility: "public",
    overrideReason: "",
  });

  assert.equal(result.ok, false);

  if (!result.ok) {
    assert.equal(
      result.fieldErrors.overrideVisibility,
      "Choose inherit, visible, GM only, or hidden.",
    );
  }
});

test("rejects invalid properties JSON", () => {
  const result = validateProjectEntryOverrideInput({
    projectId: "project-1",
    masterEntryId: "entry-1",
    overrideTitle: "",
    overrideSummary: "",
    overrideBody: "",
    overrideProperties: "[]",
    overrideVisibility: "inherit",
    overrideReason: "",
  });

  assert.equal(result.ok, false);

  if (!result.ok) {
    assert.equal(
      result.fieldErrors.overrideProperties,
      "Override properties must be a JSON object.",
    );
  }
});
