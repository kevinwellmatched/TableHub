import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export type ProjectRole = "owner" | "gm" | "player" | "viewer" | string;

const PROJECT_COLUMNS =
  "id, name, description, primary_game_system_id, created_at, updated_at";

const LEGACY_PROJECT_COLUMNS = "id, name, description, created_at, updated_at";

const GAME_SYSTEM_FORM_COLUMNS =
  "id, name, edition, publisher, visibility, created_at";

export type ProjectRow = {
  id: string;
  name: string;
  description: string | null;
  primary_game_system_id: string | null;
  created_at: string;
  updated_at: string;
};

type ProjectMemberRow = {
  project_id: string;
  user_id: string;
  role: ProjectRole;
  created_at: string;
  updated_at?: string;
};

export type ProjectListItem = ProjectRow & {
  role: ProjectRole | null;
  joined_at: string | null;
};

export type ProjectDetail = ProjectRow & {
  role: ProjectRole | null;
  primaryGameSystem: ProjectGameSystemSummary | null;
};

export type ProjectGameSystemSummary = {
  id: string;
  name: string;
  edition: string | null;
  publisher: string | null;
  visibility: string;
};

export type GameSystemForProjectForm = ProjectGameSystemSummary & {
  created_at: string;
};

async function getSignedInUserId(supabase: SupabaseClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return user.id;
}

export async function getProjectsForCurrentUser(): Promise<ProjectListItem[]> {
  if (!hasSupabaseEnv()) {
    redirect("/login");
  }

  const supabase = await createClient();
  const userId = await getSignedInUserId(supabase);

  const { data: membershipRows, error: membershipError } = await supabase
    .from("project_members")
    .select("project_id, user_id, role, created_at, updated_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (membershipError) {
    throw membershipError;
  }

  const memberships = (membershipRows ?? []) as ProjectMemberRow[];
  const projectIds = memberships.map((membership) => membership.project_id);

  if (projectIds.length === 0) {
    return [];
  }

  const { data: projectRows, error: projectsError } = await selectProjectsByIds(
    supabase,
    projectIds,
  );

  if (projectsError) {
    throw projectsError;
  }

  const membershipByProjectId = new Map(
    memberships.map((membership) => [membership.project_id, membership]),
  );

  return (projectRows ?? []).map((project) => {
    const membership = membershipByProjectId.get(project.id);

    return {
      ...project,
      role: membership?.role ?? null,
      joined_at: membership?.created_at ?? null,
    };
  });
}

export async function getProjectById(projectId: string): Promise<ProjectDetail | null> {
  if (!hasSupabaseEnv()) {
    redirect("/login");
  }

  const supabase = await createClient();
  const userId = await getSignedInUserId(supabase);

  const { data: project, error: projectError } = await selectProjectById(
    supabase,
    projectId,
  );

  if (projectError) {
    throw projectError;
  }

  if (!project) {
    return null;
  }

  const { data: membership, error: membershipError } = await supabase
    .from("project_members")
    .select("project_id, user_id, role, created_at, updated_at")
    .eq("project_id", project.id)
    .eq("user_id", userId)
    .maybeSingle<ProjectMemberRow>();

  if (membershipError) {
    throw membershipError;
  }

  const primaryGameSystem = project.primary_game_system_id
    ? await getProjectGameSystemSummary(supabase, project.primary_game_system_id)
    : null;

  return {
    ...project,
    role: membership?.role ?? null,
    primaryGameSystem,
  };
}

export async function getGameSystemsForProjectForm(): Promise<
  GameSystemForProjectForm[]
> {
  if (!hasSupabaseEnv()) {
    redirect("/login");
  }

  const supabase = await createClient();
  await getSignedInUserId(supabase);

  const { data, error } = await supabase
    .from("game_systems")
    .select(GAME_SYSTEM_FORM_COLUMNS)
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as GameSystemForProjectForm[];
}

export function formatProjectRole(role: ProjectRole | null) {
  if (!role) {
    return "Member";
  }

  if (role.toLowerCase() === "gm") {
    return "GM";
  }

  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}

async function selectProjectsByIds(
  supabase: SupabaseClient,
  projectIds: string[],
) {
  const withPrimarySystem = await supabase
    .from("projects")
    .select(PROJECT_COLUMNS)
    .in("id", projectIds)
    .order("created_at", { ascending: false });

  if (!isMissingPrimaryGameSystemColumnError(withPrimarySystem.error)) {
    return {
      data: (withPrimarySystem.data ?? []) as ProjectRow[],
      error: withPrimarySystem.error,
    };
  }

  const legacy = await supabase
    .from("projects")
    .select(LEGACY_PROJECT_COLUMNS)
    .in("id", projectIds)
    .order("created_at", { ascending: false });

  return {
    data: ((legacy.data ?? []) as Omit<ProjectRow, "primary_game_system_id">[]).map(
      (project) => ({
        ...project,
        primary_game_system_id: null,
      }),
    ),
    error: legacy.error,
  };
}

async function selectProjectById(supabase: SupabaseClient, projectId: string) {
  const withPrimarySystem = await supabase
    .from("projects")
    .select(PROJECT_COLUMNS)
    .eq("id", projectId)
    .maybeSingle<ProjectRow>();

  if (!isMissingPrimaryGameSystemColumnError(withPrimarySystem.error)) {
    return withPrimarySystem;
  }

  const legacy = await supabase
    .from("projects")
    .select(LEGACY_PROJECT_COLUMNS)
    .eq("id", projectId)
    .maybeSingle<Omit<ProjectRow, "primary_game_system_id">>();

  return {
    data: legacy.data ? { ...legacy.data, primary_game_system_id: null } : null,
    error: legacy.error,
  };
}

async function getProjectGameSystemSummary(
  supabase: SupabaseClient,
  gameSystemId: string,
) {
  const { data, error } = await supabase
    .from("game_systems")
    .select("id, name, edition, publisher, visibility")
    .eq("id", gameSystemId)
    .maybeSingle<ProjectGameSystemSummary>();

  if (error) {
    throw error;
  }

  return data;
}

export function isMissingPrimaryGameSystemColumnError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const record = error as { code?: string; message?: string };
  const message = record.message ?? "";

  return (
    record.code === "42703" ||
    record.code === "PGRST204" ||
    message.includes("primary_game_system_id")
  );
}
