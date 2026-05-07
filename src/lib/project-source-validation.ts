export const PROJECT_SOURCE_TYPES = [
  "game_system",
  "compendium",
  "settings_library",
] as const;

export type ProjectSourceType = (typeof PROJECT_SOURCE_TYPES)[number];

export type ProjectSourceFieldErrors = {
  projectId?: string;
  sourceType?: string;
  sourceId?: string;
  projectSourceId?: string;
};

type AttachProjectSourceInput = {
  projectId: string;
  sourceType: string;
  sourceId: string;
};

type RemoveProjectSourceInput = {
  projectId: string;
  projectSourceId: string;
};

export function validateAttachProjectSourceInput(
  input: AttachProjectSourceInput,
) {
  const fieldErrors: ProjectSourceFieldErrors = {};
  const projectId = input.projectId.trim();
  const sourceType = input.sourceType.trim();
  const sourceId = input.sourceId.trim();
  const parsedSourceType = isProjectSourceType(sourceType) ? sourceType : null;

  if (!projectId) {
    fieldErrors.projectId = "Project is required.";
  }

  if (!parsedSourceType) {
    fieldErrors.sourceType = "Choose a supported source type.";
  }

  if (!sourceId) {
    fieldErrors.sourceId = "Choose a source to attach.";
  }

  if (!projectId || !parsedSourceType || !sourceId) {
    return {
      ok: false as const,
      fieldErrors,
    };
  }

  return {
    ok: true as const,
    values: {
      project_id: projectId,
      source_type: parsedSourceType,
      source_id: sourceId,
    },
  };
}

export function validateRemoveProjectSourceInput(
  input: RemoveProjectSourceInput,
) {
  const fieldErrors: ProjectSourceFieldErrors = {};
  const projectId = input.projectId.trim();
  const projectSourceId = input.projectSourceId.trim();

  if (!projectId) {
    fieldErrors.projectId = "Project is required.";
  }

  if (!projectSourceId) {
    fieldErrors.projectSourceId = "Project Source is required.";
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
      project_source_id: projectSourceId,
    },
  };
}

export function isProjectSourceType(value: string): value is ProjectSourceType {
  return PROJECT_SOURCE_TYPES.includes(value as ProjectSourceType);
}

export function formatProjectSourceType(sourceType: ProjectSourceType) {
  const labels: Record<ProjectSourceType, string> = {
    game_system: "Game System",
    compendium: "Compendium",
    settings_library: "Settings Library",
  };

  return labels[sourceType];
}
