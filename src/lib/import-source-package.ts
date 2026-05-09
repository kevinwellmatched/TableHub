import {
  type LibrarySourceCategory,
  type LibrarySourceClonePolicy,
  type LibrarySourcePlayerVisibility,
  type LibrarySourceSubtype,
  isLibrarySourceCategory,
  isLibrarySourceClonePolicy,
  isLibrarySourcePlayerVisibility,
  isLibrarySourceSubtype,
} from "./library-source-taxonomy.ts";

export const IMPORT_DISTRIBUTION_STATUSES = [
  "tablehub_distributable",
  "private_user_upload",
  "local_dev_fixture",
  "restricted_reference_only",
] as const;

export const IMPORT_SOURCE_KINDS = [
  "srd",
  "orc",
  "creative_commons",
  "public_domain",
  "partner_licensed",
  "original_demo",
  "private_owned_document",
  "private_notes",
  "local_fixture",
  "restricted_reference",
  "other",
] as const;

export const IMPORT_EXTRACTION_METHODS = [
  "text_extraction",
  "ocr",
  "manual_cleanup",
  "ai_assisted_cleanup",
  "other",
] as const;

export const IMPORT_ORIGINAL_FILE_TYPES = [
  "pdf",
  "markdown",
  "csv",
  "html",
  "json",
  "other",
] as const;

export const IMPORT_EXTRACTION_CONFIDENCES = [
  "high",
  "medium",
  "low",
] as const;

export type ImportDistributionStatus =
  (typeof IMPORT_DISTRIBUTION_STATUSES)[number];

export type ImportSourceKind = (typeof IMPORT_SOURCE_KINDS)[number];

export type ImportExtractionMethod =
  (typeof IMPORT_EXTRACTION_METHODS)[number];

export type ImportOriginalFileType =
  (typeof IMPORT_ORIGINAL_FILE_TYPES)[number];

export type ImportExtractionConfidence =
  (typeof IMPORT_EXTRACTION_CONFIDENCES)[number];

export type ImportExtractionMetadata = {
  originalFileName?: string;
  originalFileType?: ImportOriginalFileType;
  originalFileSha256?: string;
  extractionToolName?: string;
  extractionToolVersion?: string;
  extractionMethod?: ImportExtractionMethod;
  extractedAt?: string;
  pageCount?: number;
  chunkCount?: number;
  extractionNotes?: string;
  requiresHumanReview?: boolean;
};

export type ImportSourcePackageManifest = {
  manifestVersion: 1;
  packageId: string;
  packageName: string;
  distributionStatus: ImportDistributionStatus;
  extraction?: ImportExtractionMetadata;
  source: {
    name: string;
    publisher?: string;
    creator?: string;
    licenseName: string;
    licenseUrl?: string;
    sourceUrl?: string;
    sourceKind: ImportSourceKind;
    sourceNotes?: string;
    mayTableHubRedistribute: boolean;
    privateToWorkspace: boolean;
  };
  system: {
    name: string;
    edition?: string;
    publisher?: string;
    rulesetYear?: number;
    version: string;
  };
  sourceContainer: {
    name: string;
    sourceCategory: LibrarySourceCategory;
    sourceSubtype: LibrarySourceSubtype;
    defaultPlayerVisibility?: LibrarySourcePlayerVisibility;
    clonePolicy?: LibrarySourceClonePolicy;
    version: string;
  };
  entryTypes: Array<{
    name: string;
    libraryKind: "compendium" | "settings_library";
    description?: string;
  }>;
  entries: Array<{
    externalId: string;
    file: string;
    title: string;
    entryType: string;
    aliases?: string[];
    summary?: string;
    sourcePage?: string;
    sourcePageStart?: number;
    sourcePageEnd?: number;
    sourceSection?: string;
    extractionConfidence?: ImportExtractionConfidence;
    requiresHumanReview?: boolean;
    sourceUrl?: string;
    licenseName?: string;
    licenseUrl?: string;
  }>;
};

export type ImportManifestValidationIssue = {
  severity: "error" | "warning";
  code: string;
  message: string;
  path?: string;
};

export type ImportManifestValidationResult = {
  ok: boolean;
  issues: ImportManifestValidationIssue[];
};

