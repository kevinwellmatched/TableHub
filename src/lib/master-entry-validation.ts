import type { MasterEntryFormFieldErrors } from "@/lib/master-entry-form-state";

export const MASTER_ENTRY_TITLE_MAX_LENGTH = 160;
export const MASTER_ENTRY_ALIAS_MAX_COUNT = 20;
export const MASTER_ENTRY_SUMMARY_MAX_LENGTH = 1000;
export const MASTER_ENTRY_BODY_MAX_LENGTH = 50000;
export const MASTER_ENTRY_SORT_ORDER_MIN = 0;
export const MASTER_ENTRY_SORT_ORDER_MAX = 10000;
export const MASTER_ENTRY_VERSION_MAX_LENGTH = 40;
export const MASTER_ENTRY_SOURCE_NOTES_MAX_LENGTH = 2000;

export const MASTER_ENTRY_LIBRARY_KINDS = [
  "compendium",
  "settings_library",
] as const;
export const MASTER_ENTRY_BODY_FORMATS = ["plain_text", "markdown"] as const;
export const MASTER_ENTRY_VISIBILITIES = ["private", "shared", "public"] as const;
export const MASTER_ENTRY_SOURCE_TYPES = [
  "manual",
  "srd",
  "owned_book",
  "owned_notes",
  "markdown_import",
  "pdf_import",
  "csv_import",
  "external_reference",
  "other",
] as const;

export type MasterEntryLibraryKind =
  (typeof MASTER_ENTRY_LIBRARY_KINDS)[number];
export type MasterEntryBodyFormat = (typeof MASTER_ENTRY_BODY_FORMATS)[number];
export type MasterEntryVisibility = (typeof MASTER_ENTRY_VISIBILITIES)[number];
export type MasterEntrySourceType = (typeof MASTER_ENTRY_SOURCE_TYPES)[number];
export type MasterEntryProperties = Record<string, unknown>;

export type MasterEntryInput = {
  libraryKind: string;
  compendiumId: string;
  settingsLibraryId: string;
  entryTypeId: string;
  title: string;
  aliases: string;
  summary: string;
  body: string;
  bodyFormat: string;
  properties: string;
  visibility: string;
  sortOrder: string;
  licenseName: string;
  licenseUrl: string;
  sourceType: string;
  sourceUrl: string;
  sourceNotes: string;
  version: string;
};

export type ValidMasterEntryInput = {
  library_kind: MasterEntryLibraryKind;
  compendium_id: string | null;
  settings_library_id: string | null;
  entry_type_id: string;
  title: string;
  slug: string;
  aliases: string[];
  summary: string;
  body: string;
  body_format: MasterEntryBodyFormat;
  properties: MasterEntryProperties;
  visibility: MasterEntryVisibility;
  sort_order: number;
  license_name: string;
  license_url: string;
  source_type: MasterEntrySourceType;
  source_url: string;
  source_notes: string;
  version: string;
};

