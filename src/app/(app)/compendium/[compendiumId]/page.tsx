import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Boxes,
  ClipboardList,
  FileArchive,
  FileText,
  FolderTree,
  GitBranch,
  Layers,
  Tags,
  type LucideIcon,
} from "lucide-react";

import { SectionCard } from "@/components/section-card";
import {
  formatCompendiumSourceType,
  formatCompendiumVisibility,
  getCompendiumById,
  type CompendiumDetail,
} from "@/lib/compendiums";
import {
  getMasterEntriesByCompendiumId,
  type MasterEntryListItem,
} from "@/lib/master-entries";

type CompendiumDetailPageProps = {
  params: Promise<{
    compendiumId: string;
  }>;
};

const futureCompendiumSections = [
  {
    title: "Entries",
    description: "Spells, monsters, items, rules notes, and lore records come later.",
    meta: "Later slice",
    icon: Layers,
  },
  {
    title: "Tags & Folders",
    description: "Future organization tools will make large libraries easier to browse.",
    meta: "Later slice",
    icon: Tags,
  },
  {
    title: "Project Links",
    description: "Projects will use linked copies with overrides instead of editing masters.",
    meta: "Overrides later",
    icon: GitBranch,
  },
  {
    title: "Imports",
    description: "Any future import flow must track source, license, and provenance.",
    meta: "No imports yet",
    icon: FileArchive,
  },
];

