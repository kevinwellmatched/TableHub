import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, BookOpen, FileText, Library, LinkIcon } from "lucide-react";

import {
  getProjectLibraryEntries,
  type ProjectLibraryEntryListItem,
} from "@/lib/project-entry-override-data";
import {
  formatProjectLibraryResolvedVisibility,
  type ProjectLibraryReadEntry,
  type ProjectLibraryResolvedVisibility,
} from "@/lib/project-entry-overrides";
import {
  formatProjectSourceType,
  type ProjectSourceType,
} from "@/lib/project-source-validation";
import { formatProjectRole, getProjectById } from "@/lib/projects";

type ProjectLibraryPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

const sourceTypeIcons = {
  compendium: BookOpen,
  settings_library: Library,
} satisfies Record<EntrySourceType, LucideIcon>;

type EntrySourceType = Extract<ProjectSourceType, "compendium" | "settings_library">;

export const dynamic = "force-dynamic";

export default async function ProjectLibraryPage({
  params,
}: ProjectLibraryPageProps) {
  const { projectId } = await params;
  const project = await getProjectById(projectId);

  if (!project) {
    return <ProjectLibraryUnavailableState />;
  }

  const library = await getProjectLibraryEntries(project.id, project.role);
  const isManagementMode = library.mode === "management";

  return (
    <div className="space-y-8">
      <BackToProjectLink projectId={project.id} />

      <section className="rounded-lg border border-[#FCA311]/30 bg-[#FCA311]/10 p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#FCA311]">
              Project Library
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal text-[var(--text-main)] sm:text-4xl">
              {project.name}
            </h1>
            <p className="mt-3 text-base leading-7 text-[var(--text-muted)]">
              View Master Entries from attached Compendium and Settings Library
              sources
              {isManagementMode
                ? ", then create Project-specific overrides without changing the originals."
                : " the GM has made visible to you."}
            </p>
          </div>

          <div className="rounded-lg border border-[var(--line)] bg-black/25 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#FCA311]">
              Your role
            </p>
            <p className="mt-2 text-lg font-semibold text-[var(--text-main)]">
              {formatProjectRole(project.role)}
            </p>
            {isManagementMode ? (
              <Link
                href={`/projects/${project.id}/sources`}
                className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#FCA311]/50 px-4 text-sm font-semibold text-[#FCA311] transition hover:bg-[#FCA311] hover:text-black"
              >
                <LinkIcon aria-hidden="true" className="h-4 w-4" />
                Manage Sources
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-[var(--line)] bg-[var(--panel-bg)] p-5">
        <h2 className="text-lg font-semibold text-[var(--text-main)]">
          Attached entry sources
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
          {isManagementMode
            ? "Game System links are metadata-only for now, so this page lists entries from attached Compendiums and Settings Libraries only."
            : "This Project Library shows entries the GM has made visible to you."}
        </p>

        {library.sources.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {library.sources.map((source) => (
              <span
                key={
                  "projectSourceId" in source
                    ? source.projectSourceId
                    : `${source.sourceType}:${source.sourceId}`
                }
                className="rounded-md border border-[#FCA311]/30 bg-[#FCA311]/10 px-3 py-2 text-sm font-medium text-[#FCA311]"
              >
                {source.sourceName}
              </span>
            ))}
          </div>
        ) : null}
      </section>

      {library.entries.length > 0 ? (
        <section className="grid gap-4 lg:grid-cols-2">
          {library.mode === "management"
            ? library.entries.map((entry) => (
                <ManagementEntryCard
                  key={entry.id}
                  projectId={project.id}
                  entry={entry}
                />
              ))
            : library.entries.map((entry) => (
                <ReadEntryCard
                  key={entry.id}
                  projectId={project.id}
                  entry={entry}
                />
              ))}
        </section>
      ) : (
        <section className="rounded-lg border border-[#FCA311]/30 bg-[#FCA311]/10 p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-[#FCA311] text-black">
            <FileText aria-hidden="true" className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-2xl font-semibold text-[var(--text-main)]">
            No Project Library entries yet
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
            {isManagementMode
              ? "Attach a Compendium or Settings Library source, then create at least one Master Entry inside that source."
              : "No Project Library entries are available right now."}
          </p>
        </section>
      )}
    </div>
  );
}

function ManagementEntryCard({
  projectId,
  entry,
}: {
  projectId: string;
  entry: ProjectLibraryEntryListItem;
}) {
  return (
    <Link
      href={`/projects/${projectId}/library/${entry.id}`}
      className="rounded-lg border border-[var(--line)] bg-[var(--panel-bg)] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.2)] transition hover:border-[#FCA311]/70"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <SourceBadge sourceType={entry.source.sourceType} />
        <ProjectVisibilityBadge visibility={entry.resolvedVisibility} />
        <InheritanceBadge inherited={!entry.overrideStatus.visibility} />
      </div>
      <h2 className="mt-5 text-xl font-semibold text-[var(--text-main)]">
        {entry.effective.title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
        {entry.effective.summary || "No summary yet."}
      </p>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#FCA311]">
        {entry.source.sourceName}
      </p>
    </Link>
  );
}

function ReadEntryCard({
  projectId,
  entry,
}: {
  projectId: string;
  entry: ProjectLibraryReadEntry;
}) {
  return (
    <Link
      href={`/projects/${projectId}/library/${entry.id}`}
      className="rounded-lg border border-[var(--line)] bg-[var(--panel-bg)] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.2)] transition hover:border-[#FCA311]/70"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <SourceBadge sourceType={entry.sourceType} />
        <ReadModeBadge />
      </div>
      <h2 className="mt-5 text-xl font-semibold text-[var(--text-main)]">
        {entry.title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
        {entry.summary || "No summary yet."}
      </p>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#FCA311]">
        {entry.sourceName}
      </p>
    </Link>
  );
}

function SourceBadge({
  sourceType,
}: {
  sourceType: EntrySourceType;
}) {
  const Icon = sourceTypeIcons[sourceType];

  return (
    <span className="inline-flex items-center gap-2 rounded-md border border-[var(--line)] bg-black/25 px-2 py-1 text-xs font-medium text-[#FCA311]">
      <Icon aria-hidden="true" className="h-3.5 w-3.5" />
      {formatProjectSourceType(sourceType)}
    </span>
  );
}

function ProjectVisibilityBadge({
  visibility,
}: {
  visibility: ProjectLibraryResolvedVisibility;
}) {
  return (
    <span className="rounded-md border border-[var(--line)] bg-black/25 px-2 py-1 text-xs font-medium text-[var(--text-muted)]">
      {formatProjectLibraryResolvedVisibility(visibility)}
    </span>
  );
}

function InheritanceBadge({ inherited }: { inherited: boolean }) {
  return (
    <span className="rounded-md border border-[var(--line)] bg-black/25 px-2 py-1 text-xs font-medium text-[var(--text-muted)]">
      {inherited ? "Inherited" : "Override set"}
    </span>
  );
}

function ReadModeBadge() {
  return (
    <span className="rounded-md border border-[var(--line)] bg-black/25 px-2 py-1 text-xs font-medium text-[var(--text-muted)]">
      Project Library
    </span>
  );
}

function BackToProjectLink({ projectId }: { projectId: string }) {
  return (
    <Link
      href={`/projects/${projectId}`}
      className="inline-flex items-center gap-2 text-sm font-semibold text-[#FCA311] transition hover:text-[#ffb33c]"
    >
      <ArrowLeft aria-hidden="true" className="h-4 w-4" />
      Back to Project
    </Link>
  );
}

function ProjectLibraryUnavailableState() {
  return (
    <div className="space-y-8">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#FCA311] transition hover:text-[#ffb33c]"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back to Projects
      </Link>
      <section className="rounded-lg border border-[#FCA311]/30 bg-[#FCA311]/10 p-8">
        <h1 className="text-2xl font-semibold text-[var(--text-main)]">
          Project unavailable
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
          This Project was not found, or your account does not have access to it.
          Project access is protected by Supabase Row Level Security.
        </p>
      </section>
    </div>
  );
}
