import type { SettingsLibraryFormFieldErrors } from "@/lib/settings-library-form-state";
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

export const SETTINGS_LIBRARY_NAME_MAX_LENGTH = 120;
export const SETTINGS_LIBRARY_DESCRIPTION_MAX_LENGTH = 2000;
export const SETTINGS_LIBRARY_GENRE_MAX_LENGTH = 80;
export const SETTINGS_LIBRARY_TONE_MAX_LENGTH = 120;
export const SETTINGS_LIBRARY_SOURCE_NOTES_MAX_LENGTH = 2000;
export const SETTINGS_LIBRARY_VERSION_MAX_LENGTH = 40;

export const SETTINGS_LIBRARY_VISIBILITIES = ["private", "shared", "public"] as const;
export const SETTINGS_LIBRARY_SOURCE_TYPES = [
  "manual",
  "owned_notes",
  "markdown_import",
  "pdf_import",
  "csv_import",
  "campaign_export",
  "external_reference",
  "other",
] as const;

export type SettingsLibraryVisibility =
  (typeof SETTINGS_LIBRARY_VISIBILITIES)[number];
export type SettingsLibrarySourceType =
  (typeof SETTINGS_LIBRARY_SOURCE_TYPES)[number];

export type SettingsLibraryInput = {
  name: string;
  description: string;
  visibility: string;
  genre: string;
  tone: string;
  sourceType: string;
  gameSystemId: string;
  sourceCategory: string;
  sourceSubtype: string;
  clonePolicy: string;
  defaultPlayerVisibility: string;
  sourceUrl: string;
  sourceNotes: string;
  version: string;
};

export type ValidSettingsLibraryInput = {
  name: string;
  slug: string;
  description: string;
  visibility: SettingsLibraryVisibility;
  genre: string;
  tone: string;
  source_type: SettingsLibrarySourceType;
  game_system_id: string | null;
  source_category: LibrarySourceCategory;
  source_subtype: LibrarySourceSubtype;
  clone_policy: LibrarySourceClonePolicy;
  default_player_visibility: LibrarySourcePlayerVisibility;
  source_url: string;
  source_notes: string;
  version: string;
};

export const STARTER_FANTASY_SETTINGS_LIBRARY: SettingsLibraryInput = {
  name: "Starter Fantasy Settings Library",
  description:
    "A reusable master Settings Library container for fantasy campaign lore. No NPCs, places, factions, maps, timelines, or lore entries have been created yet.",
  visibility: "private",
  genre: "Fantasy",
  tone: "Adventurous, mysterious, table-ready",
  sourceType: "manual",
  gameSystemId: "",
  sourceCategory: "setting_world_lore",
  sourceSubtype: "campaign_setting",
  clonePolicy: "cloneable_to_system",
  defaultPlayerVisibility: "gm_only",
  sourceUrl: "",
  sourceNotes:
    "Container only. No setting entries, imported notes, copyrighted text, or third-party data have been added.",
  version: "0.1",
};

export function createSettingsLibrarySlugFromName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function validateSettingsLibraryInput(input: SettingsLibraryInput) {
  const fieldErrors: SettingsLibraryFormFieldErrors = {};
  const name = input.name.trim();
  const description = input.description.trim();
  const visibility = input.visibility.trim();
  const genre = input.genre.trim();
  const tone = input.tone.trim();
  const sourceType = input.sourceType.trim();
  const gameSystemId = input.gameSystemId.trim();
  const sourceCategory = input.sourceCategory.trim();
  const sourceSubtype = input.sourceSubtype.trim();
  const clonePolicy = input.clonePolicy.trim();
  const defaultPlayerVisibility = input.defaultPlayerVisibility.trim();
  const sourceUrl = input.sourceUrl.trim();
  const sourceNotes = input.sourceNotes.trim();
  const version = input.version.trim();
  const slug = createSettingsLibrarySlugFromName(name);

  if (!name) {
    fieldErrors.name = "Settings Library name is required.";
  } else if (name.length > SETTINGS_LIBRARY_NAME_MAX_LENGTH) {
    fieldErrors.name = `Settings Library name must be ${SETTINGS_LIBRARY_NAME_MAX_LENGTH} characters or fewer.`;
  }

  if (name && !isLowercaseHyphenSlug(slug)) {
    fieldErrors.name = "Settings Library name must create a lowercase hyphen slug.";
  }

  if (description.length > SETTINGS_LIBRARY_DESCRIPTION_MAX_LENGTH) {
    fieldErrors.description = `Description must be ${SETTINGS_LIBRARY_DESCRIPTION_MAX_LENGTH} characters or fewer.`;
  }

  if (!isSettingsLibraryVisibility(visibility)) {
    fieldErrors.visibility = "Choose private, shared, or public.";
  }

  if (genre.length > SETTINGS_LIBRARY_GENRE_MAX_LENGTH) {
    fieldErrors.genre = `Genre must be ${SETTINGS_LIBRARY_GENRE_MAX_LENGTH} characters or fewer.`;
  }

  if (tone.length > SETTINGS_LIBRARY_TONE_MAX_LENGTH) {
    fieldErrors.tone = `Tone must be ${SETTINGS_LIBRARY_TONE_MAX_LENGTH} characters or fewer.`;
  }

  if (!isSettingsLibrarySourceType(sourceType)) {
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

  if (sourceNotes.length > SETTINGS_LIBRARY_SOURCE_NOTES_MAX_LENGTH) {
    fieldErrors.sourceNotes = `Source notes must be ${SETTINGS_LIBRARY_SOURCE_NOTES_MAX_LENGTH} characters or fewer.`;
  }

  if (!version) {
    fieldErrors.version = "Version is required.";
  } else if (version.length > SETTINGS_LIBRARY_VERSION_MAX_LENGTH) {
    fieldErrors.version = `Version must be ${SETTINGS_LIBRARY_VERSION_MAX_LENGTH} characters or fewer.`;
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
      visibility: visibility as SettingsLibraryVisibility,
      genre,
      tone,
      source_type: sourceType as SettingsLibrarySourceType,
      game_system_id: gameSystemId || null,
      source_category: sourceCategory as LibrarySourceCategory,
      source_subtype: sourceSubtype as LibrarySourceSubtype,
      clone_policy: clonePolicy as LibrarySourceClonePolicy,
      default_player_visibility:
        defaultPlayerVisibility as LibrarySourcePlayerVisibility,
      source_url: sourceUrl,
      source_notes: sourceNotes,
      version,
    } satisfies ValidSettingsLibraryInput,
  };
}

function isLowercaseHyphenSlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function isSettingsLibraryVisibility(
  value: string,
): value is SettingsLibraryVisibility {
  return SETTINGS_LIBRARY_VISIBILITIES.includes(
    value as SettingsLibraryVisibility,
  );
}

function isSettingsLibrarySourceType(
  value: string,
): value is SettingsLibrarySourceType {
  return SETTINGS_LIBRARY_SOURCE_TYPES.includes(value as SettingsLibrarySourceType);
}

function isValidishUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
