import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Boxes,
  ClipboardList,
  FileArchive,
  GitBranch,
  History,
  LibraryBig,
  ScrollText,
  Share2,
  type LucideIcon,
} from "lucide-react";

import { SectionCard } from "@/components/section-card";
import {
  formatGameSystemSourceType,
  formatGameSystemVisibility,
  getGameSystemById,
  type GameSystemRow,
} from "@/lib/game-systems";

type SystemDetailPageProps = {
  params: Promise<{
    systemId: string;
  }>;
};

const futureSystemSections = [
  {
    title: "Compendiums",
    description: "Rules and reference libraries will connect to this system later.",
    meta: "Slice 4B",
    icon: BookOpen,
  },
  {
    title: "Character Sheet Templates",
    description: "System-specific sheets and custom templates will start here.",
    meta: "Future sheets",
    icon: ScrollText,
  },
  {
    title: "Rule Modules",
    description: "Optional rules, variants, and table modules will stay organized.",
    meta: "Future rules",
    icon: LibraryBig,
  },
  {
    title: "Source Imports",
    description: "SRD, private Markdown, PDF, CSV, and copy/paste imports will be tracked.",
    meta: "No imports yet",
    icon: FileArchive,
  },
  {
    title: "Project Links",
    description: "Projects will link to systems instead of mutating master records.",
    meta: "Overrides later",
    icon: GitBranch,
  },
  {
    title: "Public/Sharing Settings",
    description: "Shared visibility is reserved until collaboration rules are built.",
    meta: "RLS guarded",
    icon: Share2,
  },
  {
    title: "Version History",
    description: "System changes will eventually be easy to review and compare.",
    meta: "Future audit trail",
    icon: History,
  },
];

export default async function SystemDetailPage({ params }: SystemDetailPageProps) {
  const { systemId } = await params;
  const system = await getGameSystemById(systemId);

  if (!system) {
    return <SystemUnavailableState />;
  }

  return (
    <div className="space-y-8">
      <Link
        href="/systems"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#FCA311] transition hover:text-[#ffb33c]"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back to Systems
      </Link>

      <section className="rounded-lg border border-[#FCA311]/30 bg-[#FCA311]/10 p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#FCA311]">
              System command center
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal text-[var(--text-main)] sm:text-4xl">
              {system.name}
            </h1>
            <p className="mt-3 text-base leading-7 text-[var(--text-muted)]">
              {system.description ||
                "This system does not have a description yet. Use it as the master ruleset foundation for future compendiums, templates, imports, and project links."}
            </p>
          </div>

          <div className="grid gap-3 rounded-lg border border-[var(--line)] bg-black/25 p-4 sm:grid-cols-2 lg:min-w-80">
            <HeroMeta label="Visibility" value={formatGameSystemVisibility(system.visibility)} />
            <HeroMeta label="Version" value={system.version} />
            <HeroMeta label="Source" value={formatGameSystemSourceType(system.source_type)} />
            <HeroMeta label="Slug" value={system.slug} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <InfoPanel title="System metadata" icon={Boxes}>
          <MetadataGrid system={system} />
        </InfoPanel>

        <InfoPanel title="Provenance" icon={ClipboardList}>
          <dl className="space-y-4">
            <DetailItem label="License name" value={system.license_name || "Not set"} />
            <DetailItem
              label="License URL"
              value={
                system.license_url ? (
                  <SafeLink href={system.license_url}>{system.license_url}</SafeLink>
                ) : (
                  "Not set"
                )
              }
            />
            <DetailItem label="Source type" value={formatGameSystemSourceType(system.source_type)} />
            <DetailItem
              label="Source URL"
              value={
                system.source_url ? (
                  <SafeLink href={system.source_url}>{system.source_url}</SafeLink>
                ) : (
                  "Not set"
                )
              }
            />
            <DetailItem label="Source notes" value={system.source_notes || "Not set"} />
          </dl>
        </InfoPanel>
      </section>

      <section>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#FCA311]/30 bg-[#14213D] text-[#FCA311]">
            <Boxes aria-hidden="true" className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[var(--text-main)]">
              Future system sections
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              This page is the future command center for reusable system content.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {futureSystemSections.map((section) => (
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

function MetadataGrid({ system }: { system: GameSystemRow }) {
  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      <DetailItem label="Name" value={system.name} />
      <DetailItem label="Edition" value={system.edition || "Not set"} />
      <DetailItem label="Publisher" value={system.publisher || "Not set"} />
      <DetailItem
        label="Ruleset year"
        value={system.ruleset_year ? String(system.ruleset_year) : "Not set"}
      />
      <DetailItem label="Visibility" value={formatGameSystemVisibility(system.visibility)} />
      <DetailItem label="Source type" value={formatGameSystemSourceType(system.source_type)} />
      <DetailItem label="Version" value={system.version} />
      <DetailItem label="Updated" value={dateFormatter.format(new Date(system.updated_at))} />
    </dl>
  );
}

function InfoPanel({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-[var(--line)] bg-[var(--panel-bg)] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.2)]">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#FCA311]/30 bg-[#14213D] text-[#FCA311]">
          <Icon aria-hidden="true" className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-semibold text-[var(--text-main)]">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function HeroMeta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#FCA311]">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-semibold text-[var(--text-main)]">
        {value}
      </p>
    </div>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[#FCA311]/80">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm leading-6 text-[var(--text-main)]">
        {value}
      </dd>
    </div>
  );
}

function SafeLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-[#FCA311] underline-offset-4 hover:underline"
    >
      {children}
    </a>
  );
}

function SystemUnavailableState() {
  return (
    <div className="space-y-8">
      <Link
        href="/systems"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#FCA311] transition hover:text-[#ffb33c]"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back to Systems
      </Link>

      <section className="rounded-lg border border-[#FCA311]/30 bg-[#FCA311]/10 p-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-2xl font-semibold text-[var(--text-main)]">
            System unavailable
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
            This Game System was not found, or your account does not have access to it.
            System access is protected by Supabase Row Level Security.
          </p>
          <Link
            href="/systems"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-[#FCA311] px-4 text-sm font-semibold text-black transition hover:bg-[#ffb33c]"
          >
            Return to Systems
          </Link>
        </div>
      </section>
    </div>
  );
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});
