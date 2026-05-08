import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  BookOpen,
  Database,
  Library,
  LinkIcon,
  Trash2,
} from "lucide-react";

import {
  attachProjectSourceAction,
  removeProjectSourceAction,
} from "@/lib/project-source-actions";
import {
  formatProjectSourceType,
  type ProjectSourceType,
} from "@/lib/project-source-validation";
import {
  getProjectSourceOptions,
  getProjectSources,
  type ProjectSourceOption,
  type ProjectSourceRow,
} from "@/lib/project-sources";
import { formatProjectRole, getProjectById } from "@/lib/projects";

type ProjectSourcesPageProps = {
  params: Promise<{
    projectId: string;
  }>;
  searchParams: Promise<{
    status?: string;
    message?: string;
  }>;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const sourceTypeIcons = {
  game_system: Database,
  compendium: BookOpen,
  settings_library: Library,
} satisfies Record<ProjectSourceType, LucideIcon>;

export const dynamic = "force-dynamic";

export default async function ProjectSourcesPage({
  params,
  searchParams,
}: ProjectSourcesPageProps) {
  const { projectId } = await params;
  const messageParams = await searchParams;
  const project = await getProjectById(projectId);

  if (!project) {
    return <ProjectSourcesUnavailableState />;
  }

  const [sources, options] = await Promise.all([
    getProjectSources(projectId),
    getProjectSourceOptions(projectId, project.primary_game_system_id),
  ]);
  const canManageSources = ["owner", "gm"].includes(
    (project.role ?? "").toLowerCase(),
  );

  return (
    <div className="space-y-8">
      <Link
        href={`/projects/${project.id}`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#FCA311] transition hover:text-[#ffb33c]"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back to Project
      </Link>

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
              Attach accessible Library Sources to this Project without changing
              the master records. When a primary System is set, compatible
              Compendiums and Settings Libraries are shown first.
            </p>
          </div>

          <div className="rounded-lg border border-[var(--line)] bg-black/25 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#FCA311]">
              Your role
            </p>
            <p className="mt-2 text-lg font-semibold text-[var(--text-main)]">
              {formatProjectRole(project.role)}
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#FCA311]">
              Primary System
            </p>
            <p className="mt-2 text-sm font-semibold text-[var(--text-main)]">
              {project.primaryGameSystem?.name || "Not set"}
            </p>
            <Link
              href={`/projects/${project.id}/library`}
              className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#FCA311] px-4 text-sm font-semibold text-black transition hover:bg-[#ffb33c]"
            >
              <BookOpen aria-hidden="true" className="h-4 w-4" />
              Open Project Library
            </Link>
          </div>
        </div>
      </section>

      {messageParams.message ? (
        <MessageBanner
          status={messageParams.status === "success" ? "success" : "error"}
          message={messageParams.message}
        />
      ) : null}

      <section className="space-y-4">
        <SectionHeading
          title="Attached Library Sources"
          description="These source links are the Project Library foundation for project-specific linked copies and overrides in later slices."
        />

        {sources.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-3">
            {sources.map((source) => (
              <ProjectSourceCard
                key={source.id}
                source={source}
                canManageSources={canManageSources}
              />
            ))}
          </div>
        ) : (
          <EmptySourcesState />
        )}
      </section>

      {canManageSources ? (
        <section className="space-y-4">
          <SectionHeading
            title="Attach a Library Source"
            description={
              project.primaryGameSystem
                ? `Only readable sources matching ${project.primaryGameSystem.name}, plus system-neutral Settings Libraries, appear here.`
                : "Only sources your account can read through Supabase RLS appear here. Selecting a primary System later will narrow future source choices."
            }
          />

          <div className="grid gap-4 lg:grid-cols-3">
            <AttachSourceForm
              projectId={project.id}
              sourceType="game_system"
              title="Game System"
              options={options.gameSystems}
            />
            <AttachSourceForm
              projectId={project.id}
              sourceType="compendium"
              title="Compendium"
              options={options.compendiums}
            />
            <AttachSourceForm
              projectId={project.id}
              sourceType="settings_library"
              title="Settings Library"
              options={options.settingsLibraries}
            />
          </div>
        </section>
      ) : (
        <section className="rounded-lg border border-[var(--line)] bg-[var(--panel-bg)] p-5">
          <p className="text-sm leading-6 text-[var(--text-muted)]">
            Project Library management is available to Project Owners and GMs.
            Supabase RLS still protects the real attach and remove permissions.
          </p>
        </section>
      )}
    </div>
  );
}

function ProjectSourceCard({
  source,
  canManageSources,
}: {
  source: ProjectSourceRow;
  canManageSources: boolean;
}) {
  const Icon = sourceTypeIcons[source.source_type];

  return (
    <article className="rounded-lg border border-[var(--line)] bg-[var(--panel-bg)] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.2)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#FCA311]/30 bg-[#14213D] text-[#FCA311]">
          <Icon aria-hidden="true" className="h-5 w-5" />
        </div>
        <span className="rounded-md border border-[var(--line)] bg-black/25 px-2 py-1 text-xs font-medium text-[#FCA311]">
          {formatProjectSourceType(source.source_type)}
        </span>
      </div>

      <h2 className="mt-5 text-lg font-semibold text-[var(--text-main)]">
        {source.source_name}
      </h2>
      <dl className="mt-4 space-y-2 text-sm text-[var(--text-muted)]">
        <div className="flex items-center justify-between gap-4">
          <dt>Version</dt>
          <dd className="font-medium text-[var(--text-main)]">
            {source.source_version || "Not set"}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt>Attached</dt>
          <dd className="font-medium text-[var(--text-main)]">
            {dateFormatter.format(new Date(source.created_at))}
          </dd>
        </div>
      </dl>

      {canManageSources ? (
        <form action={removeProjectSourceAction} className="mt-5">
          <input type="hidden" name="projectId" value={source.project_id} />
          <input type="hidden" name="projectSourceId" value={source.id} />
          <button
            type="submit"
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[var(--line)] px-4 text-sm font-semibold text-[var(--text-main)] transition hover:border-[#FCA311]/70 hover:text-[#FCA311]"
          >
            <Trash2 aria-hidden="true" className="h-4 w-4" />
            Remove
          </button>
        </form>
      ) : null}
    </article>
  );
}

function AttachSourceForm({
  projectId,
  sourceType,
  title,
  options,
}: {
  projectId: string;
  sourceType: ProjectSourceType;
  title: string;
  options: ProjectSourceOption[];
}) {
  const Icon = sourceTypeIcons[sourceType];
  const selectId = `${sourceType}-source-id`;

  return (
    <form
      action={attachProjectSourceAction}
      className="rounded-lg border border-[var(--line)] bg-[var(--panel-bg)] p-5"
    >
      <input type="hidden" name="projectId" value={projectId} />
      <input type="hidden" name="sourceType" value={sourceType} />

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#FCA311]/30 bg-[#14213D] text-[#FCA311]">
          <Icon aria-hidden="true" className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-semibold text-[var(--text-main)]">
          {title}
        </h2>
      </div>

      <label className="mt-5 block" htmlFor={selectId}>
        <span className="text-sm font-medium text-[var(--text-main)]">
          Source
        </span>
        <select
          id={selectId}
          name="sourceId"
          defaultValue=""
          disabled={options.length === 0}
          className="mt-2 h-11 w-full rounded-lg border border-[var(--line)] bg-black/25 px-3 text-sm text-[var(--text-main)] outline-none transition focus:border-[#FCA311] focus:ring-2 focus:ring-[#FCA311]/20 disabled:cursor-not-allowed disabled:opacity-65"
        >
          <option value="" disabled>
            {options.length > 0 ? `Choose ${title}` : `No ${title} sources available`}
          </option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {formatSourceOption(option)}
            </option>
          ))}
        </select>
      </label>

      <button
        type="submit"
        disabled={options.length === 0}
        className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#FCA311] px-4 text-sm font-semibold text-black transition hover:bg-[#ffb33c] disabled:cursor-not-allowed disabled:opacity-65"
      >
        <LinkIcon aria-hidden="true" className="h-4 w-4" />
        Attach
      </button>
    </form>
  );
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-[var(--text-main)]">{title}</h2>
      <p className="mt-1 text-sm text-[var(--text-muted)]">{description}</p>
    </div>
  );
}

