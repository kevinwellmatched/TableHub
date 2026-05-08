"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { MasterEntryFormState } from "@/lib/master-entry-form-state";
import { createMasterEntry, updateMasterEntryBody } from "@/lib/master-entries";
import {
  validateMasterEntryBodyInput,
  validateMasterEntryInput,
} from "@/lib/master-entry-validation";
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

function masterEntryPath(masterEntryId: string, status?: string, message?: string) {
  const fallbackPath = masterEntryId
    ? `/master-entries/${masterEntryId}`
    : "/master-entries";

  if (!status || !message || !masterEntryId) {
    return fallbackPath;
  }

  const params = new URLSearchParams({
    status,
    message,
  });

  return `${fallbackPath}?${params.toString()}`;
}

function firstFieldError(fieldErrors: Record<string, string | undefined>) {
  return Object.values(fieldErrors).find(Boolean) ?? "Please check the form.";
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

export async function updateMasterEntryBodyAction(formData: FormData) {
  const masterEntryId = readString(formData, "masterEntryId");
  const validation = validateMasterEntryBodyInput({
    masterEntryId,
    body: readString(formData, "body"),
    bodyFormat: readString(formData, "bodyFormat"),
  });

  if (!validation.ok) {
    redirect(
      masterEntryPath(
        masterEntryId,
        "error",
        firstFieldError(validation.fieldErrors),
      ),
    );
  }

  if (!hasSupabaseEnv()) {
    redirect(
      masterEntryPath(
        validation.values.id,
        "error",
        missingSupabaseState().message,
      ),
    );
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

  const { data, error } = await updateMasterEntryBody(validation.values);

  if (error || !data) {
    redirect(
      masterEntryPath(
        validation.values.id,
        "error",
        error?.message ||
          "Master Entry body could not be updated. Supabase may not allow this change for your account.",
      ),
    );
  }

  revalidatePath(`/master-entries/${validation.values.id}`);
  redirect(
    masterEntryPath(
      validation.values.id,
      "success",
      "Master Entry body saved as rich text HTML.",
    ),
  );
}
