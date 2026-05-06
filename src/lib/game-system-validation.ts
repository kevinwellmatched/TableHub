import type { GameSystemFormFieldErrors } from "@/lib/game-system-form-state";

export const GAME_SYSTEM_NAME_MAX_LENGTH = 120;
export const GAME_SYSTEM_EDITION_MAX_LENGTH = 80;
export const GAME_SYSTEM_PUBLISHER_MAX_LENGTH = 120;
export const GAME_SYSTEM_DESCRIPTION_MAX_LENGTH = 2000;
export const GAME_SYSTEM_SOURCE_NOTES_MAX_LENGTH = 2000;
export const GAME_SYSTEM_VERSION_MAX_LENGTH = 80;

export const GAME_SYSTEM_VISIBILITIES = ["private", "shared", "public"] as const;
export const GAME_SYSTEM_SOURCE_TYPES = [
  "manual",
  "srd",
  "private_markdown",
  "pdf",
  "csv",
  "copy_paste",
  "external_reference",
] as const;

export type GameSystemVisibility = (typeof GAME_SYSTEM_VISIBILITIES)[number];
export type GameSystemSourceType = (typeof GAME_SYSTEM_SOURCE_TYPES)[number];

export type GameSystemInput = {
  name: string;
  edition: string;
  publisher: string;
  description: string;
  rulesetYear: string;
  visibility: string;
  licenseName: string;
  licenseUrl: string;
  sourceType: string;
  sourceUrl: string;
  sourceNotes: string;
  version: string;
};

export type ValidGameSystemInput = {
  name: string;
  slug: string;
  edition: string;
  publisher: string;
  description: string;
  ruleset_year: number | null;
  visibility: GameSystemVisibility;
  license_name: string;
  license_url: string;
  source_type: GameSystemSourceType;
  source_url: string;
  source_notes: string;
  version: string;
};

export const DND_5E_2014_STARTER_SYSTEM: GameSystemInput = {
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
};

export function createSlugFromName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\bd\s*&\s*d\b/g, "dnd")
    .replace(/&/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function validateGameSystemInput(input: GameSystemInput) {
  const fieldErrors: GameSystemFormFieldErrors = {};
  const name = input.name.trim();
  const edition = input.edition.trim();
  const publisher = input.publisher.trim();
  const description = input.description.trim();
  const rulesetYear = input.rulesetYear.trim();
  const visibility = input.visibility.trim();
  const licenseName = input.licenseName.trim();
  const licenseUrl = input.licenseUrl.trim();
  const sourceType = input.sourceType.trim();
  const sourceUrl = input.sourceUrl.trim();
  const sourceNotes = input.sourceNotes.trim();
  const version = input.version.trim();
  const slug = createSlugFromName(name);

  if (!name) {
    fieldErrors.name = "System name is required.";
  } else if (name.length > GAME_SYSTEM_NAME_MAX_LENGTH) {
    fieldErrors.name = `System name must be ${GAME_SYSTEM_NAME_MAX_LENGTH} characters or fewer.`;
  }

  if (name && !slug) {
    fieldErrors.name = "System name must include at least one letter or number.";
  }

  if (edition.length > GAME_SYSTEM_EDITION_MAX_LENGTH) {
    fieldErrors.edition = `Edition must be ${GAME_SYSTEM_EDITION_MAX_LENGTH} characters or fewer.`;
  }

  if (publisher.length > GAME_SYSTEM_PUBLISHER_MAX_LENGTH) {
    fieldErrors.publisher = `Publisher must be ${GAME_SYSTEM_PUBLISHER_MAX_LENGTH} characters or fewer.`;
  }

  if (description.length > GAME_SYSTEM_DESCRIPTION_MAX_LENGTH) {
    fieldErrors.description = `Description must be ${GAME_SYSTEM_DESCRIPTION_MAX_LENGTH} characters or fewer.`;
  }

  const parsedRulesetYear = parseRulesetYear(rulesetYear);
  if (parsedRulesetYear === "invalid") {
    fieldErrors.rulesetYear = "Ruleset year must be blank or between 1900 and 2200.";
  }

  if (!isGameSystemVisibility(visibility)) {
    fieldErrors.visibility = "Choose private, shared, or public.";
  }

  if (licenseUrl && !isValidishUrl(licenseUrl)) {
    fieldErrors.licenseUrl = "Enter a valid URL, or leave it blank.";
  }

  if (!isGameSystemSourceType(sourceType)) {
    fieldErrors.sourceType = "Choose a supported source type.";
  }

  if (sourceUrl && !isValidishUrl(sourceUrl)) {
    fieldErrors.sourceUrl = "Enter a valid URL, or leave it blank.";
  }

  if (sourceNotes.length > GAME_SYSTEM_SOURCE_NOTES_MAX_LENGTH) {
    fieldErrors.sourceNotes = `Source notes must be ${GAME_SYSTEM_SOURCE_NOTES_MAX_LENGTH} characters or fewer.`;
  }

  if (!version) {
    fieldErrors.version = "Version is required.";
  } else if (version.length > GAME_SYSTEM_VERSION_MAX_LENGTH) {
    fieldErrors.version = `Version must be ${GAME_SYSTEM_VERSION_MAX_LENGTH} characters or fewer.`;
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
      name,
      slug,
      edition,
      publisher,
      description,
      ruleset_year: parsedRulesetYear === "invalid" ? null : parsedRulesetYear,
      visibility: visibility as GameSystemVisibility,
      license_name: licenseName,
      license_url: licenseUrl,
      source_type: sourceType as GameSystemSourceType,
      source_url: sourceUrl,
      source_notes: sourceNotes,
      version,
    } satisfies ValidGameSystemInput,
  };
}

function parseRulesetYear(value: string) {
  if (!value) {
    return null;
  }

  if (!/^\d{4}$/.test(value)) {
    return "invalid" as const;
  }

  const year = Number(value);

  if (year < 1900 || year > 2200) {
    return "invalid" as const;
  }

  return year;
}

function isGameSystemVisibility(value: string): value is GameSystemVisibility {
  return GAME_SYSTEM_VISIBILITIES.includes(value as GameSystemVisibility);
}

function isGameSystemSourceType(value: string): value is GameSystemSourceType {
  return GAME_SYSTEM_SOURCE_TYPES.includes(value as GameSystemSourceType);
}

function isValidishUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