function EmptySourcesState() {
  return (
    <section className="rounded-lg border border-[#FCA311]/30 bg-[#FCA311]/10 p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-[#FCA311] text-black">
        <LinkIcon aria-hidden="true" className="h-6 w-6" />
      </div>
      <h2 className="mt-5 text-2xl font-semibold text-[var(--text-main)]">
        No Library Sources attached
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
        Attach a Game System, Compendium, or Settings Library to start building
        this Project Library from safe master content.
      </p>
    </section>
  );
}

function MessageBanner({
  status,
  message,
}: {
  status: "success" | "error";
  message: string;
}) {
  const isSuccess = status === "success";

  return (
    <section
      className={
        isSuccess
          ? "rounded-lg border border-emerald-400/30 bg-emerald-500/10 p-4 text-sm text-emerald-100"
          : "rounded-lg border border-[#FCA311]/30 bg-[#FCA311]/10 p-4 text-sm text-[#FCA311]"
      }
    >
      {message}
    </section>
  );
}

function ProjectSourcesUnavailableState() {
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
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-2xl font-semibold text-[var(--text-main)]">
            Project unavailable
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
            This Project was not found, or your account does not have access to it.
            Project access is protected by Supabase Row Level Security.
          </p>
          <Link
            href="/projects"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-[#FCA311] px-4 text-sm font-semibold text-black transition hover:bg-[#ffb33c]"
          >
            Return to Projects
          </Link>
        </div>
      </section>
    </div>
  );
}

function formatSourceOption(option: ProjectSourceOption) {
  return option.version ? `${option.name} (${option.version})` : option.name;
}
