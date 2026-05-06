"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { EntryTypeFormState } from "@/lib/entry-type-form-state";
import { createEntryType } from "@/lib/entry-types";
import { validateEntryTypeInput } from "@/lib/entry-type-validation";
import { getCurrentUserProfile } from "@/lib/profiles";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function missingSupabaseState(): EntryTypeFormState {
  return {
    status: "error",
    message:
      "Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then restart the dev server.",
  };
}

export async function createEntryTypeAction(
  _previousState: EntryTypeFormState,
  formData: FormData,
): Promise<EntryTypeFormState> {
  const validation = validateEntryTypeInput({
    name: readString(formData, "name"),
    description: readString(formData, "description"),
    libraryKind: readString(formData, "libraryKind"),
    visibility: readString(formData, "visibility"),
    sortOrder: readString(formData, "sortOrder"),
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

  const { data, error } = await createEntryType(validation.values);

  if (error) {
    return {
      status: "error",
      message:
        error.message || "Entry Type could not be created. Please try again.",
    };
  }

  if (!data) {
    return {
      status: "error",
      message:
        "Entry Type was created, but the app could not find its ID. Please return to Entry Types and refresh the list.",
    };
  }

  revalidatePath("/entry-types");
  redirect(`/entry-types/${data.id}`);
}
