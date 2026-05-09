import { convertMarkdownToSafeHtml } from "./markdown-paste.ts";
import {
  normalizeImportSlugPart,
  validateImportSourcePackageManifest,
  type ImportSourcePackageManifest,
} from "./import-source-package.ts";

export type MarkdownSourceFile = {
  path: string;
  content: string;
};

export type MarkdownImportPlanAction =
  | {
      type: "create_game_system" | "update_game_system";
      name: string;
      reason: string;
    }
  | {
      type: "create_compendium" | "update_compendium";
      name: string;
      reason: string;
    }
  | {
      type: "create_entry_type" | "update_entry_type";
      name: string;
      reason: string;
    }
  | {
      type:
        | "create_master_entry"
        | "update_master_entry"
        | "skip_master_entry";
      title: string;
      externalId: string;
      reason: string;
    };

export type MarkdownImportPlanIssue = {
  severity: "error" | "warning";
  code: string;
  message: string;
  path?: string;
};

export type MarkdownImportPlan = {
  ok: boolean;
  packageId: string;
  packageName: string;
  dryRunOnly: boolean;
  actions: MarkdownImportPlanAction[];
  issues: MarkdownImportPlanIssue[];
};

export type MarkdownImportCliArgs = {
  manifestPath: string;
  mode: "dry-run" | "apply";
  ownerId?: string;
};

export type MarkdownImportCliArgsResult =
  | {
      ok: true;
      args: MarkdownImportCliArgs;
    }
  | {
      ok: false;
      error: string;
    };

const manifestBodyFields = ["body", "content", "markdown", "html"] as const;
const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function parseMarkdownImportCliArgs(
  argv: string[],
): MarkdownImportCliArgsResult {
  let manifestPath = "";
  let ownerId = "";
  let dryRun = false;
  let apply = false;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--manifest") {
      manifestPath = argv[index + 1] ?? "";
      index += 1;
      continue;
    }

    if (arg === "--owner-id") {
      ownerId = argv[index + 1] ?? "";
      index += 1;
      continue;
    }

    if (arg === "--dry-run") {
      dryRun = true;
      continue;
    }

    if (arg === "--apply") {
      apply = true;
      continue;
    }

    return {
      ok: false,
      error: `Unknown option: ${arg}`,
    };
  }

  if (!manifestPath.trim()) {
    return {
      ok: false,
      error: "Missing required --manifest <path>.",
    };
  }

  if (dryRun && apply) {
    return {
      ok: false,
      error: "Use either --dry-run or --apply, not both.",
    };
  }

  if (apply && !uuidPattern.test(ownerId)) {
    return {
      ok: false,
      error: "--apply requires --owner-id <auth-user-uuid>.",
    };
  }

  return {
    ok: true,
    args: {
      manifestPath,
      mode: apply ? "apply" : "dry-run",
      ownerId: apply ? ownerId : undefined,
    },
  };
}

export function convertImportedMarkdownToEntryHtml(markdown: string): string {
  return convertMarkdownToSafeHtml(markdown);
}

