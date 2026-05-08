import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import {
  canProjectRoleManageOverrides,
  canProjectRoleReadResolvedVisibility,
  resolveProjectLibraryVisibility,
  getProjectEntryOverrideStatus,
  resolveProjectEntry,
  shapeProjectLibraryEntryForReadMode,
  type EffectiveProjectEntry,
  type ProjectLibraryReadEntry,
  type ProjectLibraryResolvedVisibility,
  type ProjectLibraryRole,
  type ProjectEntryOverrideRow,
  type ProjectEntryOriginal,
  type ValidProjectEntryOverrideInput,
} from "@/lib/project-entry-overrides";
import {
  isLibrarySourcePlayerVisibility,
  type LibrarySourcePlayerVisibility,
} from "@/lib/library-source-taxonomy";
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
  defaultPlayerVisibility: LibrarySourcePlayerVisibility;
};

export type ProjectLibraryEntryListItem = MasterEntryRow & {
  source: ProjectLibrarySourceContext;
  override: ProjectEntryOverrideRow | null;
  effective: EffectiveProjectEntry;
  resolvedVisibility: ProjectLibraryResolvedVisibility;
  overrideStatus: ReturnType<typeof getProjectEntryOverrideStatus>;
};

export type ProjectLibraryEntryDetail = ProjectLibraryEntryListItem;

export type ProjectLibraryReadSourceContext = {
  sourceType: ProjectLibraryReadEntry["sourceType"];
  sourceId: string;
  sourceName: string;
};

export type ProjectLibraryEntriesResult =
  | {
      mode: "management";
      sources: ProjectLibrarySourceContext[];
      entries: ProjectLibraryEntryListItem[];
    }
  | {
      mode: "read";
      sources: ProjectLibraryReadSourceContext[];
      entries: ProjectLibraryReadEntry[];
    };

export type ProjectLibraryEntryResult =
  | {
      mode: "management";
      entry: ProjectLibraryEntryDetail;
    }
  | {
      mode: "read";
      entry: ProjectLibraryReadEntry;
    };

