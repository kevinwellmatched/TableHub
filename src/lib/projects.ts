import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export type ProjectRole = "owner" | "gm" | "player" | "viewer" | string;

export type ProjectRow = {
  id: string;
  name: string;
  description: string | null;
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

  const { data: projectRows, error: projectsError } = await supabase
    .from("projects")
    .select("id, name, description, created_at, updated_at")
    .in("id", projectIds)
    .order("created_at", { ascending: false });

  if (projectsError) {
    throw projectsError;
  }

  const membershipByProjectId = new Map(
    memberships.map((membership) => [membership.project_id, membership]),
  );

  return ((projectRows ?? []) as ProjectRow[]).map((project) => {
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

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id, name, description, created_at, updated_at")
    .eq("id", projectId)
    .maybeSingle<ProjectRow>();

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

  return {
    ...project,
    role: membership?.role ?? null,
  };
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
