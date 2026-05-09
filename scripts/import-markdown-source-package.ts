import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import {
  buildImportSourceNote,
  buildMarkdownImportPlan,
  convertImportedMarkdownToEntryHtml,
  formatMarkdownImportPlan,
  parseMarkdownImportCliArgs,
  type MarkdownSourceFile,
} from "../src/lib/import-markdown-package.ts";
import {
  normalizeImportSlugPart,
  type ImportSourcePackageManifest,
} from "../src/lib/import-source-package.ts";

type ApplySummary = {
  lines: string[];
};

type ExistingRow = {
  id: string;
  name?: string;
  title?: string;
  slug?: string;
  source_notes?: string | null;
};

main().catch((error: unknown) => {
  console.error(`\nImport failed: ${getErrorMessage(error)}`);
  process.exit(1);
});

async function main() {
  loadLocalEnvFile(".env.local");

  const parsedArgs = parseMarkdownImportCliArgs(process.argv.slice(2));

  if (!parsedArgs.ok) {
    console.error(`TableHub Markdown Import\n\n${parsedArgs.error}`);
    process.exit(1);
  }

  const manifestPath = path.resolve(parsedArgs.args.manifestPath);
  const manifestDir = path.dirname(manifestPath);
  const manifest = readManifest(manifestPath);
  const loadedFiles = loadMarkdownFiles(manifest, manifestDir);
  const plan = buildMarkdownImportPlan({
    manifest,
    files: loadedFiles.files,
  });

  plan.issues.push(...loadedFiles.issues);

  console.log(
    formatMarkdownImportPlan(plan, {
      manifestPath: parsedArgs.args.manifestPath,
      mode: parsedArgs.args.mode,
    }),
  );

  if (!plan.ok) {
    process.exit(1);
  }

  if (parsedArgs.args.mode === "dry-run") {
    console.log("\nNo database writes were performed.");
    process.exit(0);
  }

  const ownerId = parsedArgs.args.ownerId;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!ownerId) {
    console.error("\nApply mode requires --owner-id <auth-user-uuid>.");
    process.exit(1);
  }

  if (!supabaseUrl) {
    console.error("\nApply mode requires NEXT_PUBLIC_SUPABASE_URL.");
    process.exit(1);
  }

  if (!serviceRoleKey) {
    console.error("\nApply mode requires SUPABASE_SERVICE_ROLE_KEY.");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const summary = await applyMarkdownImport({
    supabase,
    manifest,
    files: loadedFiles.files,
    ownerId,
  });

  console.log("\nApply Results:");
  for (const line of summary.lines) {
    console.log(`- ${line}`);
  }
}

async function applyMarkdownImport(args: {
  supabase: SupabaseClient;
  manifest: ImportSourcePackageManifest;
  files: MarkdownSourceFile[];
  ownerId: string;
}): Promise<ApplySummary> {
  const lines: string[] = [];
  const gameSystem = await getOrCreateGameSystem(args);
  lines.push(`${gameSystem.action} game system: ${args.manifest.system.name}`);

  const compendium = await getOrCreateCompendium({
    ...args,
    gameSystemId: gameSystem.id,
  });
  lines.push(
    `${compendium.action} compendium: ${args.manifest.sourceContainer.name}`,
  );

  const entryTypeIds = new Map<string, string>();

  for (const [index, entryType] of args.manifest.entryTypes.entries()) {
    const result = await getOrCreateEntryType({
      ...args,
      entryType,
      sortOrder: index,
    });
    entryTypeIds.set(entryType.name, result.id);
    lines.push(`${result.action} entry type: ${entryType.name}`);
  }

  const filesByPath = new Map(
    args.files.map((file) => [normalizeFilePath(file.path), file]),
  );
  const existingEntries = await loadExistingMasterEntries(
    args.supabase,
    args.ownerId,
    compendium.id,
  );

  for (const [index, entry] of args.manifest.entries.entries()) {
    const entryTypeId = entryTypeIds.get(entry.entryType);
    const file = filesByPath.get(normalizeFilePath(entry.file));

    if (!entryTypeId || !file) {
      lines.push(`Skipped master entry: ${entry.title}`);
      continue;
    }

    const result = await upsertMasterEntry({
      ...args,
      compendiumId: compendium.id,
      entryTypeId,
      entry,
      markdown: file.content,
      sortOrder: index,
      existingEntries,
    });

    lines.push(`${result.action} master entry: ${entry.title}`);
  }

  return { lines };
}

