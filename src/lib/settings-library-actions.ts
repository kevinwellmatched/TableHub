"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { SettingsLibraryFormState } from "@/lib/settings-library-form-state";
import { createSettingsLibrary } from "@/lib/settings-libraries";
import { validateSettingsLibraryInput } from "@/lib/settings-library-validation";
import { getCurrentUserProfile } from "@/lib/profiles";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function missingSupabaseState(): SettingsLibraryFormState {
  return {
    status: "error",
    message:
      "Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then restart the dev server.",
  };
}

export async function createSettingsLibraryAction(
  _previousState: SettingsLibraryFormState,
  formData: FormData,
): Promise<SettingsLibraryFormState> {
  const validation = validateSettingsLibraryInput({
    name: readString(formData, "name"),
    description: readString(formData, "description"),
    visibility: readString(formData, "visibility"),
    genre: readString(formData, "genre"),
    tone: readString(formData, "tone"),
    sourceType: readString(formData, "sourceType"),
    gameSystemId: readString(formData, "gameSystemId"),
    sourceCategory: readString(formData, "sourceCategory"),
    sourceSubtype: readString(formData, "sourceSubtype"),
    clonePolicy: readString(formData, "clonePolicy"),
    defaultPlayerVisibility: readString(formData, "defaultPlayerVisibility"),
    sourceUrl: readString(formData, "sourceUrl"),
    sourceNotes: readString(formData, "sourceNotes"),
    version: readString(formData, "version"),
  });

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

  const { data, error } = await createSettingsLibrary(validation.values);

  if (error) {
    return {
      status: "error",
      message:
        error.message || "Settings Library could not be created. Please try again.",
    };
  }

  if (!data) {
    return {
      status: "error",
      message:
        "Settings Library was created, but the app could not find its ID. Please return to Settings Library and refresh the list.",
    };
  }

  revalidatePath("/settings-library");
  redirect(`/settings-library/${data.id}`);
}
