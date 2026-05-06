import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import type {
  EntryTypeLibraryKind,
  EntryTypeVisibility,
  ValidEntryTypeInput,
} from "@/lib/entry-type-validation";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

const ENTRY_TYPE_COLUMNS =
  "id, owner_id, library_kind, name, slug, description, visibility, sort_order, created_at, updated_at";

export type EntryTypeRow = {
  id: string;
  owner_id: string;
  library_kind: EntryTypeLibraryKind;
  name: string;
  slug: string;
  description: string | null;
  visibility: EntryTypeVisibility;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type EntryTypeListItem = EntryTypeRow;
export type EntryTypeDetail = EntryTypeRow;

async function getSignedInUserId(supabase: SupabaseClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return user.id;
}

export async function getEntryTypes(): Promise<EntryTypeListItem[]> {
  if (!hasSupabaseEnv()) {
    redirect("/login");
  }

  const supabase = await createClient();
  await getSignedInUserId(supabase);

  const { data, error } = await supabase
    .from("entry_types")
    .select(ENTRY_TYPE_COLUMNS)
    .order("library_kind", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as EntryTypeListItem[];
}

export async function getEntryTypesByLibraryKind(
  libraryKind: EntryTypeLibraryKind,
): Promise<EntryTypeListItem[]> {
  if (!hasSupabaseEnv()) {
    redirect("/login");
  }

  const supabase = await createClient();
  await getSignedInUserId(supabase);

  const { data, error } = await supabase
    .from("entry_types")
    .select(ENTRY_TYPE_COLUMNS)
    .eq("library_kind", libraryKind)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as EntryTypeListItem[];
}

export async function getEntryTypeById(
  entryTypeId: string,
): Promise<EntryTypeDetail | null> {
  if (!hasSupabaseEnv()) {
    redirect("/login");
  }

  const supabase = await createClient();
  await getSignedInUserId(supabase);

  const { data, error } = await supabase
    .from("entry_types")
    .select(ENTRY_TYPE_COLUMNS)
    .eq("id", entryTypeId)
    .maybeSingle<EntryTypeRow>();

  if (error) {
    throw error;
  }

  return data;
}

export async function createEntryType(input: ValidEntryTypeInput) {
  if (!hasSupabaseEnv()) {
    redirect("/login");
  }

  const supabase = await createClient();
  const userId = await getSignedInUserId(supabase);

  const { data, error } = await supabase
    .from("entry_types")
    .insert({
      ...input,
      description: input.description || null,
      owner_id: userId,
    })
    .select(ENTRY_TYPE_COLUMNS)
    .single<{ id: string }>();

  return { data, error };
}

export function formatEntryTypeLibraryKind(libraryKind: EntryTypeLibraryKind) {
  const labels: Record<EntryTypeLibraryKind, string> = {
    compendium: "Compendium",
    settings_library: "Settings Library",
  };

  return labels[libraryKind];
}

export function formatEntryTypeVisibility(visibility: EntryTypeVisibility) {
  if (visibility === "shared") {
    return "Shared later";
  }

  return visibility.charAt(0).toUpperCase() + visibility.slice(1);
}

export { ENTRY_TYPE_COLUMNS };
