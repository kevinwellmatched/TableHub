import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type {
  GameSystemSourceType,
  GameSystemVisibility,
} from "@/lib/game-system-validation";

const GAME_SYSTEM_COLUMNS =
  "id, name, slug, edition, publisher, description, ruleset_year, visibility, license_name, license_url, source_type, source_url, source_notes, version, created_by, created_at, updated_at";

export type GameSystemRow = {
  id: string;
  name: string;
  slug: string;
  edition: string | null;
  publisher: string | null;
  description: string | null;
  ruleset_year: number | null;
  visibility: GameSystemVisibility;
  license_name: string | null;
  license_url: string | null;
  source_type: GameSystemSourceType;
  source_url: string | null;
  source_notes: string | null;
  version: string;
  created_by: string;
  created_at: string;
  updated_at: string;
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

export async function getGameSystemsForCurrentUser(): Promise<GameSystemRow[]> {
  if (!hasSupabaseEnv()) {
    redirect("/login");
  }

  const supabase = await createClient();
  await getSignedInUserId(supabase);

  const { data, error } = await supabase
    .from("game_systems")
    .select(GAME_SYSTEM_COLUMNS)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as GameSystemRow[];
}

export async function getGameSystemById(
  systemId: string,
): Promise<GameSystemRow | null> {
  if (!hasSupabaseEnv()) {
    redirect("/login");
  }

  const supabase = await createClient();
  await getSignedInUserId(supabase);

  const { data, error } = await supabase
    .from("game_systems")
    .select(GAME_SYSTEM_COLUMNS)
    .eq("id", systemId)
    .maybeSingle<GameSystemRow>();

  if (error) {
    throw error;
  }

  return data;
}

export function formatGameSystemVisibility(visibility: GameSystemVisibility) {
  if (visibility === "shared") {
    return "Shared later";
  }

  return visibility.charAt(0).toUpperCase() + visibility.slice(1);
}

export function formatGameSystemSourceType(sourceType: GameSystemSourceType) {
  const labels: Record<GameSystemSourceType, string> = {
    manual: "Manual",
    srd: "SRD",
    private_markdown: "Private Markdown",
    pdf: "PDF",
    csv: "CSV",
    copy_paste: "Copy/Paste",
    external_reference: "External Reference",
  };

  return labels[sourceType];
}

export { GAME_SYSTEM_COLUMNS };
