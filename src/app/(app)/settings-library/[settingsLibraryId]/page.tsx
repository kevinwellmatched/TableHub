import Link from "next/link";
import {
  ArrowLeft,
  ClipboardList,
  Eye,
  FileArchive,
  FileText,
  FolderTree,
  GitBranch,
  Library,
  Tags,
  type LucideIcon,
} from "lucide-react";

import { MasterLibraryBreadcrumbs } from "@/components/master-library/master-library-breadcrumbs";
import { MasterLibraryLinkPanel } from "@/components/master-library/master-library-link-panel";
import { SectionCard } from "@/components/section-card";
import {
  formatSettingsLibrarySourceType,
  formatSettingsLibraryVisibility,
  getSettingsLibraryById,
  type SettingsLibraryDetail,
} from "@/lib/settings-libraries";
import {
  getMasterEntriesBySettingsLibraryId,
  type MasterEntryListItem,
} from "@/lib/master-entries";
import {
  formatLibrarySourceCategory,
  formatLibrarySourceClonePolicy,
  formatLibrarySourcePlayerVisibility,
  formatLibrarySourceSubtype,
} from "@/lib/library-source-taxonomy";

type SettingsLibraryDetailPageProps = {
  params: Promise<{
    settingsLibraryId: string;
  }>;
};

const futureSettingsLibrarySections = [
  {
    title: "Entries",
    description: "Lore pages and setting records come later.",
    meta: "Later slice",
    icon: Library,
  },
  {
    title: "Tags & Folders",
    description: "Future organization tools will make larger libraries easier to browse.",
    meta: "Later slice",
    icon: Tags,
  },
  {
    title: "Project Links",
    description:
      "Projects will attach this Library Source with linked copies and overrides.",
    meta: "Overrides later",
    icon: GitBranch,
  },
  {
    title: "Imports",
    description: "Any future import flow must track source and provenance.",
    meta: "No imports yet",
    icon: FileArchive,
  },
  {
    title: "Visibility & Reveal Tools",
    description: "Future reveal controls will protect GM-only and player-visible content.",
    meta: "Later slice",
    icon: Eye,
  },
];

