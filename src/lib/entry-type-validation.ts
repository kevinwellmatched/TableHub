import type { EntryTypeFormFieldErrors } from "@/lib/entry-type-form-state";

export const ENTRY_TYPE_NAME_MAX_LENGTH = 80;
export const ENTRY_TYPE_DESCRIPTION_MAX_LENGTH = 1000;
export const ENTRY_TYPE_SORT_ORDER_MIN = 0;
export const ENTRY_TYPE_SORT_ORDER_MAX = 10000;

export const ENTRY_TYPE_LIBRARY_KINDS = [
  "compendium",
  "settings_library",
] as const;
export const ENTRY_TYPE_VISIBILITIES = ["private", "shared", "public"] as const;

export type EntryTypeLibraryKind = (typeof ENTRY_TYPE_LIBRARY_KINDS)[number];
export type EntryTypeVisibility = (typeof ENTRY_TYPE_VISIBILITIES)[number];

export type EntryTypeInput = {
  name: string;
  description: string;
  libraryKind: string;
  visibility: string;
  sortOrder: string;
};

export type ValidEntryTypeInput = {
  name: string;
  slug: string;
  description: string;
  library_kind: EntryTypeLibraryKind;
  visibility: EntryTypeVisibility;
  sort_order: number;
};

export function createEntryTypeSlugFromName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function validateEntryTypeInput(input: EntryTypeInput) {
  const fieldErrors: EntryTypeFormFieldErrors = {};
  const name = input.name.trim();
  const description = input.description.trim();
  const libraryKind = input.libraryKind.trim();
  const visibility = input.visibility.trim();
  const sortOrderText = input.sortOrder.trim();
  const sortOrder = sortOrderText === "" ? 0 : Number(sortOrderText);
  const slug = createEntryTypeSlugFromName(name);

  if (!name) {
    fieldErrors.name = "Entry Type name is required.";
  } else if (name.length > ENTRY_TYPE_NAME_MAX_LENGTH) {
    fieldErrors.name = `Entry Type name must be ${ENTRY_TYPE_NAME_MAX_LENGTH} characters or fewer.`;
  }

  if (name && !isLowercaseHyphenSlug(slug)) {
    fieldErrors.name = "Entry Type name must create a lowercase hyphen slug.";
  }

  if (description.length > ENTRY_TYPE_DESCRIPTION_MAX_LENGTH) {
    fieldErrors.description = `Description must be ${ENTRY_TYPE_DESCRIPTION_MAX_LENGTH} characters or fewer.`;
  }

  if (!isEntryTypeLibraryKind(libraryKind)) {
    fieldErrors.libraryKind = "Choose Compendium or Settings Library.";
  }

  if (!isEntryTypeVisibility(visibility)) {
    fieldErrors.visibility = "Choose private, shared, or public.";
  }

  if (
    !Number.isInteger(sortOrder) ||
    sortOrder < ENTRY_TYPE_SORT_ORDER_MIN ||
    sortOrder > ENTRY_TYPE_SORT_ORDER_MAX
  ) {
    fieldErrors.sortOrder = "Sort order must be a whole number from 0 to 10000.";
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
      library_kind: libraryKind as EntryTypeLibraryKind,
      visibility: visibility as EntryTypeVisibility,
      sort_order: sortOrder,
    } satisfies ValidEntryTypeInput,
  };
}

function isLowercaseHyphenSlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function isEntryTypeLibraryKind(
  value: string,
): value is EntryTypeLibraryKind {
  return ENTRY_TYPE_LIBRARY_KINDS.includes(value as EntryTypeLibraryKind);
}

function isEntryTypeVisibility(value: string): value is EntryTypeVisibility {
  return ENTRY_TYPE_VISIBILITIES.includes(value as EntryTypeVisibility);
}
