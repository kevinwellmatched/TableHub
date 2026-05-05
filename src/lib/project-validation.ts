import type { ProjectFormState } from "@/lib/project-form-state";

export const PROJECT_NAME_MAX_LENGTH = 120;
export const PROJECT_DESCRIPTION_MAX_LENGTH = 2000;

type ProjectInput = {
  projectName: string;
  projectDescription: string;
};

export function validateProjectInput(input: ProjectInput) {
  const fieldErrors: ProjectFormState["fieldErrors"] = {};
  const projectName = input.projectName.trim();
  const projectDescription = input.projectDescription.trim();

  if (!projectName) {
    fieldErrors.projectName = "Project name is required.";
  } else if (projectName.length > PROJECT_NAME_MAX_LENGTH) {
    fieldErrors.projectName = `Project name must be ${PROJECT_NAME_MAX_LENGTH} characters or fewer.`;
  }

  if (projectDescription.length > PROJECT_DESCRIPTION_MAX_LENGTH) {
    fieldErrors.projectDescription = `Description must be ${PROJECT_DESCRIPTION_MAX_LENGTH} characters or fewer.`;
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
      projectName,
      projectDescription,
    },
  };
}