const DISTRIBUTABLE_SOURCE_KINDS = [
  "srd",
  "orc",
  "creative_commons",
  "public_domain",
  "partner_licensed",
  "original_demo",
] as const;

const DISTRIBUTABLE_SOURCE_KIND_SET: ReadonlySet<ImportSourceKind> = new Set(
  DISTRIBUTABLE_SOURCE_KINDS,
);

const VAGUE_DISTRIBUTABLE_LICENSE_NAMES = [
  "",
  "unknown",
  "personal use",
  "private",
  "tbd",
] as const;

const VAGUE_DISTRIBUTABLE_LICENSE_NAME_SET: ReadonlySet<string> = new Set(
  VAGUE_DISTRIBUTABLE_LICENSE_NAMES,
);

const ENTRY_BODY_FIELDS = ["body", "content", "markdown", "html"] as const;

export function validateImportSourcePackageManifest(
  manifest: unknown,
): ImportManifestValidationResult {
  const issues: ImportManifestValidationIssue[] = [];

  if (!isPlainObject(manifest)) {
    addError(
      issues,
      "manifest_must_be_object",
      "Import source package manifest must be an object.",
    );
    return { ok: false, issues };
  }

  validatePackageFields(manifest, issues);
  validateSourceFields(manifest.source, manifest.distributionStatus, issues);
  validateSystemFields(manifest.system, issues);
  validateSourceContainerFields(manifest.sourceContainer, issues);
  validateExtractionMetadata(manifest.extraction, issues);
  validateEntryTypesAndEntries(manifest.entryTypes, manifest.entries, issues);

  return {
    ok: issues.every((issue) => issue.severity !== "error"),
    issues,
  };
}

export function isTableHubDistributableStatus(
  status: ImportDistributionStatus,
): boolean {
  return status === "tablehub_distributable";
}

export function isPrivateOrRestrictedImportStatus(
  status: ImportDistributionStatus,
): boolean {
  return (
    status === "private_user_upload" ||
    status === "local_dev_fixture" ||
    status === "restricted_reference_only"
  );
}

export function normalizeExternalId(value: string): string {
  return normalizeImportSlugPart(value);
}