async function getOrCreateGameSystem(args: {
  supabase: SupabaseClient;
  manifest: ImportSourcePackageManifest;
  ownerId: string;
}) {
  const slug = normalizeImportSlugPart(args.manifest.system.name);
  const existing = await selectRows(args.supabase, "game_systems", [
    ["created_by", args.ownerId],
    ["slug", slug],
  ], "id, name, slug, source_notes");

  if (existing.length > 1) {
    throw new Error(`Multiple Game Systems match slug ${slug}; stopping.`);
  }

  if (existing.length === 1) {
    return { id: existing[0].id, action: "Reused" };
  }

  const { data, error } = await args.supabase
    .from("game_systems")
    .insert({
      name: args.manifest.system.name,
      slug,
      edition: args.manifest.system.edition ?? null,
      publisher: args.manifest.system.publisher ?? args.manifest.source.publisher ?? null,
      ruleset_year: args.manifest.system.rulesetYear ?? null,
      visibility: "private",
      license_name: args.manifest.source.licenseName,
      license_url: args.manifest.source.licenseUrl ?? null,
      source_type:
        args.manifest.source.sourceKind === "srd" ? "srd" : "private_markdown",
      source_url: args.manifest.source.sourceUrl ?? null,
      source_notes: buildImportSourceNote({
        packageId: args.manifest.packageId,
        distributionStatus: args.manifest.distributionStatus,
      }),
      version: args.manifest.system.version,
      created_by: args.ownerId,
    })
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  return { id: data.id as string, action: "Created" };
}

async function getOrCreateCompendium(args: {
  supabase: SupabaseClient;
  manifest: ImportSourcePackageManifest;
  ownerId: string;
  gameSystemId: string;
}) {
  const slug = normalizeImportSlugPart(args.manifest.sourceContainer.name);
  const existing = await selectRows(args.supabase, "compendiums", [
    ["owner_id", args.ownerId],
    ["game_system_id", args.gameSystemId],
    ["slug", slug],
  ], "id, name, slug, source_notes");

  if (existing.length > 1) {
    throw new Error(`Multiple Compendiums match slug ${slug}; stopping.`);
  }

  if (existing.length === 1) {
    return { id: existing[0].id, action: "Reused" };
  }

  const { data, error } = await args.supabase
    .from("compendiums")
    .insert({
      owner_id: args.ownerId,
      game_system_id: args.gameSystemId,
      name: args.manifest.sourceContainer.name,
      slug,
      description: args.manifest.source.sourceNotes ?? null,
      visibility: "private",
      license_name: args.manifest.source.licenseName,
      license_url: args.manifest.source.licenseUrl ?? null,
      source_type: "markdown_import",
      source_category: args.manifest.sourceContainer.sourceCategory,
      source_subtype: args.manifest.sourceContainer.sourceSubtype,
      clone_policy:
        args.manifest.sourceContainer.clonePolicy ?? "locked_to_system",
      default_player_visibility:
        args.manifest.sourceContainer.defaultPlayerVisibility ?? "visible",
      source_url: args.manifest.source.sourceUrl ?? null,
      source_notes: buildImportSourceNote({
        packageId: args.manifest.packageId,
        distributionStatus: args.manifest.distributionStatus,
      }),
      version: args.manifest.sourceContainer.version,
    })
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  return { id: data.id as string, action: "Created" };
}

async function getOrCreateEntryType(args: {
  supabase: SupabaseClient;
  entryType: ImportSourcePackageManifest["entryTypes"][number];
  ownerId: string;
  sortOrder: number;
}) {
  const slug = normalizeImportSlugPart(args.entryType.name);
  const existing = await selectRows(args.supabase, "entry_types", [
    ["owner_id", args.ownerId],
    ["library_kind", "compendium"],
    ["slug", slug],
  ], "id, name, slug");

  if (existing.length > 1) {
    throw new Error(`Multiple Entry Types match slug ${slug}; stopping.`);
  }

  if (existing.length === 1) {
    return { id: existing[0].id, action: "Reused" };
  }

  const { data, error } = await args.supabase
    .from("entry_types")
    .insert({
      owner_id: args.ownerId,
      library_kind: "compendium",
      name: args.entryType.name,
      slug,
      description: args.entryType.description ?? null,
      visibility: "private",
      sort_order: args.sortOrder,
    })
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  return { id: data.id as string, action: "Created" };
}