export default async function CompendiumDetailPage({
  params,
}: CompendiumDetailPageProps) {
  const { compendiumId } = await params;
  const compendium = await getCompendiumById(compendiumId);

  if (!compendium) {
    return <CompendiumUnavailableState />;
  }

  const masterEntries = await getMasterEntriesByCompendiumId(compendiumId);

  return (
    <div className="space-y-8">
      <Link
        href="/compendium"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#FCA311] transition hover:text-[#ffb33c]"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back to Compendium
      </Link>

      <section className="rounded-lg border border-[#FCA311]/30 bg-[#FCA311]/10 p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#FCA311]">
              Master compendium
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal text-[var(--text-main)] sm:text-4xl">
              {compendium.name}
            </h1>
            <p className="mt-3 text-base leading-7 text-[var(--text-muted)]">
              {compendium.description ||
                "This master compendium does not have a description yet. It is a reusable library container for future entries and project links."}
            </p>
          </div>

          <div className="grid gap-3 rounded-lg border border-[var(--line)] bg-black/25 p-4 sm:grid-cols-2 lg:min-w-80">
            <HeroMeta
              label="Visibility"
              value={formatCompendiumVisibility(compendium.visibility)}
            />
            <HeroMeta label="Version" value={compendium.version} />
            <HeroMeta
              label="Source"
              value={formatCompendiumSourceType(compendium.source_type)}
            />
            <HeroMeta
              label="System"
              value={compendium.gameSystem?.name || "System unavailable"}
            />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-[var(--line)] bg-[var(--panel-bg)] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.2)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#FCA311]/30 bg-[#14213D] text-[#FCA311]">
            <BookOpen aria-hidden="true" className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-main)]">
              Entries are coming later
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
              Slice 4B creates the master compendium container only. No spells,
              monsters, classes, items, SRD entries, book text, or imported rules
              content exist here yet.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <InfoPanel title="Compendium metadata" icon={Boxes}>
          <MetadataGrid compendium={compendium} />
        </InfoPanel>

        <InfoPanel title="Source and provenance" icon={ClipboardList}>
          <dl className="space-y-4">
            <DetailItem label="License name" value={compendium.license_name || "Not set"} />
            <DetailItem
              label="License URL"
              value={
                compendium.license_url ? (
                  <SafeLink href={compendium.license_url}>
                    {compendium.license_url}
                  </SafeLink>
                ) : (
                  "Not set"
                )
              }
            />
            <DetailItem
              label="Source type"
              value={formatCompendiumSourceType(compendium.source_type)}
            />
            <DetailItem
              label="Source URL"
              value={
                compendium.source_url ? (
                  <SafeLink href={compendium.source_url}>
                    {compendium.source_url}
                  </SafeLink>
                ) : (
                  "Not set"
                )
              }
            />
            <DetailItem label="Source notes" value={compendium.source_notes || "Not set"} />
          </dl>
        </InfoPanel>
      </section>

      <section>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#FCA311]/30 bg-[#14213D] text-[#FCA311]">
              <FileText aria-hidden="true" className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[var(--text-main)]">
                Master Entries
              </h2>
              <p className="text-sm text-[var(--text-muted)]">
                Basic entries are original master records. Project overrides come
                later.
              </p>
            </div>
          </div>
          <Link
            href="/master-entries/new"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#FCA311]/50 px-4 text-sm font-semibold text-[#FCA311] transition hover:bg-[#FCA311] hover:text-black"
          >
            Create Master Entry
          </Link>
        </div>

        {masterEntries.length > 0 ? (
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {masterEntries.map((entry) => (
              <ParentMasterEntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-lg border border-[var(--line)] bg-black/15 p-4 text-sm text-[var(--text-muted)]">
            No Master Entries belong to this Compendium yet.
          </p>
        )}
      </section>

      <section>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#FCA311]/30 bg-[#14213D] text-[#FCA311]">
            <FolderTree aria-hidden="true" className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[var(--text-main)]">
              Future compendium sections
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              These areas are placeholders until entries, organization, imports, and
              project linking are designed.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {futureCompendiumSections.map((section) => (
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

function ParentMasterEntryCard({ entry }: { entry: MasterEntryListItem }) {
  return (
    <article className="rounded-lg border border-[var(--line)] bg-[var(--panel-bg)] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.2)]">
      <h3 className="text-lg font-semibold text-[var(--text-main)]">
        {entry.title}
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--text-muted)]">
        {entry.summary || "No summary yet."}
      </p>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#FCA311]/85">
        {entry.entryType?.name || "Entry Type unavailable"} - v{entry.version}
      </p>
      <Link
        href={`/master-entries/${entry.id}`}
        className="mt-4 inline-flex h-10 items-center justify-center rounded-lg border border-[#FCA311]/50 px-4 text-sm font-semibold text-[#FCA311] transition hover:bg-[#FCA311] hover:text-black"
      >
        Open Master Entry
      </Link>
    </article>
  );
}

function MetadataGrid({ compendium }: { compendium: CompendiumDetail }) {
  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      <DetailItem label="Name" value={compendium.name} />
      <DetailItem label="Slug" value={compendium.slug} />
      <DetailItem
        label="Game system"
        value={compendium.gameSystem?.name || "System unavailable"}
      />
      <DetailItem
        label="Visibility"
        value={formatCompendiumVisibility(compendium.visibility)}
      />
      <DetailItem
        label="Source type"
        value={formatCompendiumSourceType(compendium.source_type)}
      />
      <DetailItem label="Version" value={compendium.version} />
      <DetailItem label="Created" value={dateFormatter.format(new Date(compendium.created_at))} />
      <DetailItem label="Updated" value={dateFormatter.format(new Date(compendium.updated_at))} />
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

function CompendiumUnavailableState() {
  return (
    <div className="space-y-8">
      <Link
        href="/compendium"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#FCA311] transition hover:text-[#ffb33c]"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back to Compendium
      </Link>

      <section className="rounded-lg border border-[#FCA311]/30 bg-[#FCA311]/10 p-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-2xl font-semibold text-[var(--text-main)]">
            Compendium not found
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
            This compendium does not exist, or your account does not have access to it.
            Compendium access is protected by Supabase Row Level Security.
          </p>
          <Link
            href="/compendium"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-[#FCA311] px-4 text-sm font-semibold text-black transition hover:bg-[#ffb33c]"
          >
            Return to Compendium
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
