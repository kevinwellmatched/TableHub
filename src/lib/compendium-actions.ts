"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { CompendiumFormState } from "@/lib/compendium-form-state";
import { createCompendium } from "@/lib/compendiums";
import { validateCompendiumInput } from "@/lib/compendium-validation";
import { getCurrentUserProfile } from "@/lib/profiles";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function missingSupabaseState(): CompendiumFormState {
  return {
    status: "error",
    message:
      "Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then restart the dev server.",
  };
}

export async function createCompendiumAction(
  _previousState: CompendiumFormState,
  formData: FormData,
): Promise<CompendiumFormState> {
  const validation = validateCompendiumInput({
    name: readString(formData, "name"),
    description: readString(formData, "description"),
    gameSystemId: readString(formData, "gameSystemId"),
    visibility: readString(formData, "visibility"),
    licenseName: readString(formData, "licenseName"),
    licenseUrl: readString(formData, "licenseUrl"),
    sourceType: readString(formData, "sourceType"),
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

  const { data, error } = await createCompendium(validation.values);

  if (error) {
    return {
      status: "error",
      message: error.message || "Compendium could not be created. Please try again.",
    };
  }

  if (!data) {
    return {
      status: "error",
      message:
        "Compendium was created, but the app could not find its ID. Please return to Compendium and refresh the list.",
    };
  }

  revalidatePath("/compendium");
  redirect(`/compendium/${data.id}`);
}
