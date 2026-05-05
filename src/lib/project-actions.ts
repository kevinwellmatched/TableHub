"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { ProjectFormState } from "@/lib/project-form-state";
import { validateProjectInput } from "@/lib/project-validation";
import { getCurrentUserProfile } from "@/lib/profiles";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function missingSupabaseState(): ProjectFormState {
  return {
    status: "error",
    message:
      "Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then restart the dev server.",
  };
}

function readCreatedProjectId(data: unknown): string | null {
  if (typeof data === "string") {
    return data;
  }

  if (Array.isArray(data)) {
    return data.length > 0 ? readCreatedProjectId(data[0]) : null;
  }

  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;

    if (typeof record.id === "string") {
      return record.id;
    }

    if (typeof record.project_id === "string") {
      return record.project_id;
    }
  }

  return null;
}

export async function createProjectAction(
  _previousState: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const projectName = readString(formData, "projectName");
  const projectDescription = readString(formData, "projectDescription");
  const validation = validateProjectInput({ projectName, projectDescription });

  if (!validation.ok) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors: validation.fieldErrors,
    };
  }

  if (!hasSupabaseEnv()) {
    return missingSupabaseState();
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const profile = await getCurrentUserProfile(supabase, user.id);

  if (!profile) {
    redirect("/onboarding");
  }

  const { data, error } = await supabase.rpc("create_project", {
    project_name: validation.values.projectName,
    project_description: validation.values.projectDescription || null,
  });

  if (error) {
    return {
      status: "error",
      message: error.message || "Project could not be created. Please try again.",
    };
  }

  const createdProjectId = readCreatedProjectId(data);

  if (!createdProjectId) {
    return {
      status: "error",
      message:
        "Project was created, but the app could not find its ID. Please return to Projects and refresh the list.",
    };
  }

  revalidatePath("/projects");
  redirect(`/projects/${createdProjectId}`);
}
