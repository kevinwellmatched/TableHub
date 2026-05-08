"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  deleteProjectEntryOverride,
  getProjectLibraryEntry,
  upsertProjectEntryOverride,
} from "@/lib/project-entry-override-data";
import { validateProjectEntryOverrideInput } from "@/lib/project-entry-overrides";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function projectEntryPath(
  projectId: string,
  masterEntryId: string,
  status?: string,
  message?: string,
) {
  const fallbackPath = projectId ? `/projects/${projectId}/library` : "/projects";

  if (!projectId || !masterEntryId) {
    return fallbackPath;
  }

  const path = `/projects/${projectId}/library/${masterEntryId}`;

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

function readableOverrideError(message: string, fallback: string) {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("permission") || lowerMessage.includes("policy")) {
    return "Supabase did not allow that change for your current Project role.";
  }

  if (lowerMessage.includes("duplicate")) {
    return "This Project already has an override for that Master Entry.";
  }

  return message || fallback;
}

export async function saveProjectEntryOverrideAction(formData: FormData) {
  const projectId = readString(formData, "projectId");
  const masterEntryId = readString(formData, "masterEntryId");
  const validation = validateProjectEntryOverrideInput({
    projectId,
    masterEntryId,
    overrideTitle: readString(formData, "overrideTitle"),
    overrideSummary: readString(formData, "overrideSummary"),
    overrideBody: readString(formData, "overrideBody"),
    overrideProperties: readString(formData, "overrideProperties"),
    overrideVisibility: readString(formData, "overrideVisibility"),
    overrideReason: readString(formData, "overrideReason"),
  });

  if (!validation.ok) {
    redirect(
      projectEntryPath(
        projectId,
        masterEntryId,
        "error",
        firstFieldError(validation.fieldErrors),
      ),
    );
  }

  const reachableEntry = await getProjectLibraryEntry(
    validation.values.project_id,
    validation.values.master_entry_id,
  );

  if (!reachableEntry) {
    redirect(
      projectEntryPath(
        validation.values.project_id,
        validation.values.master_entry_id,
        "error",
        "That Master Entry is not attached to this Project through a Library Source.",
      ),
    );
  }

  const { error } = await upsertProjectEntryOverride(validation.values);

  if (error) {
    redirect(
      projectEntryPath(
        validation.values.project_id,
        validation.values.master_entry_id,
        "error",
        readableOverrideError(
          error.message,
          "Override could not be saved. Please try again.",
        ),
      ),
    );
  }

  revalidateProjectLibraryPaths(
    validation.values.project_id,
    validation.values.master_entry_id,
  );
  redirect(
    projectEntryPath(
      validation.values.project_id,
      validation.values.master_entry_id,
      "success",
      "Project override saved. The Master Entry was not changed.",
    ),
  );
}

export async function resetProjectEntryOverrideAction(formData: FormData) {
  const projectId = readString(formData, "projectId");
  const masterEntryId = readString(formData, "masterEntryId");

  if (!projectId || !masterEntryId) {
    redirect(
      projectEntryPath(
        projectId,
        masterEntryId,
        "error",
        "Project and Master Entry are required.",
      ),
    );
  }

  const { data, error } = await deleteProjectEntryOverride(projectId, masterEntryId);

  if (error) {
    redirect(
      projectEntryPath(
        projectId,
        masterEntryId,
        "error",
        readableOverrideError(
          error.message,
          "Override could not be reset. Please try again.",
        ),
      ),
    );
  }

  if (!data || data.length === 0) {
    redirect(
      projectEntryPath(
        projectId,
        masterEntryId,
        "error",
        "No Project override was found to reset.",
      ),
    );
  }

  revalidateProjectLibraryPaths(projectId, masterEntryId);
  redirect(
    projectEntryPath(
      projectId,
      masterEntryId,
      "success",
      "Project override reset. The Project view now falls back to the original Master Entry.",
    ),
  );
}

function revalidateProjectLibraryPaths(projectId: string, masterEntryId: string) {
  revalidatePath(`/projects/${projectId}`);
  revalidatePath(`/projects/${projectId}/library`);
  revalidatePath(`/projects/${projectId}/library/${masterEntryId}`);
}
