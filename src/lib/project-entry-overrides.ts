import type { LibrarySourcePlayerVisibility } from "@/lib/library-source-taxonomy";

export const PROJECT_ENTRY_OVERRIDE_VISIBILITIES = [
  "inherit",
  "visible",
  "gm_only",
  "hidden",
] as const;

export type ProjectEntryOverrideVisibility =
  (typeof PROJECT_ENTRY_OVERRIDE_VISIBILITIES)[number];

export type ProjectLibraryRole = "owner" | "gm" | "player" | "viewer" | string | null;

export type ProjectLibraryResolvedVisibility = "visible" | "gm_only" | "hidden";

export type ProjectEntryProperties = Record<string, unknown>;

export type ProjectEntryOriginal = {
  id: string;
  title: string;
  summary: string | null;
  body: string | null;
  properties: ProjectEntryProperties | null;
  visibility: string;
};

export type ProjectEntryOverrideRow = {
  id: string;
  project_id: string;
  master_entry_id: string;
  override_title: string | null;
  override_summary: string | null;
  override_body: string | null;
  override_properties: ProjectEntryProperties;
  override_visibility: ProjectEntryOverrideVisibility | null;
  override_reason: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type EffectiveProjectEntry = {
  id: string;
  title: string;
  summary: string | null;
  body: string | null;
  properties: ProjectEntryProperties;
  visibility: string;
  original: ProjectEntryOriginal;
  override: ProjectEntryOverrideRow | null;
};

export type ProjectLibraryReadEntry = {
  id: string;
  sourceName: string;
  sourceType: "compendium" | "settings_library";
  title: string;
  summary: string | null;
  body: string | null;
  properties: ProjectEntryProperties | null;
};

export type ProjectEntryOverrideStatus = {
  title: boolean;
  summary: boolean;
  body: boolean;
  properties: boolean;
  visibility: boolean;
};

export type ProjectEntryOverrideInput = {
  projectId: string;
  masterEntryId: string;
  overrideTitle: string;
  overrideSummary: string;
  overrideBody: string;
  overrideProperties: string;
  overrideVisibility: string;
  overrideReason: string;
};

export type ValidProjectEntryOverrideInput = {
  project_id: string;
  master_entry_id: string;
  override_title: string | null;
  override_summary: string | null;
  override_body: string | null;
  override_properties: ProjectEntryProperties;
  override_visibility: ProjectEntryOverrideVisibility;
  override_reason: string | null;
};

export type ProjectLibraryVisibilityInput = {
  sourceDefaultVisibility: LibrarySourcePlayerVisibility;
  overrideVisibility: ProjectEntryOverrideVisibility | null;
};

export type ProjectLibraryReadModeShapeInput = {
  masterEntryId: string;
  sourceName: string;
  sourceType: ProjectLibraryReadEntry["sourceType"];
  effective: EffectiveProjectEntry;
};

export type ProjectEntryOverrideFieldErrors = {
  projectId?: string;
  masterEntryId?: string;
  overrideProperties?: string;
  overrideVisibility?: string;
};

export function resolveProjectEntry(
  masterEntry: ProjectEntryOriginal,
  override: ProjectEntryOverrideRow | null,
): EffectiveProjectEntry {
  return {
    id: masterEntry.id,
    title: readOverrideText(override?.override_title, masterEntry.title),
    summary: readOverrideText(override?.override_summary, masterEntry.summary),
    body: readOverrideText(override?.override_body, masterEntry.body),
    properties: {
      ...(masterEntry.properties ?? {}),
      ...(override?.override_properties ?? {}),
    },
    visibility:
      override?.override_visibility && override.override_visibility !== "inherit"
        ? override.override_visibility
        : masterEntry.visibility,
    original: masterEntry,
    override,
  };
}

export function resolveProjectLibraryVisibility({
  sourceDefaultVisibility,
  overrideVisibility,
}: ProjectLibraryVisibilityInput): ProjectLibraryResolvedVisibility {
  if (overrideVisibility === "visible") {
    return "visible";
  }

  if (overrideVisibility === "gm_only") {
    return "gm_only";
  }

  if (overrideVisibility === "hidden") {
    return "hidden";
  }

  if (sourceDefaultVisibility === "visible") {
    return "visible";
  }

  if (sourceDefaultVisibility === "gm_only") {
    return "gm_only";
  }

  return "gm_only";
}

export function canProjectRoleReadResolvedVisibility(
  role: ProjectLibraryRole,
  resolvedVisibility: ProjectLibraryResolvedVisibility,
) {
  if (canProjectRoleManageOverrides(role)) {
    return true;
  }

  if (role?.toLowerCase() === "player" || role?.toLowerCase() === "viewer") {
    return resolvedVisibility === "visible";
  }

  return false;
}

export function canProjectRoleManageOverrides(role: ProjectLibraryRole) {
  const normalizedRole = role?.toLowerCase();
  return normalizedRole === "owner" || normalizedRole === "gm";
}

export function shapeProjectLibraryEntryForReadMode({
  masterEntryId,
  sourceName,
  sourceType,
  effective,
}: ProjectLibraryReadModeShapeInput): ProjectLibraryReadEntry {
  return {
    id: masterEntryId,
    sourceName,
    sourceType,
    title: effective.title,
    summary: effective.summary,
    body: effective.body,
    properties: effective.properties,
  };
}

export function getProjectEntryOverrideStatus(
  _masterEntry: ProjectEntryOriginal,
  override: ProjectEntryOverrideRow | null,
): ProjectEntryOverrideStatus {
  return {
    title: hasOverrideText(override?.override_title),
    summary: hasOverrideText(override?.override_summary),
    body: hasOverrideText(override?.override_body),
    properties: Object.keys(override?.override_properties ?? {}).length > 0,
    visibility:
      Boolean(override?.override_visibility) &&
      override?.override_visibility !== "inherit",
  };
}

export function validateProjectEntryOverrideInput(
  input: ProjectEntryOverrideInput,
) {
  const fieldErrors: ProjectEntryOverrideFieldErrors = {};
  const projectId = input.projectId.trim();
  const masterEntryId = input.masterEntryId.trim();
  const overrideTitle = input.overrideTitle.trim();
  const overrideSummary = input.overrideSummary.trim();
  const overrideBody = input.overrideBody.trim();
  const overrideVisibility = input.overrideVisibility.trim() || "inherit";
  const overrideReason = input.overrideReason.trim();
  const overrideProperties = parseOverrideProperties(
    input.overrideProperties.trim(),
    fieldErrors,
  );

  if (!projectId) {
    fieldErrors.projectId = "Project is required.";
  }

  if (!masterEntryId) {
    fieldErrors.masterEntryId = "Master Entry is required.";
  }

  if (!isProjectEntryOverrideVisibility(overrideVisibility)) {
    fieldErrors.overrideVisibility = "Choose inherit, visible, GM only, or hidden.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false as const,
      fieldErrors,
    };
  }

  return {
    ok: true as const,
    values: {
      project_id: projectId,
      master_entry_id: masterEntryId,
      override_title: overrideTitle || null,
      override_summary: overrideSummary || null,
      override_body: overrideBody || null,
      override_properties: overrideProperties,
      override_visibility: overrideVisibility as ProjectEntryOverrideVisibility,
      override_reason: overrideReason || null,
    } satisfies ValidProjectEntryOverrideInput,
  };
}

