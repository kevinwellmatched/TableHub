import "server-only";

import type {
  SettingsLibrarySourceType,
  SettingsLibraryVisibility,
  ValidSettingsLibraryInput,
} from "@/lib/settings-library-validation";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

const SETTINGS_LIBRARY_COLUMNS =
  "id, owner_id, name, slug, description, visibility, genre, tone, source_type, source_url, source_notes, version, created_at, updated_at";

export type SettingsLibraryRow = {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string | null;
  visibility: SettingsLibraryVisibility;
  genre: string | null;
  tone: string | null;
  source_type: SettingsLibrarySourceType;
  source_url: string | null;
  source_notes: string | null;
  version: string;
  created_at: string;
  updated_at: string;
};

export type SettingsLibraryListItem = SettingsLibraryRow;
export type SettingsLibraryDetail = SettingsLibraryRow;

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

  return (data ?? []) as SettingsLibraryListItem[];
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

  return data;
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

export { SETTINGS_LIBRARY_COLUMNS };
