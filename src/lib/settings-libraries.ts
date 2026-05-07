import "server-only";

import type {
  SettingsLibrarySourceType,
  SettingsLibraryVisibility,
  ValidSettingsLibraryInput,
} from "@/lib/settings-library-validation";
import type {
  LibrarySourceCategory,
  LibrarySourceClonePolicy,
  LibrarySourcePlayerVisibility,
  LibrarySourceSubtype,
} from "@/lib/library-source-taxonomy";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

const SETTINGS_LIBRARY_COLUMNS =
  "id, owner_id, game_system_id, name, slug, description, visibility, genre, tone, source_type, source_category, source_subtype, clone_policy, default_player_visibility, source_url, source_notes, version, created_at, updated_at";

const GAME_SYSTEM_FORM_COLUMNS =
  "id, name, edition, publisher, visibility, created_at";

export type SettingsLibraryRow = {
  id: string;
  owner_id: string;
  game_system_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  visibility: SettingsLibraryVisibility;
  genre: string | null;
  tone: string | null;
  source_type: SettingsLibrarySourceType;
  source_category: LibrarySourceCategory;
  source_subtype: LibrarySourceSubtype;
  clone_policy: LibrarySourceClonePolicy;
  default_player_visibility: LibrarySourcePlayerVisibility;
  source_url: string | null;
  source_notes: string | null;
  version: string;
  created_at: string;
  updated_at: string;
};

export type SettingsLibraryGameSystemSummary = {
  id: string;
  name: string;
  edition: string | null;
  publisher: string | null;
  visibility: string;
};

export type SettingsLibraryListItem = SettingsLibraryRow & {
  gameSystem: SettingsLibraryGameSystemSummary | null;
};
export type SettingsLibraryDetail = SettingsLibraryListItem;

export type GameSystemForSettingsLibraryForm =
  SettingsLibraryGameSystemSummary & {
    created_at: string;
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

export async function getSettingsLibraries(): Promise<SettingsLibraryListItem[]> {
  if (!hasSupabaseEnv()) {
    redirect("/login");
  }

  const supabase = await createClient();
  await getSignedInUserId(supabase);

  const { data, error } = await supabase
    .from("settings_libraries")
    .select(SETTINGS_LIBRARY_COLUMNS)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return addGameSystemSummaries(supabase, (data ?? []) as SettingsLibraryRow[]);
}

export async function getSettingsLibraryById(
  settingsLibraryId: string,
): Promise<SettingsLibraryDetail | null> {
  if (!hasSupabaseEnv()) {
    redirect("/login");
  }

  const supabase = await createClient();
  await getSignedInUserId(supabase);

  const { data, error } = await supabase
    .from("settings_libraries")
    .select(SETTINGS_LIBRARY_COLUMNS)
    .eq("id", settingsLibraryId)
    .maybeSingle<SettingsLibraryRow>();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  const [settingsLibrary] = await addGameSystemSummaries(supabase, [data]);
  return settingsLibrary;
}

export async function createSettingsLibrary(input: ValidSettingsLibraryInput) {
  if (!hasSupabaseEnv()) {
    redirect("/login");
  }

  const supabase = await createClient();
  const userId = await getSignedInUserId(supabase);

  const { data, error } = await supabase
    .from("settings_libraries")
    .insert({
      ...input,
      description: input.description || null,
      genre: input.genre || null,
      tone: input.tone || null,
      source_url: input.source_url || null,
      source_notes: input.source_notes || null,
      owner_id: userId,
    })
    .select(SETTINGS_LIBRARY_COLUMNS)
    .single<{ id: string }>();

  return { data, error };
}

export async function getGameSystemsForSettingsLibraryForm(): Promise<
  GameSystemForSettingsLibraryForm[]
> {
  if (!hasSupabaseEnv()) {
    redirect("/login");
  }

  const supabase = await createClient();
  await getSignedInUserId(supabase);

  const { data, error } = await supabase
    .from("game_systems")
    .select(GAME_SYSTEM_FORM_COLUMNS)
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as GameSystemForSettingsLibraryForm[];
}

export function formatSettingsLibraryVisibility(
  visibility: SettingsLibraryVisibility,
) {
  if (visibility === "shared") {
    return "Shared later";
  }

  return visibility.charAt(0).toUpperCase() + visibility.slice(1);
}

export function formatSettingsLibrarySourceType(
  sourceType: SettingsLibrarySourceType,
) {
  const labels: Record<SettingsLibrarySourceType, string> = {
    manual: "Manual",
    owned_notes: "Owned Notes",
    markdown_import: "Markdown Import",
    pdf_import: "PDF Import",
    csv_import: "CSV Import",
    campaign_export: "Campaign Export",
    external_reference: "External Reference",
    other: "Other",
  };

  return labels[sourceType];
}

async function addGameSystemSummaries(
  supabase: SupabaseClient,
  settingsLibraries: SettingsLibraryRow[],
): Promise<SettingsLibraryListItem[]> {
  const gameSystemIds = Array.from(
    new Set(
      settingsLibraries.flatMap((settingsLibrary) =>
        settingsLibrary.game_system_id ? [settingsLibrary.game_system_id] : [],
      ),
    ),
  );

  if (gameSystemIds.length === 0) {
    return settingsLibraries.map((settingsLibrary) => ({
      ...settingsLibrary,
      gameSystem: null,
    }));
  }

  const { data, error } = await supabase
    .from("game_systems")
    .select("id, name, edition, publisher, visibility")
    .in("id", gameSystemIds);

  if (error) {
    throw error;
  }

  const gameSystemById = new Map(
    ((data ?? []) as SettingsLibraryGameSystemSummary[]).map((system) => [
      system.id,
      system,
    ]),
  );

  return settingsLibraries.map((settingsLibrary) => ({
    ...settingsLibrary,
    gameSystem: settingsLibrary.game_system_id
      ? gameSystemById.get(settingsLibrary.game_system_id) ?? null
      : null,
  }));
}

export { SETTINGS_LIBRARY_COLUMNS };
