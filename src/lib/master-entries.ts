import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import type {
  MasterEntryBodyFormat,
  MasterEntryLibraryKind,
  MasterEntryProperties,
  MasterEntrySourceType,
  MasterEntryVisibility,
  ValidMasterEntryInput,
} from "@/lib/master-entry-validation";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

const MASTER_ENTRY_COLUMNS =
  "id, owner_id, library_kind, compendium_id, settings_library_id, entry_type_id, title, slug, aliases, summary, body, body_format, properties, visibility, sort_order, license_name, license_url, source_type, source_url, source_notes, version, created_at, updated_at";

const COMPENDIUM_FORM_COLUMNS =
  "id, name, slug, visibility, version, created_at";
const SETTINGS_LIBRARY_FORM_COLUMNS =
  "id, name, slug, visibility, version, created_at";
const ENTRY_TYPE_FORM_COLUMNS =
  "id, library_kind, name, slug, visibility, sort_order";

export type MasterEntryRow = {
  id: string;
  owner_id: string;
  library_kind: MasterEntryLibraryKind;
  compendium_id: string | null;
  settings_library_id: string | null;
  entry_type_id: string;
  title: string;
  slug: string;
  aliases: string[] | null;
  summary: string | null;
  body: string | null;
  body_format: MasterEntryBodyFormat;
  properties: MasterEntryProperties | null;
  visibility: MasterEntryVisibility;
  sort_order: number;
  license_name: string | null;
  license_url: string | null;
  source_type: MasterEntrySourceType;
  source_url: string | null;
  source_notes: string | null;
  version: string;
  created_at: string;
  updated_at: string;
};

export type MasterEntryCompendiumSummary = {
  id: string;
  name: string;
  slug: string;
  visibility: string;
  version: string;
  created_at: string;
};

export type MasterEntrySettingsLibrarySummary = {
  id: string;
  name: string;
  slug: string;
  visibility: string;
  version: string;
  created_at: string;
};

export type MasterEntryTypeSummary = {
  id: string;
  library_kind: MasterEntryLibraryKind;
  name: string;
  slug: string;
  visibility: string;
  sort_order: number;
};

export type MasterEntryListItem = MasterEntryRow & {
  compendium: MasterEntryCompendiumSummary | null;
  settingsLibrary: MasterEntrySettingsLibrarySummary | null;
  entryType: MasterEntryTypeSummary | null;
};

export type MasterEntryDetail = MasterEntryListItem;

export type MasterEntryFormOptions = {
  compendiums: MasterEntryCompendiumSummary[];
  settingsLibraries: MasterEntrySettingsLibrarySummary[];
  entryTypes: MasterEntryTypeSummary[];
};

async function getSignedInUserId(supabase: SupabaseClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return user.id;
}

export async function getMasterEntries(): Promise<MasterEntryListItem[]> {
  if (!hasSupabaseEnv()) {
    redirect("/login");
  }

  const supabase = await createClient();
  await getSignedInUserId(supabase);

  const { data, error } = await supabase
    .from("master_entries")
    .select(MASTER_ENTRY_COLUMNS)
    .order("library_kind", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    throw error;
  }

  return sortMasterEntries(
    await addMasterEntrySummaries(supabase, (data ?? []) as MasterEntryRow[]),
  );
}

export async function getMasterEntriesByCompendiumId(
  compendiumId: string,
): Promise<MasterEntryListItem[]> {
  if (!hasSupabaseEnv()) {
    redirect("/login");
  }

  const supabase = await createClient();
  await getSignedInUserId(supabase);

  const { data, error } = await supabase
    .from("master_entries")
    .select(MASTER_ENTRY_COLUMNS)
    .eq("library_kind", "compendium")
    .eq("compendium_id", compendiumId)
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    throw error;
  }

  return sortMasterEntries(
    await addMasterEntrySummaries(supabase, (data ?? []) as MasterEntryRow[]),
  );
}