async function upsertMasterEntry(args: {
  supabase: SupabaseClient;
  manifest: ImportSourcePackageManifest;
  ownerId: string;
  compendiumId: string;
  entryTypeId: string;
  entry: ImportSourcePackageManifest["entries"][number];
  markdown: string;
  sortOrder: number;
  existingEntries: ExistingRow[];
}) {
  const slug = normalizeImportSlugPart(args.entry.title);
  const existingImportedEntry = args.existingEntries.find((entry) =>
    hasImportMarker(
      entry.source_notes,
      args.manifest.packageId,
      args.entry.externalId,
    ),
  );
  const titleConflict = args.existingEntries.find(
    (entry) =>
      entry.id !== existingImportedEntry?.id &&
      (entry.slug === slug || entry.title === args.entry.title),
  );

  if (!existingImportedEntry && titleConflict) {
    return { id: titleConflict.id, action: "Skipped title conflict for" };
  }

  const html = convertImportedMarkdownToEntryHtml(args.markdown);
  const sourceNotes = buildImportSourceNote({
    packageId: args.manifest.packageId,
    externalId: args.entry.externalId,
    distributionStatus: args.manifest.distributionStatus,
  });
  const values = {
    owner_id: args.ownerId,
    library_kind: "compendium",
    compendium_id: args.compendiumId,
    settings_library_id: null,
    entry_type_id: args.entryTypeId,
    title: args.entry.title,
    slug,
    aliases: args.entry.aliases ?? [],
    summary: args.entry.summary ?? null,
    body: html,
    body_format: "html",
    properties: {},
    visibility: "private",
    sort_order: args.sortOrder,
    license_name: args.entry.licenseName ?? args.manifest.source.licenseName,
    license_url:
      args.entry.licenseUrl ?? args.manifest.source.licenseUrl ?? null,
    source_type: "markdown_import",
    source_url: args.entry.sourceUrl ?? args.manifest.source.sourceUrl ?? null,
    source_notes: sourceNotes,
    version: args.manifest.sourceContainer.version,
  };

  if (existingImportedEntry) {
    const { data, error } = await args.supabase
      .from("master_entries")
      .update({
        ...values,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingImportedEntry.id)
      .select("id")
      .single();

    if (error) {
      throw error;
    }

    return { id: data.id as string, action: "Updated" };
  }

  const { data, error } = await args.supabase
    .from("master_entries")
    .insert(values)
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  return { id: data.id as string, action: "Created" };
}

async function selectRows(
  supabase: SupabaseClient,
  table: string,
  filters: Array<[string, string]>,
  columns: string,
) {
  let query = supabase.from(table).select(columns);

  for (const [column, value] of filters) {
    query = query.eq(column, value);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []) as unknown as ExistingRow[];
}

async function loadExistingMasterEntries(
  supabase: SupabaseClient,
  ownerId: string,
  compendiumId: string,
) {
  const { data, error } = await supabase
    .from("master_entries")
    .select("id, title, slug, source_notes")
    .eq("owner_id", ownerId)
    .eq("library_kind", "compendium")
    .eq("compendium_id", compendiumId);

  if (error) {
    throw error;
  }

  return (data ?? []) as unknown as ExistingRow[];
}

function readManifest(manifestPath: string): ImportSourcePackageManifest {
  try {
    return JSON.parse(readFileSync(manifestPath, "utf8")) as ImportSourcePackageManifest;
  } catch (error) {
    throw new Error(
      `Could not read manifest at ${manifestPath}: ${getErrorMessage(error)}`,
    );
  }
}

function loadMarkdownFiles(
  manifest: ImportSourcePackageManifest,
  manifestDir: string,
): {
  files: MarkdownSourceFile[];
  issues: Array<{
    severity: "error";
    code: string;
    message: string;
    path: string;
  }>;
} {
  const files: MarkdownSourceFile[] = [];
  const issues: Array<{
    severity: "error";
    code: string;
    message: string;
    path: string;
  }> = [];

  for (const entry of manifest.entries ?? []) {
    const filePath = path.resolve(manifestDir, entry.file);

    if (!isInsideDirectory(filePath, manifestDir)) {
      issues.push({
        severity: "error",
        code: "markdown_file_outside_package",
        message: "Markdown files must stay inside the source package folder.",
        path: entry.file,
      });
      continue;
    }

    if (!existsSync(filePath)) {
      continue;
    }

    files.push({
      path: entry.file,
      content: readFileSync(filePath, "utf8"),
    });
  }

  return { files, issues };
}

function loadLocalEnvFile(envPath: string) {
  if (!existsSync(envPath)) {
    return;
  }

  const content = readFileSync(envPath, "utf8");

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();

    process.env[key] ??= unquoteEnvValue(value);
  }
}

function unquoteEnvValue(value: string) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function normalizeFilePath(value: string) {
  return value.trim().replace(/\\/g, "/").toLowerCase();
}

function hasImportMarker(
  sourceNotes: string | null | undefined,
  packageId: string,
  externalId: string,
) {
  return Boolean(
    sourceNotes?.includes(`packageId: ${packageId}`) &&
      sourceNotes.includes(`externalId: ${externalId}`),
  );
}

function isInsideDirectory(filePath: string, directory: string) {
  const relativePath = path.relative(directory, filePath);
  return Boolean(relativePath) && !relativePath.startsWith("..") && !path.isAbsolute(relativePath);
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error";
}
