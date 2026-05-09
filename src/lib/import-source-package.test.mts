import assert from "node:assert/strict";
import test from "node:test";

import {
  isPrivateOrRestrictedImportStatus,
  isTableHubDistributableStatus,
  normalizeExternalId,
  normalizeImportSlugPart,
  validateImportSourcePackageManifest,
  type ImportSourcePackageManifest,
} from "./import-source-package.ts";

const validManifest: ImportSourcePackageManifest = {
  manifestVersion: 1,
  packageId: "demo20-core-sample",
  packageName: "Demo20 Core Sample",
  distributionStatus: "tablehub_distributable",
  extraction: {
    originalFileName: "demo20-core-sample.pdf",
    originalFileType: "pdf",
    originalFileSha256:
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    extractionToolName: "Example Offline Extractor",
    extractionToolVersion: "0.0.0",
    extractionMethod: "ai_assisted_cleanup",
    extractedAt: "2026-01-01T00:00:00.000Z",
    pageCount: 12,
    chunkCount: 3,
    extractionNotes: "Example metadata only. No real PDF content is included.",
    requiresHumanReview: true,
  },
  source: {
    name: "Demo20 Core Sample",
    creator: "TableHub Demo Team",
    licenseName: "Original demo content",
    sourceKind: "original_demo",
    mayTableHubRedistribute: true,
    privateToWorkspace: false,
  },
  system: {
    name: "Demo20",
    edition: "Sample Edition",
    publisher: "TableHub Demo Team",
    rulesetYear: 2026,
    version: "1.0.0",
  },
  sourceContainer: {
    name: "Demo20 Core Sample",
    sourceCategory: "core_rulebook",
    sourceSubtype: "core_rulebook",
    defaultPlayerVisibility: "visible",
    clonePolicy: "locked_to_system",
    version: "1.0.0",
  },
  entryTypes: [
    {
      name: "Creature",
      libraryKind: "compendium",
      description: "Original sample creature entries.",
    },
    {
      name: "Spell",
      libraryKind: "compendium",
    },
  ],
  entries: [
    {
      externalId: "demo20.copper-goblin",
      file: "entries/copper-goblin.md",
      title: "Copper Goblin",
      entryType: "Creature",
      aliases: ["Coin Goblin"],
      summary: "A tiny original sample creature.",
      sourcePage: "4",
      sourcePageStart: 4,
      sourcePageEnd: 5,
      sourceSection: "Creatures",
      extractionConfidence: "medium",
      requiresHumanReview: true,
      licenseName: "Original demo content",
    },
    {
      externalId: "demo20.moonfire-bolt",
      file: "entries/moonfire-bolt.md",
      title: "Moonfire Bolt",
      entryType: "Spell",
      sourcePageStart: 8,
      sourcePageEnd: 8,
      extractionConfidence: "high",
    },
  ],
};

function cloneManifest(
  changes: Partial<ImportSourcePackageManifest> = {},
): ImportSourcePackageManifest {
  return {
    ...structuredClone(validManifest),
    ...changes,
  };
}

function codesFor(manifest: unknown) {
  return validateImportSourcePackageManifest(manifest).issues.map(
    (issue) => issue.code,
  );
}

test("accepts a valid original demo package manifest", () => {
  const result = validateImportSourcePackageManifest(validManifest);

  assert.equal(result.ok, true);
  assert.deepEqual(result.issues, []);
});

test("accepts valid private, local fixture, and restricted manifests", () => {
  const privateStatuses = [
    {
      distributionStatus: "private_user_upload",
      sourceKind: "private_owned_document",
      licenseName: "Personal private notes",
    },
    {
      distributionStatus: "local_dev_fixture",
      sourceKind: "local_fixture",
      licenseName: "Local testing only",
    },
    {
      distributionStatus: "restricted_reference_only",
      sourceKind: "restricted_reference",
      licenseName: "Restricted private reference",
    },
  ] as const;

  for (const status of privateStatuses) {
    const manifest = cloneManifest({
      distributionStatus: status.distributionStatus,
      source: {
        ...validManifest.source,
        sourceKind: status.sourceKind,
        licenseName: status.licenseName,
        mayTableHubRedistribute: false,
        privateToWorkspace: true,
      },
    });

    assert.equal(validateImportSourcePackageManifest(manifest).ok, true);
  }
});