export default async function SettingsLibraryDetailPage({
  params,
}: SettingsLibraryDetailPageProps) {
  const { settingsLibraryId } = await params;
  const settingsLibrary = await getSettingsLibraryById(settingsLibraryId);

  if (!settingsLibrary) {
    return <SettingsLibraryUnavailableState />;
  }

  const masterEntries =
    await getMasterEntriesBySettingsLibraryId(settingsLibraryId);

  return (
    <div className="space-y-8">
      <MasterLibraryBreadcrumbs
        items={[
          { label: "Master Library", href: "/master-library" },
          { label: "Settings Library", href: "/settings-library" },
          { label: settingsLibrary.name },
        ]}
      />

      <Link
        href="/settings-library"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#FCA311] transition hover:text-[#ffb33c]"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back to Settings Library
      </Link>

      <section className="rounded-lg border border-[#FCA311]/30 bg-[#FCA311]/10 p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#FCA311]">
              Settings Library Source
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal text-[var(--text-main)] sm:text-4xl">
              {settingsLibrary.name}
            </h1>
            <p className="mt-3 text-base leading-7 text-[var(--text-muted)]">
              {settingsLibrary.description ||
                "This master Settings Library does not have a description yet. It is a reusable Library Source container for future entries and Project Library links."}
            </p>
          </div>

          <div className="grid gap-3 rounded-lg border border-[var(--line)] bg-black/25 p-4 sm:grid-cols-2 lg:min-w-80">
            <HeroMeta
              label="Visibility"
              value={formatSettingsLibraryVisibility(settingsLibrary.visibility)}
            />
            <HeroMeta label="Version" value={settingsLibrary.version} />
            <HeroMeta
              label="Source"
              value={formatSettingsLibrarySourceType(settingsLibrary.source_type)}
            />
            <HeroMeta
              label="Category"
              value={formatLibrarySourceCategory(settingsLibrary.source_category)}
            />
            <HeroMeta
              label="Player default"
              value={formatLibrarySourcePlayerVisibility(
                settingsLibrary.default_player_visibility,
              )}
            />
            <HeroMeta
              label="System"
              value={settingsLibrary.gameSystem?.name || "Not set"}
            />
            <HeroMeta label="Genre" value={settingsLibrary.genre || "Not set"} />
            <HeroMeta label="Tone" value={settingsLibrary.tone || "Not set"} />
          </div>
        </div>
      </section>

      <MasterLibraryLinkPanel
        title="Related Master Library actions"
        description="This Settings Library is a reusable Library Source. Master Entries belong here, and Project overrides come later."
        links={[
          { label: "Back to Settings Library", href: "/settings-library" },
          { label: "Master Library", href: "/master-library" },
          { label: "Create Master Entry", href: "/master-entries/new" },
          { label: "View Master Entries", href: "/master-entries" },
          { label: "Manage Entry Types", href: "/entry-types" },
        ]}
      />

      <section className="rounded-lg border border-[var(--line)] bg-[var(--panel-bg)] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.2)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#FCA311]/30 bg-[#14213D] text-[#FCA311]">
            <Library aria-hidden="true" className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-main)]">
              Setting entries are coming later
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
              Slice 4C creates the master Settings Library container only. No lore
              pages, setting entries, imported notes, PDFs, Markdown, CSVs, maps,
              timelines, or third-party content exist here yet.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <InfoPanel title="Settings Library metadata" icon={Library}>
          <MetadataGrid settingsLibrary={settingsLibrary} />
        </InfoPanel>

        <InfoPanel title="Source and provenance" icon={ClipboardList}>
          <dl className="space-y-4">
            <DetailItem
              label="Source type"
              value={formatSettingsLibrarySourceType(settingsLibrary.source_type)}
            />
            <DetailItem
              label="Source category"
              value={formatLibrarySourceCategory(settingsLibrary.source_category)}
            />
            <DetailItem
              label="Source subtype"
              value={formatLibrarySourceSubtype(settingsLibrary.source_subtype)}
            />
            <DetailItem
              label="Clone policy"
              value={formatLibrarySourceClonePolicy(settingsLibrary.clone_policy)}
            />
            <DetailItem
              label="Default player visibility"
              value={formatLibrarySourcePlayerVisibility(
                settingsLibrary.default_player_visibility,
              )}
            />
            <DetailItem
              label="Source URL"
              value={
                settingsLibrary.source_url ? (
                  <SafeLink href={settingsLibrary.source_url}>
                    {settingsLibrary.source_url}
                  </SafeLink>
                ) : (
                  "Not set"
                )
              }
            />
            <DetailItem
              label="Source notes"
              value={settingsLibrary.source_notes || "Not set"}
            />
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
                later through Project Library links.
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
            No Master Entries belong to this Settings Library Source yet.
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
              Future Settings Library sections
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              These areas are placeholders until entries, organization, imports,
              reveal tools, and Project Library linking are designed.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {futureSettingsLibrarySections.map((section) => (
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

function MetadataGrid({
  settingsLibrary,
}: {
  settingsLibrary: SettingsLibraryDetail;
}) {
  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      <DetailItem label="Name" value={settingsLibrary.name} />
      <DetailItem label="Slug" value={settingsLibrary.slug} />
      <DetailItem
        label="Visibility"
        value={formatSettingsLibraryVisibility(settingsLibrary.visibility)}
      />
      <DetailItem
        label="Game system"
        value={settingsLibrary.gameSystem?.name || "Not set"}
      />
      <DetailItem label="Genre" value={settingsLibrary.genre || "Not set"} />
      <DetailItem label="Tone" value={settingsLibrary.tone || "Not set"} />
      <DetailItem
        label="Source type"
        value={formatSettingsLibrarySourceType(settingsLibrary.source_type)}
      />
      <DetailItem
        label="Source category"
        value={formatLibrarySourceCategory(settingsLibrary.source_category)}
      />
      <DetailItem
        label="Source subtype"
        value={formatLibrarySourceSubtype(settingsLibrary.source_subtype)}
      />
      <DetailItem
        label="Clone policy"
        value={formatLibrarySourceClonePolicy(settingsLibrary.clone_policy)}
      />
      <DetailItem
        label="Default player visibility"
        value={formatLibrarySourcePlayerVisibility(
          settingsLibrary.default_player_visibility,
        )}
      />
      <DetailItem label="Version" value={settingsLibrary.version} />
      <DetailItem
        label="Created"
        value={dateFormatter.format(new Date(settingsLibrary.created_at))}
      />
      <DetailItem
        label="Updated"
        value={dateFormatter.format(new Date(settingsLibrary.updated_at))}
      />
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

function SettingsLibraryUnavailableState() {
  return (
    <div className="space-y-8">
      <Link
        href="/settings-library"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#FCA311] transition hover:text-[#ffb33c]"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back to Settings Library
      </Link>

      <section className="rounded-lg border border-[#FCA311]/30 bg-[#FCA311]/10 p-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-2xl font-semibold text-[var(--text-main)]">
            Settings Library not found
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
            This Settings Library does not exist, or your account does not have
            access to it. Settings Library access is protected by Supabase Row
            Level Security.
          </p>
          <Link
            href="/settings-library"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-[#FCA311] px-4 text-sm font-semibold text-black transition hover:bg-[#ffb33c]"
          >
            Return to Settings Library
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
