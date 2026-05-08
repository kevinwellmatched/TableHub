import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import {
  getProjectEntryOverrideStatus,
  resolveProjectEntry,
  type EffectiveProjectEntry,
  type ProjectEntryOverrideRow,
  type ProjectEntryOriginal,
  type ValidProjectEntryOverrideInput,
} from "@/lib/project-entry-overrides";
import type { ProjectSourceType } from "@/lib/project-source-validation";
import { PROJECT_SOURCE_COLUMNS, type ProjectSourceRow } from "@/lib/project-sources";
import type { MasterEntryRow } from "@/lib/master-entries";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

const MASTER_ENTRY_COLUMNS =
  "id, owner_id, library_kind, compendium_id, settings_library_id, entry_type_id, title, slug, aliases, summary, body, body_format, properties, visibility, sort_order, license_name, license_url, source_type, source_url, source_notes, version, created_at, updated_at";

const PROJECT_ENTRY_OVERRIDE_COLUMNS =
  "id, project_id, master_entry_id, override_title, override_summary, override_body, override_properties, override_visibility, override_reason, created_by, created_at, updated_at";

export type ProjectLibrarySourceContext = {
  projectSourceId: string;
  sourceType: Extract<ProjectSourceType, "compendium" | "settings_library">;
  sourceId: string;
  sourceName: string;
};

export type ProjectLibraryEntryListItem = MasterEntryRow & {
  source: ProjectLibrarySourceContext;
  override: ProjectEntryOverrideRow | null;
  effective: EffectiveProjectEntry;
  overrideStatus: ReturnType<typeof getProjectEntryOverrideStatus>;
};

export type ProjectLibraryEntryDetail = ProjectLibraryEntryListItem;

async function getSignedInUserId(supabase: SupabaseClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return user.id;
}

export async function getProjectLibraryEntries(
  projectId: string,
): Promise<{
  sources: ProjectLibrarySourceContext[];
  entries: ProjectLibraryEntryListItem[];
}> {
  if (!hasSupabaseEnv()) {
    redirect("/login");
  }

  const supabase = await createClient();
  await getSignedInUserId(supabase);

  const sourceRows = await loadProjectSourceRows(supabase, projectId);
  const sourceContexts = getEntrySourceContexts(sourceRows);

  if (sourceContexts.length === 0) {
    return {
      sources: [],
      entries: [],
    };
  }

  const [compendiumEntries, settingsLibraryEntries] = await Promise.all([
    loadCompendiumEntries(supabase, sourceContexts),
    loadSettingsLibraryEntries(supabase, sourceContexts),
  ]);
  const entries = [...compendiumEntries, ...settingsLibraryEntries];
  const overrides = await loadOverridesForEntries(
    supabase,
    projectId,
    entries.map((entry) => entry.id),
  );
  const overrideByMasterEntryId = new Map(
    overrides.map((override) => [override.master_entry_id, override]),
  );

  return {
    sources: sourceContexts,
    entries: sortProjectLibraryEntries(
      entries.flatMap((entry) => {
        const source = findSourceContextForEntry(entry, sourceContexts);

        if (!source) {
          return [];
        }

        return [
          buildProjectLibraryEntry(
            entry,
            source,
            overrideByMasterEntryId.get(entry.id) ?? null,
          ),
        ];
      }),
    ),
  };
}

export async function getProjectLibraryEntry(
  projectId: string,
  masterEntryId: string,
): Promise<ProjectLibraryEntryDetail | null> {
  if (!hasSupabaseEnv()) {
    redirect("/login");
  }

  const supabase = await createClient();
  await getSignedInUserId(supabase);

  const [sourceRows, masterEntry] = await Promise.all([
    loadProjectSourceRows(supabase, projectId),
    loadMasterEntryById(supabase, masterEntryId),
  ]);

  if (!masterEntry) {
    return null;
  }

  const sourceContext = findSourceContextForEntry(
    masterEntry,
    getEntrySourceContexts(sourceRows),
  );

  if (!sourceContext) {
    return null;
  }

  const override = await loadOverrideForEntry(supabase, projectId, masterEntryId);

  return buildProjectLibraryEntry(masterEntry, sourceContext, override);
}

export async function upsertProjectEntryOverride(
  input: ValidProjectEntryOverrideInput,
) {
  if (!hasSupabaseEnv()) {
    redirect("/login");
  }

  const supabase = await createClient();
  const userId = await getSignedInUserId(supabase);

  return supabase
    .from("project_entry_overrides")
    .upsert(
      {
        ...input,
        created_by: userId,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "project_id,master_entry_id",
      },
    )
    .select(PROJECT_ENTRY_OVERRIDE_COLUMNS)
    .single<ProjectEntryOverrideRow>();
}

export async function deleteProjectEntryOverride(
  projectId: string,
  masterEntryId: string,
) {
  if (!hasSupabaseEnv()) {
    redirect("/login");
  }

  const supabase = await createClient();
  await getSignedInUserId(supabase);

  return supabase
    .from("project_entry_overrides")
    .delete()
    .eq("project_id", projectId)
    .eq("master_entry_id", masterEntryId)
    .select("id");
}

