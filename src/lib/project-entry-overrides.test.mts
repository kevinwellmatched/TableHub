import assert from "node:assert/strict";
import test from "node:test";

import {
  canProjectRoleManageOverrides,
  canProjectRoleReadResolvedVisibility,
  getProjectEntryOverrideStatus,
  resolveProjectEntry,
  resolveProjectLibraryVisibility,
  shapeProjectLibraryEntryForReadMode,
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

test("resolves Project Library visibility from source defaults and overrides", () => {
  const cases = [
    ["visible", null, "visible"],
    ["visible", "inherit", "visible"],
    ["visible", "visible", "visible"],
    ["visible", "gm_only", "gm_only"],
    ["visible", "hidden", "hidden"],
    ["gm_only", null, "gm_only"],
    ["gm_only", "inherit", "gm_only"],
    ["gm_only", "visible", "visible"],
    ["gm_only", "gm_only", "gm_only"],
    ["gm_only", "hidden", "hidden"],
    ["mixed", null, "gm_only"],
    ["mixed", "inherit", "gm_only"],
    ["mixed", "visible", "visible"],
    ["mixed", "gm_only", "gm_only"],
    ["mixed", "hidden", "hidden"],
  ] as const;

  for (const [sourceDefaultVisibility, overrideVisibility, expected] of cases) {
    assert.equal(
      resolveProjectLibraryVisibility({
        sourceDefaultVisibility,
        overrideVisibility,
      }),
      expected,
      `${sourceDefaultVisibility} plus ${overrideVisibility ?? "null"} should resolve as ${expected}`,
    );
  }
});

test("allows owners and GMs to read and manage every Project Library visibility", () => {
  for (const role of ["owner", "gm"] as const) {
    assert.equal(canProjectRoleManageOverrides(role), true);
    assert.equal(canProjectRoleReadResolvedVisibility(role, "visible"), true);
    assert.equal(canProjectRoleReadResolvedVisibility(role, "gm_only"), true);
    assert.equal(canProjectRoleReadResolvedVisibility(role, "hidden"), true);
  }
});

test("limits players and viewers to visible Project Library entries", () => {
  for (const role of ["player", "viewer"] as const) {
    assert.equal(canProjectRoleManageOverrides(role), false);
    assert.equal(canProjectRoleReadResolvedVisibility(role, "visible"), true);
    assert.equal(canProjectRoleReadResolvedVisibility(role, "gm_only"), false);
    assert.equal(canProjectRoleReadResolvedVisibility(role, "hidden"), false);
  }
});

test("keeps mixed sources hidden unless an override explicitly makes them visible", () => {
  assert.equal(
    resolveProjectLibraryVisibility({
      sourceDefaultVisibility: "mixed",
      overrideVisibility: "inherit",
    }),
    "gm_only",
  );
  assert.equal(
    resolveProjectLibraryVisibility({
      sourceDefaultVisibility: "mixed",
      overrideVisibility: "visible",
    }),
    "visible",
  );
});

test("lets explicit override visibility beat source defaults", () => {
  assert.equal(
    resolveProjectLibraryVisibility({
      sourceDefaultVisibility: "visible",
      overrideVisibility: "hidden",
    }),
    "hidden",
  );
  assert.equal(
    resolveProjectLibraryVisibility({
      sourceDefaultVisibility: "visible",
      overrideVisibility: "gm_only",
    }),
    "gm_only",
  );
  assert.equal(
    resolveProjectLibraryVisibility({
      sourceDefaultVisibility: "gm_only",
      overrideVisibility: "visible",
    }),
    "visible",
  );
  assert.equal(
    resolveProjectLibraryVisibility({
      sourceDefaultVisibility: "mixed",
      overrideVisibility: "visible",
    }),
    "visible",
  );
});

test("shapes read mode without override reasons or original comparison fields", () => {
  const effectiveEntry = resolveProjectEntry(originalEntry, overrideRow);
  const readEntry = shapeProjectLibraryEntryForReadMode({
    masterEntryId: effectiveEntry.id,
    sourceName: "Bestiary Notes",
    sourceType: "compendium",
    effective: effectiveEntry,
  });

  assert.deepEqual(readEntry, {
    id: "entry-1",
    sourceName: "Bestiary Notes",
    sourceType: "compendium",
    title: "Project title",
    summary: "Project summary",
    body: "Project body",
    properties: {
      challenge: 2,
      terrain: "ruins",
      mood: "tense",
    },
  });
  assert.equal("override" in readEntry, false);
  assert.equal("original" in readEntry, false);
  assert.equal("overrideReason" in readEntry, false);
});
