import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  BookOpen,
  Boxes,
  Database,
  Dice5,
  FileText,
  Library,
  LinkIcon,
  Search,
  ScrollText,
  UsersRound,
  WandSparkles,
} from "lucide-react";

import { SectionCard } from "@/components/section-card";
import {
  formatProjectSourceType,
  type ProjectSourceType,
} from "@/lib/project-source-validation";
import {
  getProjectSources,
  type ProjectSourceRow,
} from "@/lib/project-sources";
import { formatProjectRole, getProjectById } from "@/lib/projects";

type ProjectDetailPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

const futureProjectSections = [
  {
    title: "Campaigns",
    description: "Active play spaces will live inside this Project.",
    meta: "Coming in a later slice",
    icon: UsersRound,
  },
  {
    title: "Compendiums",
    description: "Rules and reference libraries will attach as linked sources.",
    meta: "Linked copies later",
    icon: BookOpen,
  },
  {
    title: "Settings Library",
    description: "Reusable lore, places, factions, NPCs, and secrets will connect here.",
    meta: "Source links later",
    icon: Library,
  },
  {
    title: "Characters",
    description: "Player and GM character binders will connect through campaigns.",
    meta: "Sheets later",
    icon: ScrollText,
  },
  {
    title: "Files",
    description: "Maps, handouts, portraits, PDFs, and other assets will collect here.",
    meta: "Storage later",
    icon: FileText,
  },
  {
    title: "Search & Links",
    description: "Project-scoped search and wiki links will respect permissions.",
    meta: "Permission-aware later",
    icon: Search,
  },
  {
    title: "Dice & Session Tools",
    description: "Rolls, session prep, and table utilities will become quick actions.",
    meta: "Plain results first",
    icon: Dice5,
  },
  {
    title: "Project Overrides",
    description: "House rules and table-specific changes will avoid mutating master content.",
    meta: "Core architecture",
    icon: WandSparkles,
  },
];

const sourceTypeIcons = {
  game_system: Database,
  compendium: BookOpen,
  settings_library: Library,
} satisfies Record<ProjectSourceType, LucideIcon>;

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { projectId } = await params;
  const project = await getProjectById(projectId);

  if (!project) {
    return <ProjectUnavailableState />;
  }

  const sources = await getProjectSources(project.id);

  return (
    <div className="space-y-8">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#FCA311] transition hover:text-[#ffb33c]"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back to Projects
      </Link>

      <section className="rounded-lg border border-[#FCA311]/30 bg-[#FCA311]/10 p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#FCA311]">
              Project command center
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal text-[var(--text-main)] sm:text-4xl">
              {project.name}
            </h1>
            <p className="mt-3 text-base leading-7 text-[var(--text-muted)]">
              {project.description ||
                "This Project does not have a description yet. Use it as the safe workspace for future campaigns, linked libraries, files, permissions, and overrides."}
            </p>
          </div>

          <div className="rounded-lg border border-[var(--line)] bg-black/25 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#FCA311]">
              Your role
            </p>
            <p className="mt-2 text-lg font-semibold text-[var(--text-main)]">
              {formatProjectRole(project.role)}
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#FCA311]/30 bg-[#14213D] text-[#FCA311]">
              <LinkIcon aria-hidden="true" className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[var(--text-main)]">
                Project Sources
              </h2>
              <p className="text-sm text-[var(--text-muted)]">
                Linked master sources attached to this Project.
              </p>
            </div>
          </div>

          <Link
            href={`/projects/${project.id}/sources`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#FCA311]/50 px-4 text-sm font-semibold text-[#FCA311] transition hover:bg-[#FCA311] hover:text-black"
          >
            <LinkIcon aria-hidden="true" className="h-4 w-4" />
            Manage Sources
          </Link>
        </div>

        {sources.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sources.map((source) => (
              <ProjectSourceSummaryCard key={source.id} source={source} />
            ))}
          </div>
        ) : (
          <section className="rounded-lg border border-[#FCA311]/30 bg-[#FCA311]/10 p-6">
            <p className="text-sm leading-6 text-[var(--text-muted)]">
              No sources are attached yet. Add a Game System, Compendium, or
              Settings Library when this Project is ready for linked master content.
            </p>
          </section>
        )}
      </section>

      <section>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#FCA311]/30 bg-[#14213D] text-[#FCA311]">
            <Boxes aria-hidden="true" className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[var(--text-main)]">
              Future project sections
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              These are placeholders for the workspace areas this Project will grow into.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {futureProjectSections.map((section) => (
            <SectionCard
              key={section.title}
              title={section.title}
              description={section.description}
              meta={section.meta}
              icon={section.icon}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function ProjectSourceSummaryCard({ source }: { source: ProjectSourceRow }) {
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
      <h3 className="mt-5 text-lg font-semibold text-[var(--text-main)]">
        {source.source_name}
      </h3>
      <p className="mt-2 text-sm text-[var(--text-muted)]">
        Version {source.source_version || "not set"}
      </p>
    </article>
  );
}

function ProjectUnavailableState() {
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
