import type { CompendiumFormFieldErrors } from "@/lib/compendium-form-state";
import {
  isLibrarySourceCategory,
  isLibrarySourceClonePolicy,
  isLibrarySourcePlayerVisibility,
  isLibrarySourceSubtype,
  type LibrarySourceCategory,
  type LibrarySourceClonePolicy,
  type LibrarySourcePlayerVisibility,
  type LibrarySourceSubtype,
} from "./library-source-taxonomy.ts";

export const COMPENDIUM_NAME_MAX_LENGTH = 120;
export const COMPENDIUM_DESCRIPTION_MAX_LENGTH = 2000;
export const COMPENDIUM_SOURCE_NOTES_MAX_LENGTH = 2000;
export const COMPENDIUM_VERSION_MAX_LENGTH = 40;

export const COMPENDIUM_VISIBILITIES = ["private", "shared", "public"] as const;
export const COMPENDIUM_SOURCE_TYPES = [
  "manual",
  "srd",
  "owned_book",
  "markdown_import",
  "pdf_import",
  "csv_import",
  "external_reference",
  "other",
] as const;

export type CompendiumVisibility = (typeof COMPENDIUM_VISIBILITIES)[number];
export type CompendiumSourceType = (typeof COMPENDIUM_SOURCE_TYPES)[number];

export type CompendiumInput = {
  name: string;
  description: string;
  gameSystemId: string;
  visibility: string;
  licenseName: string;
  licenseUrl: string;
  sourceType: string;
  sourceCategory: string;
  sourceSubtype: string;
  clonePolicy: string;
  defaultPlayerVisibility: string;
  sourceUrl: string;
  sourceNotes: string;
  version: string;
};

export type ValidCompendiumInput = {
  name: string;
  slug: string;
  description: string;
  game_system_id: string;
  visibility: CompendiumVisibility;
  license_name: string;
  license_url: string;
  source_type: CompendiumSourceType;
  source_category: LibrarySourceCategory;
  source_subtype: LibrarySourceSubtype;
  clone_policy: LibrarySourceClonePolicy;
  default_player_visibility: LibrarySourcePlayerVisibility;
  source_url: string;
  source_notes: string;
  version: string;
};

export const DND_5E_2014_STARTER_COMPENDIUM: CompendiumInput = {
  name: "D&D 5e 2014 Starter Compendium",
  description:
    "A starter master compendium container for D&D 5e 2014 reference content. No book text or SRD entries have been imported yet.",
  gameSystemId: "",
  visibility: "private",
  licenseName: "Manual placeholder",
  licenseUrl: "",
  sourceType: "manual",
  sourceCategory: "expansion_supplement",
  sourceSubtype: "supplement",
  clonePolicy: "locked_to_system",
  defaultPlayerVisibility: "visible",
  sourceUrl: "",
  sourceNotes:
    "Container only. No rules text, SRD content, book text, or third-party data imported.",
  version: "0.1",
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

export function validateCompendiumInput(input: CompendiumInput) {
  const fieldErrors: CompendiumFormFieldErrors = {};
  const name = input.name.trim();
  const description = input.description.trim();
  const gameSystemId = input.gameSystemId.trim();
  const visibility = input.visibility.trim();
  const licenseName = input.licenseName.trim();
  const licenseUrl = input.licenseUrl.trim();
  const sourceType = input.sourceType.trim();
  const sourceCategory = input.sourceCategory.trim();
  const sourceSubtype = input.sourceSubtype.trim();
  const clonePolicy = input.clonePolicy.trim();
  const defaultPlayerVisibility = input.defaultPlayerVisibility.trim();
  const sourceUrl = input.sourceUrl.trim();
  const sourceNotes = input.sourceNotes.trim();
  const version = input.version.trim();
  const slug = createSlugFromName(name);

  if (!name) {
    fieldErrors.name = "Compendium name is required.";
  } else if (name.length > COMPENDIUM_NAME_MAX_LENGTH) {
    fieldErrors.name = `Compendium name must be ${COMPENDIUM_NAME_MAX_LENGTH} characters or fewer.`;
  }

  if (name && !isLowercaseHyphenSlug(slug)) {
    fieldErrors.name = "Compendium name must create a lowercase hyphen slug.";
  }

  if (description.length > COMPENDIUM_DESCRIPTION_MAX_LENGTH) {
    fieldErrors.description = `Description must be ${COMPENDIUM_DESCRIPTION_MAX_LENGTH} characters or fewer.`;
  }

  if (!gameSystemId) {
    fieldErrors.gameSystemId = "Choose a game system.";
  }

  if (!isCompendiumVisibility(visibility)) {
    fieldErrors.visibility = "Choose private, shared, or public.";
  }

  if (licenseUrl && !isValidishUrl(licenseUrl)) {
    fieldErrors.licenseUrl = "Enter a valid URL, or leave it blank.";
  }

  if (!isCompendiumSourceType(sourceType)) {
    fieldErrors.sourceType = "Choose a supported source type.";
  }

  if (!isLibrarySourceCategory(sourceCategory)) {
    fieldErrors.sourceCategory = "Choose a supported source category.";
  }

  if (!isLibrarySourceSubtype(sourceSubtype)) {
    fieldErrors.sourceSubtype = "Choose a supported source subtype.";
  }

  if (!isLibrarySourceClonePolicy(clonePolicy)) {
    fieldErrors.clonePolicy = "Choose a supported clone policy.";
  }

  if (!isLibrarySourcePlayerVisibility(defaultPlayerVisibility)) {
    fieldErrors.defaultPlayerVisibility =
      "Choose a supported default player visibility.";
  }

  if (sourceUrl && !isValidishUrl(sourceUrl)) {
    fieldErrors.sourceUrl = "Enter a valid URL, or leave it blank.";
  }

  if (sourceNotes.length > COMPENDIUM_SOURCE_NOTES_MAX_LENGTH) {
    fieldErrors.sourceNotes = `Source notes must be ${COMPENDIUM_SOURCE_NOTES_MAX_LENGTH} characters or fewer.`;
  }

  if (!version) {
    fieldErrors.version = "Version is required.";
  } else if (version.length > COMPENDIUM_VERSION_MAX_LENGTH) {
    fieldErrors.version = `Version must be ${COMPENDIUM_VERSION_MAX_LENGTH} characters or fewer.`;
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
      description,
      game_system_id: gameSystemId,
      visibility: visibility as CompendiumVisibility,
      license_name: licenseName,
      license_url: licenseUrl,
      source_type: sourceType as CompendiumSourceType,
      source_category: sourceCategory as LibrarySourceCategory,
      source_subtype: sourceSubtype as LibrarySourceSubtype,
      clone_policy: clonePolicy as LibrarySourceClonePolicy,
      default_player_visibility:
        defaultPlayerVisibility as LibrarySourcePlayerVisibility,
      source_url: sourceUrl,
      source_notes: sourceNotes,
      version,
    } satisfies ValidCompendiumInput,
  };
}

function isLowercaseHyphenSlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function isCompendiumVisibility(value: string): value is CompendiumVisibility {
  return COMPENDIUM_VISIBILITIES.includes(value as CompendiumVisibility);
}

function isCompendiumSourceType(value: string): value is CompendiumSourceType {
  return COMPENDIUM_SOURCE_TYPES.includes(value as CompendiumSourceType);
}

function isValidishUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