type ProjectLibraryReadRpcRow = {
  master_entry_id: string;
  source_type: ProjectLibraryReadEntry["sourceType"];
  source_id: string;
  source_name: string;
  effective_title: string;
  effective_summary: string | null;
  effective_body: string | null;
  effective_properties: ProjectLibraryReadEntry["properties"];
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

export async function getProjectLibraryEntries(
  projectId: string,
  role: ProjectLibraryRole,
): Promise<ProjectLibraryEntriesResult> {
  if (!hasSupabaseEnv()) {
    redirect("/login");
  }

  const supabase = await createClient();
  await getSignedInUserId(supabase);

  if (!canProjectRoleManageOverrides(role)) {
    return loadReadableProjectLibraryEntries(supabase, projectId);
  }

  const sourceContexts = await loadProjectLibrarySourceContexts(
    supabase,
    projectId,
  );

  if (sourceContexts.length === 0) {
    return {
      mode: "management",
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
    mode: "management",
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
  role: ProjectLibraryRole,
): Promise<ProjectLibraryEntryResult | null> {
  if (!hasSupabaseEnv()) {
    redirect("/login");
  }

  const supabase = await createClient();
  await getSignedInUserId(supabase);

  if (!canProjectRoleManageOverrides(role)) {
    const readEntries = await loadReadableProjectLibraryEntries(
      supabase,
      projectId,
      masterEntryId,
    );

    const [entry] = readEntries.entries;
    return entry ? { mode: "read", entry } : null;
  }

  const [sourceRows, masterEntry] = await Promise.all([
    loadProjectLibrarySourceContexts(supabase, projectId),
    loadMasterEntryById(supabase, masterEntryId),
  ]);

  if (!masterEntry) {
    return null;
  }

  const sourceContext = findSourceContextForEntry(
    masterEntry,
    sourceRows,
  );

  if (!sourceContext) {
    return null;
  }

  const override = await loadOverrideForEntry(supabase, projectId, masterEntryId);

  const entry = buildProjectLibraryEntry(masterEntry, sourceContext, override);

  if (!canProjectRoleReadResolvedVisibility(role, entry.resolvedVisibility)) {
    return null;
  }

  return {
    mode: "management",
    entry,
  };
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

async function loadProjectLibrarySourceContexts(
  supabase: SupabaseClient,
  projectId: string,
) {
  const sourceRows = await loadProjectSourceRows(supabase, projectId);
  const compendiumDefaults = await loadCompendiumDefaultVisibility(
    supabase,
    getProjectSourceIds(sourceRows, "compendium"),
  );
  const settingsLibraryDefaults = await loadSettingsLibraryDefaultVisibility(
    supabase,
    getProjectSourceIds(sourceRows, "settings_library"),
  );

  return getEntrySourceContexts(
    sourceRows,
    compendiumDefaults,
    settingsLibraryDefaults,
  );
}

function getEntrySourceContexts(
  sources: ProjectSourceRow[],
  compendiumDefaults: Map<string, LibrarySourcePlayerVisibility>,
  settingsLibraryDefaults: Map<string, LibrarySourcePlayerVisibility>,
): ProjectLibrarySourceContext[] {
  return sources.flatMap((source) => {
    if (source.source_type === "compendium" && source.compendium_id) {
      return {
        projectSourceId: source.id,
        sourceType: source.source_type,
        sourceId: source.compendium_id,
        sourceName: source.source_name,
        defaultPlayerVisibility:
          compendiumDefaults.get(source.compendium_id) ?? "visible",
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
        defaultPlayerVisibility:
          settingsLibraryDefaults.get(source.settings_library_id) ?? "gm_only",
      };
    }

    return [];
  });
}

async function loadCompendiumDefaultVisibility(
  supabase: SupabaseClient,
  compendiumIds: string[],
) {
  return loadSourceDefaultVisibility(supabase, "compendiums", compendiumIds, "visible");
}

async function loadSettingsLibraryDefaultVisibility(
  supabase: SupabaseClient,
  settingsLibraryIds: string[],
) {
  return loadSourceDefaultVisibility(
    supabase,
    "settings_libraries",
    settingsLibraryIds,
    "gm_only",
  );
}

async function loadSourceDefaultVisibility(
  supabase: SupabaseClient,
  tableName: "compendiums" | "settings_libraries",
  sourceIds: string[],
  fallback: LibrarySourcePlayerVisibility,
) {
  if (sourceIds.length === 0) {
    return new Map<string, LibrarySourcePlayerVisibility>();
  }

  const { data, error } = await supabase
    .from(tableName)
    .select("id, default_player_visibility")
    .in("id", sourceIds);

  if (error) {
    throw error;
  }

  return new Map(
    ((data ?? []) as { id: string; default_player_visibility: string }[]).map(
      (source) => [
        source.id,
        isLibrarySourcePlayerVisibility(source.default_player_visibility)
          ? source.default_player_visibility
          : fallback,
      ],
    ),
  );
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

function getProjectSourceIds(
  sources: ProjectSourceRow[],
  sourceType: ProjectLibrarySourceContext["sourceType"],
) {
  if (sourceType === "compendium") {
    return sources.flatMap((source) =>
      source.source_type === "compendium" && source.compendium_id
        ? [source.compendium_id]
        : [],
    );
  }

  return sources.flatMap((source) =>
    source.source_type === "settings_library" && source.settings_library_id
      ? [source.settings_library_id]
      : [],
  );
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
  const effective = resolveProjectEntry(original, override);

  return {
    ...entry,
    source,
    override,
    effective,
    resolvedVisibility: resolveProjectLibraryVisibility({
      sourceDefaultVisibility: source.defaultPlayerVisibility,
      overrideVisibility: override?.override_visibility ?? null,
    }),
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

async function loadReadableProjectLibraryEntries(
  supabase: SupabaseClient,
  projectId: string,
  masterEntryId: string | null = null,
): Promise<Extract<ProjectLibraryEntriesResult, { mode: "read" }>> {
  const { data, error } = await supabase.rpc("read_project_library_entries", {
    target_project_id: projectId,
    target_master_entry_id: masterEntryId,
  });

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as ProjectLibraryReadRpcRow[];
  const entries = sortReadModeEntries(
    rows.map((row) =>
      shapeProjectLibraryEntryForReadMode({
        masterEntryId: row.master_entry_id,
        sourceName: row.source_name,
        sourceType: row.source_type,
        effective: {
          id: row.master_entry_id,
          title: row.effective_title,
          summary: row.effective_summary,
          body: row.effective_body,
          properties: row.effective_properties ?? {},
          visibility: "visible",
          original: {
            id: row.master_entry_id,
            title: row.effective_title,
            summary: row.effective_summary,
            body: row.effective_body,
            properties: row.effective_properties,
            visibility: "visible",
          },
          override: null,
        },
      }),
    ),
  );

  return {
    mode: "read",
    sources: getReadModeSources(rows),
    entries,
  };
}

function getReadModeSources(
  rows: ProjectLibraryReadRpcRow[],
): ProjectLibraryReadSourceContext[] {
  const sourcesByKey = new Map<string, ProjectLibraryReadSourceContext>();

  for (const row of rows) {
    const key = `${row.source_type}:${row.source_id}`;
    sourcesByKey.set(key, {
      sourceType: row.source_type,
      sourceId: row.source_id,
      sourceName: row.source_name,
    });
  }

  return Array.from(sourcesByKey.values()).sort((first, second) =>
    first.sourceName.localeCompare(second.sourceName),
  );
}

function sortReadModeEntries(entries: ProjectLibraryReadEntry[]) {
  return [...entries].sort((first, second) => {
    const sourceCompare = first.sourceName.localeCompare(second.sourceName);

    if (sourceCompare !== 0) {
      return sourceCompare;
    }

    return first.title.localeCompare(second.title);
  });
}