export function buildMarkdownImportPlan(args: {
  manifest: ImportSourcePackageManifest;
  files: MarkdownSourceFile[];
}): MarkdownImportPlan {
  const validation = validateImportSourcePackageManifest(args.manifest);
  const issues: MarkdownImportPlanIssue[] = [...validation.issues];
  const normalizedFiles = buildFileMap(args.files);
  const declaredCompendiumEntryTypes = new Set<string>();

  for (const entryType of args.manifest.entryTypes ?? []) {
    if (entryType.libraryKind !== "compendium") {
      issues.push({
        severity: "error",
        code: "entry_type_library_kind_not_supported",
        message:
          "The first Markdown importer only supports Compendium entry types.",
        path: `entryTypes.${entryType.name}`,
      });
      continue;
    }

    declaredCompendiumEntryTypes.add(entryType.name.trim());
  }

  for (const entry of args.manifest.entries ?? []) {
    for (const field of manifestBodyFields) {
      if (Object.hasOwn(entry, field)) {
        issues.push({
          severity: "error",
          code: "entry_body_not_allowed",
          message:
            "Entry body content does not belong in the manifest; manifests point to Markdown files only.",
          path: `entries.${entry.externalId}.${field}`,
        });
      }
    }

    if (!declaredCompendiumEntryTypes.has(entry.entryType.trim())) {
      issues.push({
        severity: "error",
        code: "entry_type_not_declared",
        message:
          "Entry type must match one of the declared Compendium entry type names.",
        path: entry.file,
      });
    }

    const file = normalizedFiles.get(normalizeFilePath(entry.file));

    if (!file) {
      issues.push({
        severity: "error",
        code: "markdown_file_missing",
        message: `Markdown file was not loaded for ${entry.title}.`,
        path: entry.file,
      });
      continue;
    }

    if (!file.content.trim()) {
      issues.push({
        severity: "error",
        code: "markdown_file_empty",
        message: `Markdown file is empty for ${entry.title}.`,
        path: entry.file,
      });
    }
  }

  const actions: MarkdownImportPlanAction[] = [
    {
      type: "create_game_system",
      name: args.manifest.system?.name ?? "Unknown system",
      reason: "Create or reuse a matching owner-scoped Game System during apply.",
    },
    {
      type: "create_compendium",
      name: args.manifest.sourceContainer?.name ?? "Unknown source container",
      reason:
        "Create or reuse a matching owner-scoped Compendium source container during apply.",
    },
    ...(args.manifest.entryTypes ?? []).map<MarkdownImportPlanAction>(
      (entryType) => ({
        type: "create_entry_type",
        name: entryType.name,
        reason:
          "Create or reuse a matching owner-scoped Compendium Entry Type during apply.",
      }),
    ),
    ...(args.manifest.entries ?? []).map<MarkdownImportPlanAction>((entry) => ({
      type: "create_master_entry",
      title: entry.title,
      externalId: normalizeImportSlugPart(entry.externalId),
      reason:
        "Create when no matching import marker exists; update only matching imported entries.",
    })),
  ];

  return {
    ok: issues.every((issue) => issue.severity !== "error"),
    packageId: args.manifest.packageId ?? "",
    packageName: args.manifest.packageName ?? "",
    dryRunOnly: true,
    actions,
    issues,
  };
}

export function formatMarkdownImportPlan(
  plan: MarkdownImportPlan,
  options: {
    manifestPath?: string;
    mode?: "dry-run" | "apply";
  } = {},
): string {
  const lines = [
    "TableHub Markdown Import",
    "",
    options.manifestPath ? `Manifest: ${options.manifestPath}` : undefined,
    `Package: ${plan.packageName} (${plan.packageId})`,
    `Mode: ${options.mode ?? "dry-run"}`,
    "",
    "Plan:",
  ].filter((line) => line !== undefined);

  if (plan.actions.length === 0) {
    lines.push("- None");
  } else {
    for (const action of plan.actions) {
      lines.push(`- ${formatAction(action)}`);
    }
  }

  lines.push("", "Issues:");

  if (plan.issues.length === 0) {
    lines.push("- None");
  } else {
    for (const issue of plan.issues) {
      const location = issue.path ? ` (${issue.path})` : "";
      lines.push(
        `- [${issue.severity}] ${issue.code}${location}: ${issue.message}`,
      );
    }
  }

  return lines.join("\n");
}

export function buildImportSourceNote(args: {
  packageId: string;
  externalId?: string;
  distributionStatus: string;
}): string {
  return [
    "Imported by TableHub source package",
    `packageId: ${args.packageId}`,
    args.externalId ? `externalId: ${args.externalId}` : undefined,
    `distributionStatus: ${args.distributionStatus}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function buildFileMap(files: MarkdownSourceFile[]) {
  return new Map(files.map((file) => [normalizeFilePath(file.path), file]));
}

function normalizeFilePath(value: string) {
  return value.trim().replace(/\\/g, "/").toLowerCase();
}

function formatAction(action: MarkdownImportPlanAction) {
  if ("title" in action) {
    return `${formatActionType(action.type)}: ${action.title}`;
  }

  return `${formatActionType(action.type)}: ${action.name}`;
}

function formatActionType(type: MarkdownImportPlanAction["type"]) {
  const labels: Record<MarkdownImportPlanAction["type"], string> = {
    create_game_system: "Create game system",
    update_game_system: "Update game system",
    create_compendium: "Create compendium",
    update_compendium: "Update compendium",
    create_entry_type: "Create entry type",
    update_entry_type: "Update entry type",
    create_master_entry: "Create master entry",
    update_master_entry: "Update master entry",
    skip_master_entry: "Skip master entry",
  };

  return labels[type];
}
