"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  attachProjectSource,
  deleteProjectSource,
} from "@/lib/project-sources";
import {
  validateAttachProjectSourceInput,
  validateRemoveProjectSourceInput,
} from "@/lib/project-source-validation";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function projectSourcesPath(projectId: string, status?: string, message?: string) {
  if (!projectId) {
    return "/projects";
  }

  const path = `/projects/${projectId}/sources`;

  if (!status || !message) {
    return path;
  }

  const params = new URLSearchParams({
    status,
    message,
  });

  return `${path}?${params.toString()}`;
}

function firstFieldError(fieldErrors: Record<string, string | undefined>) {
  return Object.values(fieldErrors).find(Boolean) ?? "Please check the form.";
}

function readableSourceError(message: string, fallback: string) {
  if (message.toLowerCase().includes("duplicate")) {
    return "That source is already attached to this Project.";
  }

  if (message.toLowerCase().includes("permission")) {
    return "Supabase did not allow that change for your current Project role.";
  }

  return message || fallback;
}

export async function attachProjectSourceAction(formData: FormData) {
  const projectId = readString(formData, "projectId");
  const validation = validateAttachProjectSourceInput({
    projectId,
    sourceType: readString(formData, "sourceType"),
    sourceId: readString(formData, "sourceId"),
  });

  if (!validation.ok) {
    redirect(
      projectSourcesPath(
        projectId,
        "error",
        firstFieldError(validation.fieldErrors),
      ),
    );
  }

  const { error } = await attachProjectSource(
    validation.values.project_id,
    validation.values.source_type,
    validation.values.source_id,
  );

  if (error) {
    redirect(
      projectSourcesPath(
        validation.values.project_id,
        "error",
        readableSourceError(
          error.message,
          "Source could not be attached. Please try again.",
        ),
      ),
    );
  }

  revalidatePath(`/projects/${validation.values.project_id}`);
  revalidatePath(`/projects/${validation.values.project_id}/sources`);
  redirect(
    projectSourcesPath(
      validation.values.project_id,
      "success",
      "Source attached to this Project.",
    ),
  );
}

export async function removeProjectSourceAction(formData: FormData) {
  const projectId = readString(formData, "projectId");
  const validation = validateRemoveProjectSourceInput({
    projectId,
    projectSourceId: readString(formData, "projectSourceId"),
  });

  if (!validation.ok) {
    redirect(
      projectSourcesPath(
        projectId,
        "error",
        firstFieldError(validation.fieldErrors),
      ),
    );
  }

  const { data, error } = await deleteProjectSource(
    validation.values.project_id,
    validation.values.project_source_id,
  );

  if (error) {
    redirect(
      projectSourcesPath(
        validation.values.project_id,
        "error",
        readableSourceError(
          error.message,
          "Source could not be removed. Please try again.",
        ),
      ),
    );
  }

  if (!data || data.length === 0) {
    redirect(
      projectSourcesPath(
        validation.values.project_id,
        "error",
        "Source could not be removed. Supabase may have denied access for your current Project role.",
      ),
    );
  }

  revalidatePath(`/projects/${validation.values.project_id}`);
  revalidatePath(`/projects/${validation.values.project_id}/sources`);
  redirect(
    projectSourcesPath(
      validation.values.project_id,
      "success",
      "Source removed from this Project.",
    ),
  );
}