test("normalizes import identifiers into safe lowercase parts", () => {
  assert.equal(normalizeImportSlugPart("  Moonfire Bolt!  "), "moonfire-bolt");
  assert.equal(normalizeImportSlugPart("NPC & Ally"), "npc-ally");
  assert.equal(normalizeExternalId(" Demo20 / Copper Goblin "), "demo20-copper-goblin");
});

test("classifies distributable and private import statuses", () => {
  assert.equal(isTableHubDistributableStatus("tablehub_distributable"), true);
  assert.equal(isTableHubDistributableStatus("private_user_upload"), false);
  assert.equal(isPrivateOrRestrictedImportStatus("private_user_upload"), true);
  assert.equal(isPrivateOrRestrictedImportStatus("local_dev_fixture"), true);
  assert.equal(isPrivateOrRestrictedImportStatus("restricted_reference_only"), true);
  assert.equal(isPrivateOrRestrictedImportStatus("tablehub_distributable"), false);
});

test("rejects missing required package and provenance fields", () => {
  assert.equal(codesFor(cloneManifest({ packageId: "" })).includes("package_id_required"), true);
  assert.equal(
    codesFor(cloneManifest({ source: { ...validManifest.source, name: "" } })).includes(
      "source_name_required",
    ),
    true,
  );
  assert.equal(
    codesFor(
      cloneManifest({ source: { ...validManifest.source, licenseName: "" } }),
    ).includes("source_license_name_required"),
    true,
  );
  assert.equal(
    codesFor(cloneManifest({ system: { ...validManifest.system, name: "" } })).includes(
      "system_name_required",
    ),
    true,
  );
  assert.equal(
    codesFor(
      cloneManifest({
        sourceContainer: { ...validManifest.sourceContainer, name: "" },
      }),
    ).includes("source_container_name_required"),
    true,
  );
});

test("rejects invalid entry required fields", () => {
  const manifest = cloneManifest({
    entries: [
      {
        ...validManifest.entries[0],
        externalId: "",
        file: "",
        title: "",
        entryType: "",
      },
    ],
  });

  const codes = codesFor(manifest);

  assert.equal(codes.includes("entry_external_id_required"), true);
  assert.equal(codes.includes("entry_file_required"), true);
  assert.equal(codes.includes("entry_title_required"), true);
  assert.equal(codes.includes("entry_type_required"), true);
});

test("enforces safe TableHub-distributable provenance", () => {
  assert.equal(
    codesFor(
      cloneManifest({
        source: { ...validManifest.source, mayTableHubRedistribute: false },
      }),
    ).includes("distributable_requires_redistribution_rights"),
    true,
  );
  assert.equal(
    codesFor(
      cloneManifest({
        source: { ...validManifest.source, privateToWorkspace: true },
      }),
    ).includes("distributable_cannot_be_workspace_private"),
    true,
  );
  assert.equal(
    codesFor(
      cloneManifest({
        source: { ...validManifest.source, sourceKind: "private_notes" },
      }),
    ).includes("distributable_source_kind_not_allowed"),
    true,
  );
  assert.equal(
    codesFor(
      cloneManifest({
        source: { ...validManifest.source, licenseName: "unknown" },
      }),
    ).includes("distributable_license_too_vague"),
    true,
  );
});

test("rejects private or restricted imports that claim redistribution rights", () => {
  const result = validateImportSourcePackageManifest(
    cloneManifest({
      distributionStatus: "private_user_upload",
      source: {
        ...validManifest.source,
        sourceKind: "private_owned_document",
        mayTableHubRedistribute: true,
        privateToWorkspace: true,
      },
    }),
  );

  assert.equal(result.ok, false);
  assert.equal(
    result.issues.some(
      (issue) => issue.code === "private_import_cannot_redistribute",
    ),
    true,
  );
});

