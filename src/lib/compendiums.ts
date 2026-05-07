import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import type {
  CompendiumSourceType,
  CompendiumVisibility,
  ValidCompendiumInput,
} from "@/lib/compendium-validation";
import type {
  LibrarySourceCategory,
  LibrarySourceClonePolicy,
  LibrarySourcePlayerVisibility,
  LibrarySourceSubtype,
} from "@/lib/library-source-taxonomy";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

const COMPENDIUM_COLUMNS =
  "id, owner_id, game_system_id, name, slug, description, visibility, license_name, license_url, source_type, source_category, source_subtype, clone_policy, default_player_visibility, source_url, source_notes, version, created_at, updated_at";

const GAME_SYSTEM_FORM_COLUMNS =
  "id, name, edition, publisher, visibility, created_at";

export type CompendiumRow = {
  id: string;
  owner_id: string;
  game_system_id: string;
  name: string;
  slug: string;
  description: string | null;
  visibility: CompendiumVisibility;
  license_name: string | null;
  license_url: string | null;
  source_type: CompendiumSourceType;
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

export type CompendiumGameSystemSummary = {
  id: string;
  name: string;
  edition: string | null;
  publisher: string | null;
  visibility: string;
};

export type CompendiumListItem = CompendiumRow & {
  gameSystem: CompendiumGameSystemSummary | null;
};

export type CompendiumDetail = CompendiumListItem;

export type GameSystemForCompendiumForm = CompendiumGameSystemSummary & {
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

export async function getCompendiums(): Promise<CompendiumListItem[]> {
  if (!hasSupabaseEnv()) {
    redirect("/login");
  }

  const supabase = await createClient();
  await getSignedInUserId(supabase);

  const { data, error } = await supabase
    .from("compendiums")
    .select(COMPENDIUM_COLUMNS)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return addGameSystemSummaries(supabase, (data ?? []) as CompendiumRow[]);
}

export async function getCompendiumById(
  compendiumId: string,
): Promise<CompendiumDetail | null> {
  if (!hasSupabaseEnv()) {
    redirect("/login");
  }

  const supabase = await createClient();
  await getSignedInUserId(supabase);

  const { data, error } = await supabase
    .from("compendiums")
    .select(COMPENDIUM_COLUMNS)
    .eq("id", compendiumId)
    .maybeSingle<CompendiumRow>();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  const [compendium] = await addGameSystemSummaries(supabase, [data]);
  return compendium;
}

export async function createCompendium(input: ValidCompendiumInput) {
  if (!hasSupabaseEnv()) {
    redirect("/login");
  }

  const supabase = await createClient();
  const userId = await getSignedInUserId(supabase);

  const { data, error } = await supabase
    .from("compendiums")
    .insert({
      ...input,
      description: input.description || null,
      license_name: input.license_name || null,
      license_url: input.license_url || null,
      source_url: input.source_url || null,
      source_notes: input.source_notes || null,
      owner_id: userId,
    })
    .select(COMPENDIUM_COLUMNS)
    .single<{ id: string }>();

  return { data, error };
}

export async function getGameSystemsForCompendiumForm(): Promise<
  GameSystemForCompendiumForm[]
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

  return (data ?? []) as GameSystemForCompendiumForm[];
}

export function formatCompendiumVisibility(visibility: CompendiumVisibility) {
  if (visibility === "shared") {
    return "Shared later";
  }

  return visibility.charAt(0).toUpperCase() + visibility.slice(1);
}

export function formatCompendiumSourceType(sourceType: CompendiumSourceType) {
  const labels: Record<CompendiumSourceType, string> = {
    manual: "Manual",
    srd: "SRD",
    owned_book: "Owned Book",
    markdown_import: "Markdown Import",
    pdf_import: "PDF Import",
    csv_import: "CSV Import",
    external_reference: "External Reference",
    other: "Other",
  };

  return labels[sourceType];
}

async function addGameSystemSummaries(
  supabase: SupabaseClient,
  compendiums: CompendiumRow[],
): Promise<CompendiumListItem[]> {
  const gameSystemIds = Array.from(
    new Set(compendiums.map((compendium) => compendium.game_system_id)),
  );

  if (gameSystemIds.length === 0) {
    return compendiums.map((compendium) => ({ ...compendium, gameSystem: null }));
  }

  const { data, error } = await supabase
    .from("game_systems")
    .select("id, name, edition, publisher, visibility")
    .in("id", gameSystemIds);

  if (error) {
    throw error;
  }

  const gameSystemById = new Map(
    ((data ?? []) as CompendiumGameSystemSummary[]).map((system) => [
      system.id,
      system,
    ]),
  );

  return compendiums.map((compendium) => ({
    ...compendium,
    gameSystem: gameSystemById.get(compendium.game_system_id) ?? null,
  }));
}

export { COMPENDIUM_COLUMNS };