export function formatProjectEntryOverrideVisibility(
  visibility: ProjectEntryOverrideVisibility,
) {
  const labels: Record<ProjectEntryOverrideVisibility, string> = {
    inherit: "Inherit original",
    visible: "Visible",
    gm_only: "GM only",
    hidden: "Hidden",
  };

  return labels[visibility];
}

export function formatProjectLibraryResolvedVisibility(
  visibility: ProjectLibraryResolvedVisibility,
) {
  const labels: Record<ProjectLibraryResolvedVisibility, string> = {
    visible: "Visible to players",
    gm_only: "GM-only",
    hidden: "Hidden",
  };

  return labels[visibility];
}

function readOverrideText<T extends string | null>(
  overrideValue: string | null | undefined,
  fallbackValue: T,
) {
  return hasOverrideText(overrideValue) ? overrideValue.trim() : fallbackValue;
}

function hasOverrideText(value: string | null | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function parseOverrideProperties(
  value: string,
  fieldErrors: ProjectEntryOverrideFieldErrors,
): ProjectEntryProperties {
  if (!value) {
    return {};
  }

  try {
    const parsed: unknown = JSON.parse(value);

    if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") {
      fieldErrors.overrideProperties =
        "Override properties must be a JSON object.";
      return {};
    }

    return parsed as ProjectEntryProperties;
  } catch {
    fieldErrors.overrideProperties =
      "Override properties must be valid JSON object text.";
    return {};
  }
}

function isProjectEntryOverrideVisibility(
  value: string,
): value is ProjectEntryOverrideVisibility {
  return PROJECT_ENTRY_OVERRIDE_VISIBILITIES.includes(
    value as ProjectEntryOverrideVisibility,
  );
}