test("warns when private or restricted imports are not workspace-private", () => {
  const result = validateImportSourcePackageManifest(
    cloneManifest({
      distributionStatus: "local_dev_fixture",
      source: {
        ...validManifest.source,
        sourceKind: "local_fixture",
        mayTableHubRedistribute: false,
        privateToWorkspace: false,
      },
    }),
  );

  assert.equal(result.ok, true);
  assert.equal(
    result.issues.some(
      (issue) =>
        issue.severity === "warning" &&
        issue.code === "private_import_should_be_workspace_private",
    ),
    true,
  );
});

test("validates extraction metadata", () => {
  const codes = codesFor(
    cloneManifest({
      extraction: {
        ...validManifest.extraction,
        originalFileSha256: "ABC",
        extractedAt: "not-a-date",
        pageCount: 0,
        chunkCount: -1,
      },
    }),
  );

  assert.equal(codes.includes("extraction_sha256_invalid"), true);
  assert.equal(codes.includes("extraction_date_invalid"), true);
  assert.equal(codes.includes("extraction_page_count_invalid"), true);
  assert.equal(codes.includes("extraction_chunk_count_invalid"), true);
});

test("warns when AI-assisted cleanup does not require human review", () => {
  const result = validateImportSourcePackageManifest(
    cloneManifest({
      extraction: {
        ...validManifest.extraction,
        extractionMethod: "ai_assisted_cleanup",
        requiresHumanReview: false,
      },
    }),
  );

  assert.equal(result.ok, true);
  assert.equal(
    result.issues.some(
      (issue) =>
        issue.severity === "warning" &&
        issue.code === "ai_cleanup_requires_review",
    ),
    true,
  );
});

test("validates entry page ranges and confidence values", () => {
  const codes = codesFor(
    cloneManifest({
      entries: [
        {
          ...validManifest.entries[0],
          sourcePageStart: 2,
          sourcePageEnd: 1,
          extractionConfidence: "certain" as "high",
        },
      ],
    }),
  );

  assert.equal(codes.includes("entry_source_page_range_invalid"), true);
  assert.equal(codes.includes("entry_extraction_confidence_invalid"), true);
});

test("validates entry mapping without loading body files", () => {
  const manifest = cloneManifest({
    entries: [
      validManifest.entries[0],
      {
        ...validManifest.entries[1],
        externalId: validManifest.entries[0].externalId,
        file: validManifest.entries[0].file,
        entryType: "Undeclared",
        body: "Body content does not belong in the manifest.",
      } as ImportSourcePackageManifest["entries"][number],
    ],
  });

  const codes = codesFor(manifest);

  assert.equal(codes.includes("entry_external_id_duplicate"), true);
  assert.equal(codes.includes("entry_file_duplicate"), true);
  assert.equal(codes.includes("entry_type_not_declared"), true);
  assert.equal(codes.includes("entry_body_not_allowed"), true);
});

test("requires declared entry types when entries exist", () => {
  const result = validateImportSourcePackageManifest(
    cloneManifest({ entryTypes: [] }),
  );

  assert.equal(result.ok, false);
  assert.equal(
    result.issues.some((issue) => issue.code === "entry_types_required"),
    true,
  );
});

test("validates source container taxonomy values", () => {
  const codes = codesFor(
    cloneManifest({
      sourceContainer: {
        ...validManifest.sourceContainer,
        sourceCategory: "adventure_campaign",
        sourceSubtype: "third_party_wiki",
        defaultPlayerVisibility: "players_only",
        clonePolicy: "copy_everywhere",
      },
    }),
  );

  assert.equal(codes.includes("source_category_invalid"), true);
  assert.equal(codes.includes("source_subtype_invalid"), true);
  assert.equal(codes.includes("default_player_visibility_invalid"), true);
  assert.equal(codes.includes("clone_policy_invalid"), true);
});
