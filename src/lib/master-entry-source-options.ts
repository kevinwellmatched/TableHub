import {
  formatLibrarySourceCategory,
  type LibrarySourceCategory,
} from "./library-source-taxonomy.ts";
import type { MasterEntryLibraryKind } from "./master-entry-validation.ts";

export const MASTER_ENTRY_SOURCE_CONTAINER_LABELS = {
  compendium: "Rules / reference source",
  settings_library: "Setting / lore source",
} satisfies Record<MasterEntryLibraryKind, string>;

export const MASTER_ENTRY_SOURCE_CONTAINER_DESCRIPTIONS = {
  compendium:
    "Rules/reference entries are stored under a Compendium source container.",
  settings_library:
    "Setting/lore entries are stored under a Settings Library source container.",
} satisfies Record<MasterEntryLibraryKind, string>;

type SourceOptionInput = {
  name: string;
  source_category?: LibrarySourceCategory | string | null;
};

export function formatMasterEntrySourceContainerType(
  libraryKind: MasterEntryLibraryKind,
) {
  return MASTER_ENTRY_SOURCE_CONTAINER_LABELS[libraryKind];
}

export function getMasterEntrySourceContainerDescription(
  libraryKind: MasterEntryLibraryKind,
) {
  return MASTER_ENTRY_SOURCE_CONTAINER_DESCRIPTIONS[libraryKind];
}

export function formatMasterEntryParentSourceOption(source: SourceOptionInput) {
  if (!source.source_category) {
    return source.name;
  }

  return `${source.name} - ${formatLibrarySourceCategory(source.source_category)}`;
}
