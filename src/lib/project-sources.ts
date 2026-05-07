import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import type { ProjectSourceType } from "@/lib/project-source-validation";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

const PROJECT_SOURCE_COLUMNS =
  "id, project_id, source_type, game_system_id, compendium_id, settings_library_id, source_name, source_version, added_by, created_at, updated_at";

const SOURCE_OPTION_COLUMNS = "id, name, version, created_at";

export type ProjectSourceRow = {
  id: string;
  project_id: string;
  source_type: ProjectSourceType;
  game_system_id: string | null;
  compendium_id: string | null;
  settings_library_id: string | null;
  source_name: string;
  source_version: string | null;
  added_by: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectSourceOption = {
  id: string;
  name: string;
  version: string | null;
  created_at: string;
};

export type ProjectSourceOptions = {
  gameSystems: ProjectSourceOption[];
  compendiums: ProjectSourceOption[];
  settingsLibraries: ProjectSourceOption[];
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

export async function getProjectSources(
  projectId: string,
): Promise<ProjectSourceRow[]> {
  if (!hasSupabaseEnv()) {
    redirect("/login");
  }

  const supabase = await createClient();
  await getSignedInUserId(supabase);

  const { data, error } = await supabase
    .from("project_sources")
    .select(PROJECT_SOURCE_COLUMNS)
    .eq("project_id", projectId)
    .order("source_type", { ascending: true })
    .order("source_name", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as ProjectSourceRow[];
}

export async function getProjectSourceOptions(
  projectId: string,
): Promise<ProjectSourceOptions> {
  if (!hasSupabaseEnv()) {
    redirect("/login");
  }

  const supabase = await createClient();
  await getSignedInUserId(supabase);

  const attachedSources = await loadProjectSources(supabase, projectId);
  const attachedIds = getAttachedSourceIds(attachedSources);

  const [gameSystems, compendiums, settingsLibraries] = await Promise.all([
    loadSourceOptions(supabase, "game_systems", attachedIds.gameSystemIds),
    loadSourceOptions(supabase, "compendiums", attachedIds.compendiumIds),
    loadSourceOptions(
      supabase,
      "settings_libraries",
      attachedIds.settingsLibraryIds,
    ),
  ]);

  return {
    gameSystems,
    compendiums,
    settingsLibraries,
  };
}

export async function attachProjectSource(
  projectId: string,
  sourceType: ProjectSourceType,
  sourceId: string,
) {
  if (!hasSupabaseEnv()) {
    redirect("/login");
  }

  const supabase = await createClient();
  await getSignedInUserId(supabase);

  return supabase.rpc("attach_project_source", {
    target_project_id: projectId,
    target_source_type: sourceType,
    target_source_id: sourceId,
  });
}

export async function deleteProjectSource(
  projectId: string,
  projectSourceId: string,
) {
  if (!hasSupabaseEnv()) {
    redirect("/login");
  }

  const supabase = await createClient();
  await getSignedInUserId(supabase);

  return supabase
    .from("project_sources")
    .delete()
    .eq("project_id", projectId)
    .eq("id", projectSourceId)
    .select("id");
}

function getAttachedSourceIds(sources: ProjectSourceRow[]) {
  return {
    gameSystemIds: sources.flatMap((source) =>
      source.game_system_id ? [source.game_system_id] : [],
    ),
    compendiumIds: sources.flatMap((source) =>
      source.compendium_id ? [source.compendium_id] : [],
    ),
    settingsLibraryIds: sources.flatMap((source) =>
      source.settings_library_id ? [source.settings_library_id] : [],
    ),
  };
}

async function loadProjectSources(supabase: SupabaseClient, projectId: string) {
  const { data, error } = await supabase
    .from("project_sources")
    .select(PROJECT_SOURCE_COLUMNS)
    .eq("project_id", projectId);

  if (error) {
    throw error;
  }

  return (data ?? []) as ProjectSourceRow[];
}

async function loadSourceOptions(
  supabase: SupabaseClient,
  tableName: "game_systems" | "compendiums" | "settings_libraries",
  attachedIds: string[],
) {
  let query = supabase
    .from(tableName)
    .select(SOURCE_OPTION_COLUMNS)
    .order("name", { ascending: true });

  if (attachedIds.length > 0) {
    query = query.not("id", "in", `(${attachedIds.join(",")})`);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []) as ProjectSourceOption[];
}

export { PROJECT_SOURCE_COLUMNS };
