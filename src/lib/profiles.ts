import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

export type Profile = {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export async function getCurrentUserProfile(
  supabase: SupabaseClient,
  userId: string,
) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, created_at, updated_at")
    .eq("id", userId)
    .maybeSingle<Profile>();

  if (error) {
    throw error;
  }

  return data;
}
