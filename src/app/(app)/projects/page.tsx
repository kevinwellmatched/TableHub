import Link from "next/link";
import { CalendarDays, FolderPlus, ShieldCheck } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import {
  formatProjectRole,
  getProjectsForCurrentUser,
  type ProjectListItem,
} from "@/lib/projects";

export const dynamic = "force-dynamic";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export default async function ProjectsPage() {
  const projects = await getProjectsForCurrentUser();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <PageHeader
          title="Projects"
          description="Projects are reusable workspaces for a table. They will eventually hold campaigns, systems, compendiums, Settings Library sources, files, permissions, and safe project-specific overrides."
        />

        <Link
          href="/projects/new"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#FCA311] px-4 text-sm font-semibold text-black transition hover:bg-[#ffb33c]"
        >
          <FolderPlus aria-hidden="true" className="h-4 w-4" />
          Create Project
        </Link>
      </div>

      {projects.length > 0 ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </section>
      ) : (
        <EmptyProjectsState />
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: ProjectListItem }) {
  return (
    <article className="group flex min-h-64 flex-col rounded-lg border border-[var(--line)] bg-[var(--panel-bg)] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.2)] transition duration-200 hover:-translate-y-1 hover:border-[#FCA311]/70 hover:bg-[var(--panel-bg-hover)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#FCA311]/30 bg-[#14213D] text-[#FCA311] transition group-hover:border-[#FCA311] group-hover:bg-[#FCA311] group-hover:text-black">
          <ShieldCheck aria-hidden="true" className="h-5 w-5" />
        </div>
        <span className="rounded-md border border-[var(--line)] bg-black/25 px-2 py-1 text-xs font-medium text-[#FCA311]">
          {formatProjectRole(project.role)}
        </span>
      </div>

      <h2 className="mt-5 text-xl font-semibold tracking-normal text-[var(--text-main)]">
        {project.name}
      </h2>
      <p className="mt-2 line-clamp-4 text-sm leading-6 text-[var(--text-muted)]">
        {project.description || "No description yet."}
      </p>

      <div className="mt-auto pt-5">
        <p className="flex items-center gap-2 border-t border-[var(--line)] pt-4 text-xs font-medium uppercase tracking-[0.14em] text-[#FCA311]/85">
          <CalendarDays aria-hidden="true" className="h-4 w-4" />
          Created {dateFormatter.format(new Date(project.created_at))}
        </p>
        <Link
          href={`/projects/${project.id}`}
          className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg border border-[#FCA311]/50 px-4 text-sm font-semibold text-[#FCA311] transition hover:bg-[#FCA311] hover:text-black"
        >
          Open project
        </Link>
      </div>
    </article>
  );
}

function EmptyProjectsState() {
  return (
    <section className="rounded-lg border border-[#FCA311]/30 bg-[#FCA311]/10 p-8">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-[#FCA311] text-black">
          <FolderPlus aria-hidden="true" className="h-6 w-6" />
        </div>
        <h2 className="mt-5 text-2xl font-semibold text-[var(--text-main)]">
          No projects yet
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
          Create your first private workspace for a table. Campaigns, compendiums,
          Settings Library sources, files, and overrides will attach here in later
          slices.
        </p>
        <Link
          href="/projects/new"
          className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#FCA311] px-4 text-sm font-semibold text-black transition hover:bg-[#ffb33c]"
        >
          <FolderPlus aria-hidden="true" className="h-4 w-4" />
          Create your first project
        </Link>
      </div>
    </section>
  );
}