export function createMasterEntrySlugFromTitle(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function validateMasterEntryInput(input: MasterEntryInput) {
  const fieldErrors: MasterEntryFormFieldErrors = {};
  const libraryKind = input.libraryKind.trim();
  const compendiumId = input.compendiumId.trim();
  const settingsLibraryId = input.settingsLibraryId.trim();
  const entryTypeId = input.entryTypeId.trim();
  const title = input.title.trim();
  const aliases = parseAliases(input.aliases);
  const summary = input.summary.trim();
  const body = input.body.trim();
  const bodyFormat = input.bodyFormat.trim();
  const propertiesText = input.properties.trim();
  const visibility = input.visibility.trim();
  const sortOrderText = input.sortOrder.trim();
  const sortOrder = sortOrderText === "" ? 0 : Number(sortOrderText);
  const licenseName = input.licenseName.trim();
  const licenseUrl = input.licenseUrl.trim();
  const sourceType = input.sourceType.trim();
  const sourceUrl = input.sourceUrl.trim();
  const sourceNotes = input.sourceNotes.trim();
  const version = input.version.trim();
  const slug = createMasterEntrySlugFromTitle(title);
  const properties = parseProperties(propertiesText, fieldErrors);

  if (!title) {
    fieldErrors.title = "Master Entry title is required.";
  } else if (title.length > MASTER_ENTRY_TITLE_MAX_LENGTH) {
    fieldErrors.title = `Title must be ${MASTER_ENTRY_TITLE_MAX_LENGTH} characters or fewer.`;
  }

  if (title && !isLowercaseHyphenSlug(slug)) {
    fieldErrors.title = "Title must create a lowercase hyphen slug.";
  }

  if (!isMasterEntryLibraryKind(libraryKind)) {
    fieldErrors.libraryKind = "Choose Compendium or Settings Library.";
  }

  if (libraryKind === "compendium") {
    if (!compendiumId) {
      fieldErrors.compendiumId = "Choose a parent Compendium.";
    }

    if (settingsLibraryId) {
      fieldErrors.settingsLibraryId =
        "Settings Library must be empty for Compendium entries.";
    }
  }

  if (libraryKind === "settings_library") {
    if (!settingsLibraryId) {
      fieldErrors.settingsLibraryId = "Choose a parent Settings Library.";
    }

    if (compendiumId) {
      fieldErrors.compendiumId =
        "Compendium must be empty for Settings Library entries.";
    }
  }

  if (!entryTypeId) {
    fieldErrors.entryTypeId = "Choose an Entry Type.";
  }

  if (aliases.length > MASTER_ENTRY_ALIAS_MAX_COUNT) {
    fieldErrors.aliases = `Use ${MASTER_ENTRY_ALIAS_MAX_COUNT} aliases or fewer.`;
  }

  if (summary.length > MASTER_ENTRY_SUMMARY_MAX_LENGTH) {
    fieldErrors.summary = `Summary must be ${MASTER_ENTRY_SUMMARY_MAX_LENGTH} characters or fewer.`;
  }

  if (body.length > MASTER_ENTRY_BODY_MAX_LENGTH) {
    fieldErrors.body = `Body must be ${MASTER_ENTRY_BODY_MAX_LENGTH} characters or fewer.`;
  }

  if (!isMasterEntryBodyFormat(bodyFormat)) {
    fieldErrors.bodyFormat = "Choose plain text or Markdown.";
  }

  if (!isMasterEntryVisibility(visibility)) {
    fieldErrors.visibility = "Choose private, shared, or public.";
  }

  if (
    !Number.isInteger(sortOrder) ||
    sortOrder < MASTER_ENTRY_SORT_ORDER_MIN ||
    sortOrder > MASTER_ENTRY_SORT_ORDER_MAX
  ) {
    fieldErrors.sortOrder = "Sort order must be a whole number from 0 to 10000.";
  }

  if (licenseUrl && !isValidUrl(licenseUrl)) {
    fieldErrors.licenseUrl = "License URL must be a valid URL.";
  }

  if (!isMasterEntrySourceType(sourceType)) {
    fieldErrors.sourceType = "Choose a supported source type.";
  }

  if (sourceUrl && !isValidUrl(sourceUrl)) {
    fieldErrors.sourceUrl = "Source URL must be a valid URL.";
  }

  if (sourceNotes.length > MASTER_ENTRY_SOURCE_NOTES_MAX_LENGTH) {
    fieldErrors.sourceNotes = `Source notes must be ${MASTER_ENTRY_SOURCE_NOTES_MAX_LENGTH} characters or fewer.`;
  }

  if (!version) {
    fieldErrors.version = "Version is required.";
  } else if (version.length > MASTER_ENTRY_VERSION_MAX_LENGTH) {
    fieldErrors.version = `Version must be ${MASTER_ENTRY_VERSION_MAX_LENGTH} characters or fewer.`;
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false as const,
      fieldErrors,
    };
  }

  return {
    ok: true as const,
    values: {
      library_kind: libraryKind as MasterEntryLibraryKind,
      compendium_id: libraryKind === "compendium" ? compendiumId : null,
      settings_library_id:
        libraryKind === "settings_library" ? settingsLibraryId : null,
      entry_type_id: entryTypeId,
      title,
      slug,
      aliases,
      summary,
      body,
      body_format: bodyFormat as MasterEntryBodyFormat,
      properties,
      visibility: visibility as MasterEntryVisibility,
      sort_order: sortOrder,
      license_name: licenseName,
      license_url: licenseUrl,
      source_type: sourceType as MasterEntrySourceType,
      source_url: sourceUrl,
      source_notes: sourceNotes,
      version,
    } satisfies ValidMasterEntryInput,
  };
}

function parseAliases(value: string) {
  return value
    .split(",")
    .map((alias) => alias.trim())
    .filter(Boolean);
}

function parseProperties(
  value: string,
  fieldErrors: MasterEntryFormFieldErrors,
): MasterEntryProperties {
  if (!value) {
    return {};
  }

  try {
    const parsed: unknown = JSON.parse(value);

    if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") {
      fieldErrors.properties = "Properties must be a JSON object.";
      return {};
    }

    return parsed as MasterEntryProperties;
  } catch {
    fieldErrors.properties = "Properties must be valid JSON object text.";
    return {};
  }
}

function isLowercaseHyphenSlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function isMasterEntryLibraryKind(
  value: string,
): value is MasterEntryLibraryKind {
  return MASTER_ENTRY_LIBRARY_KINDS.includes(value as MasterEntryLibraryKind);
}

function isMasterEntryBodyFormat(
  value: string,
): value is MasterEntryBodyFormat {
  return MASTER_ENTRY_BODY_FORMATS.includes(value as MasterEntryBodyFormat);
}

function isMasterEntryVisibility(
  value: string,
): value is MasterEntryVisibility {
  return MASTER_ENTRY_VISIBILITIES.includes(value as MasterEntryVisibility);
}

function isMasterEntrySourceType(
  value: string,
): value is MasterEntrySourceType {
  return MASTER_ENTRY_SOURCE_TYPES.includes(value as MasterEntrySourceType);
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