async function loadProjectSourceRows(
  supabase: SupabaseClient,
  projectId: string,
) {
  const { data, error } = await supabase
    .from("project_sources")
    .select(PROJECT_SOURCE_COLUMNS)
    .eq("project_id", projectId);

  if (error) {
    throw error;
  }

  return (data ?? []) as ProjectSourceRow[];
}

function getEntrySourceContexts(
  sources: ProjectSourceRow[],
): ProjectLibrarySourceContext[] {
  return sources.flatMap((source) => {
    if (source.source_type === "compendium" && source.compendium_id) {
      return {
        projectSourceId: source.id,
        sourceType: source.source_type,
        sourceId: source.compendium_id,
        sourceName: source.source_name,
      };
    }

    if (
      source.source_type === "settings_library" &&
      source.settings_library_id
    ) {
      return {
        projectSourceId: source.id,
        sourceType: source.source_type,
        sourceId: source.settings_library_id,
        sourceName: source.source_name,
      };
    }

    return [];
  });
}

async function loadCompendiumEntries(
  supabase: SupabaseClient,
  sources: ProjectLibrarySourceContext[],
) {
  const compendiumIds = getSourceIds(sources, "compendium");

  if (compendiumIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("master_entries")
    .select(MASTER_ENTRY_COLUMNS)
    .eq("library_kind", "compendium")
    .in("compendium_id", compendiumIds)
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as MasterEntryRow[];
}

async function loadSettingsLibraryEntries(
  supabase: SupabaseClient,
  sources: ProjectLibrarySourceContext[],
) {
  const settingsLibraryIds = getSourceIds(sources, "settings_library");

  if (settingsLibraryIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("master_entries")
    .select(MASTER_ENTRY_COLUMNS)
    .eq("library_kind", "settings_library")
    .in("settings_library_id", settingsLibraryIds)
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as MasterEntryRow[];
}

async function loadMasterEntryById(
  supabase: SupabaseClient,
  masterEntryId: string,
) {
  const { data, error } = await supabase
    .from("master_entries")
    .select(MASTER_ENTRY_COLUMNS)
    .eq("id", masterEntryId)
    .maybeSingle<MasterEntryRow>();

  if (error) {
    throw error;
  }

  return data;
}

async function loadOverridesForEntries(
  supabase: SupabaseClient,
  projectId: string,
  masterEntryIds: string[],
) {
  if (masterEntryIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("project_entry_overrides")
    .select(PROJECT_ENTRY_OVERRIDE_COLUMNS)
    .eq("project_id", projectId)
    .in("master_entry_id", masterEntryIds);

  if (error) {
    throw error;
  }

  return (data ?? []) as ProjectEntryOverrideRow[];
}

async function loadOverrideForEntry(
  supabase: SupabaseClient,
  projectId: string,
  masterEntryId: string,
) {
  const { data, error } = await supabase
    .from("project_entry_overrides")
    .select(PROJECT_ENTRY_OVERRIDE_COLUMNS)
    .eq("project_id", projectId)
    .eq("master_entry_id", masterEntryId)
    .maybeSingle<ProjectEntryOverrideRow>();

  if (error) {
    throw error;
  }

  return data;
}

function getSourceIds(
  sources: ProjectLibrarySourceContext[],
  sourceType: ProjectLibrarySourceContext["sourceType"],
) {
  return sources
    .filter((source) => source.sourceType === sourceType)
    .map((source) => source.sourceId);
}

function findSourceContextForEntry(
  entry: MasterEntryRow,
  sources: ProjectLibrarySourceContext[],
) {
  if (entry.library_kind === "compendium" && entry.compendium_id) {
    return sources.find(
      (source) =>
        source.sourceType === "compendium" &&
        source.sourceId === entry.compendium_id,
    );
  }

  if (entry.library_kind === "settings_library" && entry.settings_library_id) {
    return sources.find(
      (source) =>
        source.sourceType === "settings_library" &&
        source.sourceId === entry.settings_library_id,
    );
  }

  return null;
}

function buildProjectLibraryEntry(
  entry: MasterEntryRow,
  source: ProjectLibrarySourceContext,
  override: ProjectEntryOverrideRow | null,
): ProjectLibraryEntryListItem {
  const original = toProjectEntryOriginal(entry);

  return {
    ...entry,
    source,
    override,
    effective: resolveProjectEntry(original, override),
    overrideStatus: getProjectEntryOverrideStatus(original, override),
  };
}

function toProjectEntryOriginal(entry: MasterEntryRow): ProjectEntryOriginal {
  return {
    id: entry.id,
    title: entry.title,
    summary: entry.summary,
    body: entry.body,
    properties: entry.properties,
    visibility: entry.visibility,
  };
}

function sortProjectLibraryEntries(entries: ProjectLibraryEntryListItem[]) {
  return [...entries].sort((first, second) => {
    const sourceCompare = first.source.sourceName.localeCompare(
      second.source.sourceName,
    );

    if (sourceCompare !== 0) {
      return sourceCompare;
    }

    if (first.sort_order !== second.sort_order) {
      return first.sort_order - second.sort_order;
    }

    return first.effective.title.localeCompare(second.effective.title);
  });
}
