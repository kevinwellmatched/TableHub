"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { AuthFormState } from "@/lib/auth-form-state";
import { validateProfileInput } from "@/lib/profile-validation";
import { getCurrentUserProfile } from "@/lib/profiles";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function validateEmailPassword(email: string, password: string) {
  const fieldErrors: AuthFormState["fieldErrors"] = {};

  if (!email) {
    fieldErrors.email = "Email is required.";
  }

  if (password.length < 6) {
    fieldErrors.password = "Password must be at least 6 characters.";
  }

  return fieldErrors;
}

function safeRedirectPath(value: string, fallback: string) {
  if (!value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  if (value.startsWith("/login") || value.startsWith("/signup")) {
    return fallback;
  }

  return value;
}

function profileErrorMessage(message: string, code?: string) {
  if (code === "23505" || message.toLowerCase().includes("duplicate")) {
    return "That username is already taken. Try another one.";
  }

  return "Profile could not be saved. Please try again.";
}

function missingSupabaseState(): AuthFormState {
  return {
    status: "error",
    message:
      "Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then restart the dev server.",
  };
}

export async function signUpAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = readString(formData, "email");
  const password = readString(formData, "password");
  const fieldErrors = validateEmailPassword(email, password);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors,
    };
  }

  if (!hasSupabaseEnv()) {
    return missingSupabaseState();
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  if (!data.session) {
    return {
      status: "success",
      message:
        "Account created. Check your email for a confirmation link, then come back to log in.",
    };
  }

  redirect("/onboarding");
}

export async function loginAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = readString(formData, "email");
  const password = readString(formData, "password");
  const next = safeRedirectPath(readString(formData, "next"), "/dashboard");
  const fieldErrors = validateEmailPassword(email, password);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors,
    };
  }

  if (!hasSupabaseEnv()) {
    return missingSupabaseState();
  }

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !user) {
    return {
      status: "error",
      message: error?.message ?? "Login failed. Please try again.",
    };
  }

  const profile = await getCurrentUserProfile(supabase, user.id);

  if (!profile) {
    redirect("/onboarding");
  }

  redirect(next);
}

export async function saveProfileAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const username = readString(formData, "username");
  const displayName = readString(formData, "displayName");
  const returnTo = safeRedirectPath(readString(formData, "returnTo"), "/dashboard");
  const validation = validateProfileInput({ username, displayName });

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

  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      username: validation.values.username,
      display_name: validation.values.displayName,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "id",
    },
  );

  if (error) {
    return {
      status: "error",
      message: profileErrorMessage(error.message, error.code),
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/account");
  redirect(returnTo);
}

export async function logoutAction() {
  if (!hasSupabaseEnv()) {
    redirect("/login");
  }

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