export async function getMasterEntriesBySettingsLibraryId(
  settingsLibraryId: string,
): Promise<MasterEntryListItem[]> {
  if (!hasSupabaseEnv()) {
    redirect("/login");
  }

  const supabase = await createClient();
  await getSignedInUserId(supabase);

  const { data, error } = await supabase
    .from("master_entries")
    .select(MASTER_ENTRY_COLUMNS)
    .eq("library_kind", "settings_library")
    .eq("settings_library_id", settingsLibraryId)
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    throw error;
  }

  return sortMasterEntries(
    await addMasterEntrySummaries(supabase, (data ?? []) as MasterEntryRow[]),
  );
}

export async function getMasterEntryById(
  masterEntryId: string,
): Promise<MasterEntryDetail | null> {
  if (!hasSupabaseEnv()) {
    redirect("/login");
  }

  const supabase = await createClient();
  await getSignedInUserId(supabase);

  const { data, error } = await supabase
    .from("master_entries")
    .select(MASTER_ENTRY_COLUMNS)
    .eq("id", masterEntryId)
    .maybeSingle<MasterEntryRow>();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  const [entry] = await addMasterEntrySummaries(supabase, [data]);
  return entry;
}

export async function createMasterEntry(input: ValidMasterEntryInput) {
  if (!hasSupabaseEnv()) {
    redirect("/login");
  }

  const supabase = await createClient();
  const userId = await getSignedInUserId(supabase);

  const { data, error } = await supabase
    .from("master_entries")
    .insert({
      ...input,
      summary: input.summary || null,
      body: input.body || null,
      license_name: input.license_name || null,
      license_url: input.license_url || null,
      source_url: input.source_url || null,
      source_notes: input.source_notes || null,
      owner_id: userId,
    })
    .select(MASTER_ENTRY_COLUMNS)
    .single<{ id: string }>();

  return { data, error };
}

export async function getMasterEntryFormOptions(): Promise<MasterEntryFormOptions> {
  if (!hasSupabaseEnv()) {
    redirect("/login");
  }

  const supabase = await createClient();
  await getSignedInUserId(supabase);

  const [compendiums, settingsLibraries, entryTypes] = await Promise.all([
    loadCompendiumOptions(supabase),
    loadSettingsLibraryOptions(supabase),
    loadEntryTypeOptions(supabase),
  ]);

  return {
    compendiums,
    settingsLibraries,
    entryTypes,
  };
}

export function formatMasterEntryLibraryKind(
  libraryKind: MasterEntryLibraryKind,
) {
  const labels: Record<MasterEntryLibraryKind, string> = {
    compendium: "Compendium",
    settings_library: "Settings Library",
  };

  return labels[libraryKind];
}

export function formatMasterEntryBodyFormat(bodyFormat: MasterEntryBodyFormat) {
  const labels: Record<MasterEntryBodyFormat, string> = {
    plain_text: "Plain text",
    markdown: "Markdown",
  };

  return labels[bodyFormat];
}

export function formatMasterEntryVisibility(visibility: MasterEntryVisibility) {
  if (visibility === "shared") {
    return "Shared later";
  }

  return visibility.charAt(0).toUpperCase() + visibility.slice(1);
}

export function formatMasterEntrySourceType(sourceType: MasterEntrySourceType) {
  const labels: Record<MasterEntrySourceType, string> = {
    manual: "Manual",
    srd: "SRD",
    owned_book: "Owned Book",
    owned_notes: "Owned Notes",
    markdown_import: "Markdown Import",
    pdf_import: "PDF Import",
    csv_import: "CSV Import",
    external_reference: "External Reference",
    other: "Other",
  };

  return labels[sourceType];
}

export function getMasterEntryParentName(entry: MasterEntryListItem) {
  if (entry.library_kind === "compendium") {
    return entry.compendium?.name || "Compendium unavailable";
  }

  return entry.settingsLibrary?.name || "Settings Library unavailable";
}

async function loadCompendiumOptions(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("compendiums")
    .select(COMPENDIUM_FORM_COLUMNS)
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as MasterEntryCompendiumSummary[];
}

