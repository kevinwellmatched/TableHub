"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { MasterEntryFormState } from "@/lib/master-entry-form-state";
import { createMasterEntry } from "@/lib/master-entries";
import { validateMasterEntryInput } from "@/lib/master-entry-validation";
import { getCurrentUserProfile } from "@/lib/profiles";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function missingSupabaseState(): MasterEntryFormState {
  return {
    status: "error",
    message:
      "Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then restart the dev server.",
  };
}

export async function createMasterEntryAction(
  _previousState: MasterEntryFormState,
  formData: FormData,
): Promise<MasterEntryFormState> {
  const validation = validateMasterEntryInput({
    libraryKind: readString(formData, "libraryKind"),
    compendiumId: readString(formData, "compendiumId"),
    settingsLibraryId: readString(formData, "settingsLibraryId"),
    entryTypeId: readString(formData, "entryTypeId"),
    title: readString(formData, "title"),
    aliases: readString(formData, "aliases"),
    summary: readString(formData, "summary"),
    body: readString(formData, "body"),
    bodyFormat: readString(formData, "bodyFormat"),
    properties: readString(formData, "properties"),
    visibility: readString(formData, "visibility"),
    sortOrder: readString(formData, "sortOrder"),
    licenseName: readString(formData, "licenseName"),
    licenseUrl: readString(formData, "licenseUrl"),
    sourceType: readString(formData, "sourceType"),
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

  const { data, error } = await createMasterEntry(validation.values);

  if (error) {
    return {
      status: "error",
      message:
        error.message || "Master Entry could not be created. Please try again.",
    };
  }

  if (!data) {
    return {
      status: "error",
      message:
        "Master Entry was created, but the app could not find its ID. Please return to Master Entries and refresh the list.",
    };
  }

  revalidatePath("/master-entries");

  if (validation.values.compendium_id) {
    revalidatePath(`/compendium/${validation.values.compendium_id}`);
  }

  if (validation.values.settings_library_id) {
    revalidatePath(`/settings-library/${validation.values.settings_library_id}`);
  }

  redirect(`/master-entries/${data.id}`);
}
