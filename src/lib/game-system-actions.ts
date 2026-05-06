"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { GameSystemFormState } from "@/lib/game-system-form-state";
import { GAME_SYSTEM_COLUMNS } from "@/lib/game-systems";
import { getCurrentUserProfile } from "@/lib/profiles";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { validateGameSystemInput } from "@/lib/game-system-validation";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function missingSupabaseState(): GameSystemFormState {
  return {
    status: "error",
    message:
      "Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then restart the dev server.",
  };
}

export async function createGameSystemAction(
  _previousState: GameSystemFormState,
  formData: FormData,
): Promise<GameSystemFormState> {
  const validation = validateGameSystemInput({
    name: readString(formData, "name"),
    edition: readString(formData, "edition"),
    publisher: readString(formData, "publisher"),
    description: readString(formData, "description"),
    rulesetYear: readString(formData, "rulesetYear"),
    visibility: readString(formData, "visibility"),
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

  const { data, error } = await supabase
    .from("game_systems")
    .insert({
      ...validation.values,
      edition: validation.values.edition || null,
      publisher: validation.values.publisher || null,
      description: validation.values.description || null,
      license_name: validation.values.license_name || null,
      license_url: validation.values.license_url || null,
      source_url: validation.values.source_url || null,
      source_notes: validation.values.source_notes || null,
      created_by: user.id,
    })
    .select(GAME_SYSTEM_COLUMNS)
    .single<{ id: string }>();

  if (error) {
    return {
      status: "error",
      message: error.message || "Game system could not be created. Please try again.",
    };
  }

  revalidatePath("/systems");
  redirect(`/systems/${data.id}`);
}