async function loadSettingsLibraryOptions(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("settings_libraries")
    .select(SETTINGS_LIBRARY_FORM_COLUMNS)
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as MasterEntrySettingsLibrarySummary[];
}

async function loadEntryTypeOptions(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("entry_types")
    .select(ENTRY_TYPE_FORM_COLUMNS)
    .order("library_kind", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as MasterEntryTypeSummary[];
}

async function addMasterEntrySummaries(
  supabase: SupabaseClient,
  entries: MasterEntryRow[],
): Promise<MasterEntryListItem[]> {
  const compendiumIds = Array.from(
    new Set(entries.flatMap((entry) => (entry.compendium_id ? [entry.compendium_id] : []))),
  );
  const settingsLibraryIds = Array.from(
    new Set(
      entries.flatMap((entry) =>
        entry.settings_library_id ? [entry.settings_library_id] : [],
      ),
    ),
  );
  const entryTypeIds = Array.from(new Set(entries.map((entry) => entry.entry_type_id)));

  const [compendiums, settingsLibraries, entryTypes] = await Promise.all([
    compendiumIds.length > 0
      ? loadCompendiumSummariesById(supabase, compendiumIds)
      : Promise.resolve([]),
    settingsLibraryIds.length > 0
      ? loadSettingsLibrarySummariesById(supabase, settingsLibraryIds)
      : Promise.resolve([]),
    entryTypeIds.length > 0
      ? loadEntryTypeSummariesById(supabase, entryTypeIds)
      : Promise.resolve([]),
  ]);

  const compendiumById = new Map(compendiums.map((compendium) => [compendium.id, compendium]));
  const settingsLibraryById = new Map(
    settingsLibraries.map((settingsLibrary) => [
      settingsLibrary.id,
      settingsLibrary,
    ]),
  );
  const entryTypeById = new Map(entryTypes.map((entryType) => [entryType.id, entryType]));

  return entries.map((entry) => ({
    ...entry,
    compendium: entry.compendium_id
      ? compendiumById.get(entry.compendium_id) ?? null
      : null,
    settingsLibrary: entry.settings_library_id
      ? settingsLibraryById.get(entry.settings_library_id) ?? null
      : null,
    entryType: entryTypeById.get(entry.entry_type_id) ?? null,
  }));
}

async function loadCompendiumSummariesById(
  supabase: SupabaseClient,
  ids: string[],
) {
  const { data, error } = await supabase
    .from("compendiums")
    .select(COMPENDIUM_FORM_COLUMNS)
    .in("id", ids);

  if (error) {
    throw error;
  }

  return (data ?? []) as MasterEntryCompendiumSummary[];
}

async function loadSettingsLibrarySummariesById(
  supabase: SupabaseClient,
  ids: string[],
) {
  const { data, error } = await supabase
    .from("settings_libraries")
    .select(SETTINGS_LIBRARY_FORM_COLUMNS)
    .in("id", ids);

  if (error) {
    throw error;
  }

  return (data ?? []) as MasterEntrySettingsLibrarySummary[];
}

async function loadEntryTypeSummariesById(
  supabase: SupabaseClient,
  ids: string[],
) {
  const { data, error } = await supabase
    .from("entry_types")
    .select(ENTRY_TYPE_FORM_COLUMNS)
    .in("id", ids);

  if (error) {
    throw error;
  }

  return (data ?? []) as MasterEntryTypeSummary[];
}

function sortMasterEntries(entries: MasterEntryListItem[]) {
  return [...entries].sort((first, second) => {
    const libraryKindCompare = first.library_kind.localeCompare(second.library_kind);

    if (libraryKindCompare !== 0) {
      return libraryKindCompare;
    }

    const parentCompare = getMasterEntryParentName(first).localeCompare(
      getMasterEntryParentName(second),
    );

    if (parentCompare !== 0) {
      return parentCompare;
    }

    if (first.sort_order !== second.sort_order) {
      return first.sort_order - second.sort_order;
    }

    return first.title.localeCompare(second.title);
  });
}

export { MASTER_ENTRY_COLUMNS };