export function normalizeImportSlugPart(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function validatePackageFields(
  manifest: Record<string, unknown>,
  issues: ImportManifestValidationIssue[],
) {
  if (manifest.manifestVersion !== 1) {
    addError(
      issues,
      "manifest_version_invalid",
      "Manifest version must be 1.",
      "manifestVersion",
    );
  }

  if (!isNonEmptyString(manifest.packageId)) {
    addError(
      issues,
      "package_id_required",
      "Package ID is required.",
      "packageId",
    );
  }

  if (!isNonEmptyString(manifest.packageName)) {
    addError(
      issues,
      "package_name_required",
      "Package name is required.",
      "packageName",
    );
  }

  if (!isImportDistributionStatus(manifest.distributionStatus)) {
    addError(
      issues,
      "distribution_status_invalid",
      "Distribution status must be one of the supported import statuses.",
      "distributionStatus",
    );
  }
}

function validateSourceFields(
  source: unknown,
  distributionStatus: unknown,
  issues: ImportManifestValidationIssue[],
) {
  if (!isPlainObject(source)) {
    addError(issues, "source_required", "Source provenance is required.", "source");
    return;
  }

  if (!isNonEmptyString(source.name)) {
    addError(
      issues,
      "source_name_required",
      "Source name is required.",
      "source.name",
    );
  }

  if (!isNonEmptyString(source.licenseName)) {
    addError(
      issues,
      "source_license_name_required",
      "Source license name is required.",
      "source.licenseName",
    );
  }

  if (!isImportSourceKind(source.sourceKind)) {
    addError(
      issues,
      "source_kind_invalid",
      "Source kind must be one of the supported source kinds.",
      "source.sourceKind",
    );
  }

  if (typeof source.mayTableHubRedistribute !== "boolean") {
    addError(
      issues,
      "source_redistribution_flag_required",
      "Source redistribution flag must be true or false.",
      "source.mayTableHubRedistribute",
    );
  }

  if (typeof source.privateToWorkspace !== "boolean") {
    addError(
      issues,
      "source_private_flag_required",
      "Source workspace privacy flag must be true or false.",
      "source.privateToWorkspace",
    );
  }

  if (!isImportDistributionStatus(distributionStatus)) {
    return;
  }

  if (distributionStatus === "tablehub_distributable") {
    validateDistributableSource(source, issues);
    return;
  }

  validatePrivateOrRestrictedSource(source, issues);
}

function validateDistributableSource(
  source: Record<string, unknown>,
  issues: ImportManifestValidationIssue[],
) {
  if (source.mayTableHubRedistribute !== true) {
    addError(
      issues,
      "distributable_requires_redistribution_rights",
      "TableHub-distributable packages must explicitly allow TableHub redistribution.",
      "source.mayTableHubRedistribute",
    );
  }

  if (source.privateToWorkspace !== false) {
    addError(
      issues,
      "distributable_cannot_be_workspace_private",
      "TableHub-distributable packages cannot be marked private to a workspace.",
      "source.privateToWorkspace",
    );
  }

  if (
    isImportSourceKind(source.sourceKind) &&
    !DISTRIBUTABLE_SOURCE_KIND_SET.has(source.sourceKind)
  ) {
    addError(
      issues,
      "distributable_source_kind_not_allowed",
      "TableHub-distributable packages must use an approved distributable source kind.",
      "source.sourceKind",
    );
  }

  if (
    typeof source.licenseName === "string" &&
    VAGUE_DISTRIBUTABLE_LICENSE_NAME_SET.has(
      source.licenseName.trim().toLowerCase(),
    )
  ) {
    addError(
      issues,
      "distributable_license_too_vague",
      "TableHub-distributable packages need a clear, non-vague license name.",
      "source.licenseName",
    );
  }
}

function validatePrivateOrRestrictedSource(
  source: Record<string, unknown>,
  issues: ImportManifestValidationIssue[],
) {
  if (source.mayTableHubRedistribute === true) {
    addError(
      issues,
      "private_import_cannot_redistribute",
      "Private, local fixture, and restricted imports must not claim TableHub redistribution rights.",
      "source.mayTableHubRedistribute",
    );
  }

  if (source.privateToWorkspace !== true) {
    addWarning(
      issues,
      "private_import_should_be_workspace_private",
      "Private, local fixture, and restricted imports should normally stay private to the workspace.",
      "source.privateToWorkspace",
    );
  }
}

function validateSystemFields(
  system: unknown,
  issues: ImportManifestValidationIssue[],
) {
  if (!isPlainObject(system)) {
    addError(issues, "system_required", "System metadata is required.", "system");
    return;
  }

  if (!isNonEmptyString(system.name)) {
    addError(
      issues,
      "system_name_required",
      "System name is required.",
      "system.name",
    );
  }

  if (!isNonEmptyString(system.version)) {
    addError(
      issues,
      "system_version_required",
      "System version is required.",
      "system.version",
    );
  }
}

function validateSourceContainerFields(
  sourceContainer: unknown,
  issues: ImportManifestValidationIssue[],
) {
  if (!isPlainObject(sourceContainer)) {
    addError(
      issues,
      "source_container_required",
      "Source container metadata is required.",
      "sourceContainer",
    );
    return;
  }

  if (!isNonEmptyString(sourceContainer.name)) {
    addError(
      issues,
      "source_container_name_required",
      "Source container name is required.",
      "sourceContainer.name",
    );
  }

  if (
    !isNonEmptyString(sourceContainer.sourceCategory) ||
    !isLibrarySourceCategory(sourceContainer.sourceCategory)
  ) {
    addError(
      issues,
      "source_category_invalid",
      "Source container category must match the Library Source taxonomy.",
      "sourceContainer.sourceCategory",
    );
  }

  if (
    !isNonEmptyString(sourceContainer.sourceSubtype) ||
    !isLibrarySourceSubtype(sourceContainer.sourceSubtype)
  ) {
    addError(
      issues,
      "source_subtype_invalid",
      "Source container subtype should match the Library Source taxonomy.",
      "sourceContainer.sourceSubtype",
    );
  }

  if (
    sourceContainer.defaultPlayerVisibility !== undefined &&
    (!isNonEmptyString(sourceContainer.defaultPlayerVisibility) ||
      !isLibrarySourcePlayerVisibility(sourceContainer.defaultPlayerVisibility))
  ) {
    addError(
      issues,
      "default_player_visibility_invalid",
      "Default player visibility must match the Library Source taxonomy.",
      "sourceContainer.defaultPlayerVisibility",
    );
  }

  if (
    sourceContainer.clonePolicy !== undefined &&
    (!isNonEmptyString(sourceContainer.clonePolicy) ||
      !isLibrarySourceClonePolicy(sourceContainer.clonePolicy))
  ) {
    addError(
      issues,
      "clone_policy_invalid",
      "Clone policy must match the Library Source taxonomy.",
      "sourceContainer.clonePolicy",
    );
  }

  if (!isNonEmptyString(sourceContainer.version)) {
    addError(
      issues,
      "source_container_version_required",
      "Source container version is required.",
      "sourceContainer.version",
    );
  }
}

function validateExtractionMetadata(
  extraction: unknown,
  issues: ImportManifestValidationIssue[],
) {
  if (extraction === undefined) {
    return;
  }

  if (!isPlainObject(extraction)) {
    addError(
      issues,
      "extraction_must_be_object",
      "Extraction metadata must be an object when provided.",
      "extraction",
    );
    return;
  }

  if (
    extraction.originalFileType !== undefined &&
    !isImportOriginalFileType(extraction.originalFileType)
  ) {
    addError(
      issues,
      "extraction_file_type_invalid",
      "Original file type must be one of the supported file types.",
      "extraction.originalFileType",
    );
  }

  if (
    extraction.extractionMethod !== undefined &&
    !isImportExtractionMethod(extraction.extractionMethod)
  ) {
    addError(
      issues,
      "extraction_method_invalid",
      "Extraction method must be one of the supported methods.",
      "extraction.extractionMethod",
    );
  }

  if (
    extraction.originalFileSha256 !== undefined &&
    (!isString(extraction.originalFileSha256) ||
      !/^[a-f0-9]{64}$/.test(extraction.originalFileSha256))
  ) {
    addError(
      issues,
      "extraction_sha256_invalid",
      "Original file SHA-256 must be a lowercase 64-character hex string.",
      "extraction.originalFileSha256",
    );
  }

  if (
    extraction.extractedAt !== undefined &&
    (!isString(extraction.extractedAt) ||
      !isReadableIsoDateString(extraction.extractedAt))
  ) {
    addError(
      issues,
      "extraction_date_invalid",
      "Extraction date must be a readable ISO date string.",
      "extraction.extractedAt",
    );
  }

  if (
    extraction.pageCount !== undefined &&
    !isPositiveInteger(extraction.pageCount)
  ) {
    addError(
      issues,
      "extraction_page_count_invalid",
      "Extraction page count must be a positive whole number.",
      "extraction.pageCount",
    );
  }

  if (
    extraction.chunkCount !== undefined &&
    !isPositiveInteger(extraction.chunkCount)
  ) {
    addError(
      issues,
      "extraction_chunk_count_invalid",
      "Extraction chunk count must be a positive whole number.",
      "extraction.chunkCount",
    );
  }

  if (
    extraction.extractionMethod === "ai_assisted_cleanup" &&
    extraction.requiresHumanReview !== true
  ) {
    addWarning(
      issues,
      "ai_cleanup_requires_review",
      "AI-assisted cleanup should require human review before import.",
      "extraction.requiresHumanReview",
    );
  }
}

function validateEntryTypesAndEntries(
  entryTypes: unknown,
  entries: unknown,
  issues: ImportManifestValidationIssue[],
) {
  if (!Array.isArray(entryTypes)) {
    addError(
      issues,
      "entry_types_must_be_array",
      "Entry types must be an array.",
      "entryTypes",
    );
    return;
  }

  if (!Array.isArray(entries)) {
    addError(
      issues,
      "entries_must_be_array",
      "Entries must be an array.",
      "entries",
    );
    return;
  }

  const declaredEntryTypes = validateEntryTypes(entryTypes, issues);

  if (entries.length > 0 && declaredEntryTypes.size === 0) {
    addError(
      issues,
      "entry_types_required",
      "At least one declared entry type is required when entries are listed.",
      "entryTypes",
    );
  }

  validateEntries(entries, declaredEntryTypes, issues);
}

function validateEntryTypes(
  entryTypes: unknown[],
  issues: ImportManifestValidationIssue[],
) {
  const declaredEntryTypes = new Set<string>();

  entryTypes.forEach((entryType, index) => {
    const path = `entryTypes[${index}]`;

    if (!isPlainObject(entryType)) {
      addError(
        issues,
        "entry_type_must_be_object",
        "Each entry type must be an object.",
        path,
      );
      return;
    }

    if (!isNonEmptyString(entryType.name)) {
      addError(
        issues,
        "entry_type_name_required",
        "Entry type name is required.",
        `${path}.name`,
      );
    } else if (declaredEntryTypes.has(entryType.name.trim())) {
      addError(
        issues,
        "entry_type_name_duplicate",
        "Entry type names must be unique.",
        `${path}.name`,
      );
    } else {
      declaredEntryTypes.add(entryType.name.trim());
    }

    if (
      entryType.libraryKind !== "compendium" &&
      entryType.libraryKind !== "settings_library"
    ) {
      addError(
        issues,
        "entry_type_library_kind_invalid",
        "Entry type library kind must be compendium or settings_library.",
        `${path}.libraryKind`,
      );
    }
  });

  return declaredEntryTypes;
}

function validateEntries(
  entries: unknown[],
  declaredEntryTypes: Set<string>,
  issues: ImportManifestValidationIssue[],
) {
  const externalIds = new Set<string>();
  const files = new Set<string>();

  entries.forEach((entry, index) => {
    const path = `entries[${index}]`;

    if (!isPlainObject(entry)) {
      addError(
        issues,
        "entry_must_be_object",
        "Each entry must be an object.",
        path,
      );
      return;
    }

    validateEntryRequiredFields(entry, path, issues);
    validateEntryUniqueness(entry, path, externalIds, files, issues);
    validateEntryTypeMapping(entry, path, declaredEntryTypes, issues);
    validateEntryPageRange(entry, path, issues);
    validateEntryConfidence(entry, path, issues);
    validateEntryHasNoBodyContent(entry, path, issues);
  });
}

function validateEntryRequiredFields(
  entry: Record<string, unknown>,
  path: string,
  issues: ImportManifestValidationIssue[],
) {
  if (!isNonEmptyString(entry.externalId)) {
    addError(
      issues,
      "entry_external_id_required",
      "Every entry needs an external ID.",
      `${path}.externalId`,
    );
  }

  if (!isNonEmptyString(entry.file)) {
    addError(
      issues,
      "entry_file_required",
      "Every entry needs a file path.",
      `${path}.file`,
    );
  }

  if (!isNonEmptyString(entry.title)) {
    addError(
      issues,
      "entry_title_required",
      "Every entry needs a title.",
      `${path}.title`,
    );
  }

  if (!isNonEmptyString(entry.entryType)) {
    addError(
      issues,
      "entry_type_required",
      "Every entry needs an entry type.",
      `${path}.entryType`,
    );
  }
}

function validateEntryUniqueness(
  entry: Record<string, unknown>,
  path: string,
  externalIds: Set<string>,
  files: Set<string>,
  issues: ImportManifestValidationIssue[],
) {
  if (isNonEmptyString(entry.externalId)) {
    const normalizedExternalId = normalizeExternalId(entry.externalId);

    if (externalIds.has(normalizedExternalId)) {
      addError(
        issues,
        "entry_external_id_duplicate",
        "Entry external IDs must be unique.",
        `${path}.externalId`,
      );
    } else {
      externalIds.add(normalizedExternalId);
    }
  }

  if (isNonEmptyString(entry.file)) {
    const normalizedFile = entry.file.trim().toLowerCase();

    if (files.has(normalizedFile)) {
      addError(
        issues,
        "entry_file_duplicate",
        "Entry file paths must be unique.",
        `${path}.file`,
      );
    } else {
      files.add(normalizedFile);
    }
  }
}

function validateEntryTypeMapping(
  entry: Record<string, unknown>,
  path: string,
  declaredEntryTypes: Set<string>,
  issues: ImportManifestValidationIssue[],
) {
  if (
    isNonEmptyString(entry.entryType) &&
    declaredEntryTypes.size > 0 &&
    !declaredEntryTypes.has(entry.entryType.trim())
  ) {
    addError(
      issues,
      "entry_type_not_declared",
      "Entry type must match one of the declared entry type names.",
      `${path}.entryType`,
    );
  }
}

function validateEntryPageRange(
  entry: Record<string, unknown>,
  path: string,
  issues: ImportManifestValidationIssue[],
) {
  const hasStart = entry.sourcePageStart !== undefined;
  const hasEnd = entry.sourcePageEnd !== undefined;

  if (hasStart && !isPositiveInteger(entry.sourcePageStart)) {
    addError(
      issues,
      "entry_source_page_start_invalid",
      "Entry source page start must be a positive whole number.",
      `${path}.sourcePageStart`,
    );
  }

  if (hasEnd && !isPositiveInteger(entry.sourcePageEnd)) {
    addError(
      issues,
      "entry_source_page_end_invalid",
      "Entry source page end must be a positive whole number.",
      `${path}.sourcePageEnd`,
    );
  }

  if (
    isPositiveInteger(entry.sourcePageStart) &&
    isPositiveInteger(entry.sourcePageEnd) &&
    entry.sourcePageEnd < entry.sourcePageStart
  ) {
    addError(
      issues,
      "entry_source_page_range_invalid",
      "Entry source page end must be greater than or equal to source page start.",
      `${path}.sourcePageEnd`,
    );
  }
}

function validateEntryConfidence(
  entry: Record<string, unknown>,
  path: string,
  issues: ImportManifestValidationIssue[],
) {
  if (
    entry.extractionConfidence !== undefined &&
    !isImportExtractionConfidence(entry.extractionConfidence)
  ) {
    addError(
      issues,
      "entry_extraction_confidence_invalid",
      "Entry extraction confidence must be high, medium, or low.",
      `${path}.extractionConfidence`,
    );
  }
}

function validateEntryHasNoBodyContent(
  entry: Record<string, unknown>,
  path: string,
  issues: ImportManifestValidationIssue[],
) {
  for (const field of ENTRY_BODY_FIELDS) {
    if (entry[field] !== undefined) {
      addError(
        issues,
        "entry_body_not_allowed",
        "Entry body content does not belong in the manifest; manifests point to files only.",
        `${path}.${field}`,
      );
    }
  }
}

function isImportDistributionStatus(
  value: unknown,
): value is ImportDistributionStatus {
  return (
    typeof value === "string" &&
    IMPORT_DISTRIBUTION_STATUSES.includes(value as ImportDistributionStatus)
  );
}

function isImportSourceKind(value: unknown): value is ImportSourceKind {
  return (
    typeof value === "string" &&
    IMPORT_SOURCE_KINDS.includes(value as ImportSourceKind)
  );
}

function isImportExtractionMethod(
  value: unknown,
): value is ImportExtractionMethod {
  return (
    typeof value === "string" &&
    IMPORT_EXTRACTION_METHODS.includes(value as ImportExtractionMethod)
  );
}

function isImportOriginalFileType(
  value: unknown,
): value is ImportOriginalFileType {
  return (
    typeof value === "string" &&
    IMPORT_ORIGINAL_FILE_TYPES.includes(value as ImportOriginalFileType)
  );
}

function isImportExtractionConfidence(
  value: unknown,
): value is ImportExtractionConfidence {
  return (
    typeof value === "string" &&
    IMPORT_EXTRACTION_CONFIDENCES.includes(
      value as ImportExtractionConfidence,
    )
  );
}

function addError(
  issues: ImportManifestValidationIssue[],
  code: string,
  message: string,
  path?: string,
) {
  issues.push({ severity: "error", code, message, path });
}

function addWarning(
  issues: ImportManifestValidationIssue[],
  code: string,
  message: string,
  path?: string,
) {
  issues.push({ severity: "warning", code, message, path });
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function isReadableIsoDateString(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return false;
  }

  return !Number.isNaN(Date.parse(value));
}
