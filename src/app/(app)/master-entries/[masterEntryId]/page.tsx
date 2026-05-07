import Link from "next/link";
import {
  ArrowLeft,
  ClipboardList,
  FileArchive,
  FileText,
  FolderTree,
  GitBranch,
  Link2,
  Tags,
  TextCursorInput,
  type LucideIcon,
} from "lucide-react";

import { SectionCard } from "@/components/section-card";
import {
  formatMasterEntryBodyFormat,
  formatMasterEntryLibraryKind,
  formatMasterEntrySourceType,
  formatMasterEntryVisibility,
  getMasterEntryById,
  getMasterEntryParentName,
  type MasterEntryDetail,
} from "@/lib/master-entries";

type MasterEntryDetailPageProps = {
  params: Promise<{
    masterEntryId: string;
  }>;
};

const futureMasterEntrySections = [
  {
    title: "Rich Text Editor",
    description: "A richer editor and Markdown paste conversion come later.",
    meta: "Later slice",
    icon: TextCursorInput,
  },
  {
    title: "Tags & Folders",
    description: "Future organization tools will help browse larger libraries.",
    meta: "Later slice",
    icon: FolderTree,
  },
  {
    title: "Wiki Links",
    description: "Aliases, backlinks, hover previews, and wiki-link parsing are not built yet.",
    meta: "Later slice",
    icon: Link2,
  },
  {
    title: "Project Links",
    description: "Projects will link to master entries without editing originals.",
    meta: "Later slice",
    icon: GitBranch,
  },
  {
    title: "Project Overrides",
    description: "Project customization must use linked copies with overrides.",
    meta: "Overrides later",
    icon: ClipboardList,
  },
  {
    title: "Imports",
    description: "Import flows must track source, license, and provenance later.",
    meta: "No imports yet",
    icon: FileArchive,
  },
];

export default async function MasterEntryDetailPage({
  params,
}: MasterEntryDetailPageProps) {
  const { masterEntryId } = await params;
  const masterEntry = await getMasterEntryById(masterEntryId);

  if (!masterEntry) {
    return <MasterEntryUnavailableState />;
  }

  return (
    <div className="space-y-8">
      <Link
        href="/master-entries"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#FCA311] transition hover:text-[#ffb33c]"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back to Master Entries
      </Link>

      <section className="rounded-lg border border-[#FCA311]/30 bg-[#FCA311]/10 p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#FCA311]">
              Master original entry
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal text-[var(--text-main)] sm:text-4xl">
              {masterEntry.title}
            </h1>
            <p className="mt-3 text-base leading-7 text-[var(--text-muted)]">
              {masterEntry.summary ||
                "This Master Entry does not have a summary yet."}
            </p>
          </div>

          <div className="grid gap-3 rounded-lg border border-[var(--line)] bg-black/25 p-4 sm:grid-cols-2 lg:min-w-80">
            <HeroMeta
              label="Library"
              value={formatMasterEntryLibraryKind(masterEntry.library_kind)}
            />
            <HeroMeta label="Parent" value={getMasterEntryParentName(masterEntry)} />
            <HeroMeta
              label="Entry Type"
              value={masterEntry.entryType?.name || "Entry Type unavailable"}
            />
            <HeroMeta
              label="Visibility"
              value={formatMasterEntryVisibility(masterEntry.visibility)}
            />
            <HeroMeta label="Version" value={masterEntry.version} />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-[var(--line)] bg-[var(--panel-bg)] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.2)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#FCA311]/30 bg-[#14213D] text-[#FCA311]">
            <GitBranch aria-hidden="true" className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-main)]">
              Master content stays original
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
              This is reusable master content. Future Project customization must
              use linked copies with overrides instead of directly changing this
              original entry.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <InfoPanel title="Entry content" icon={FileText}>
          <dl className="space-y-5">
            <DetailItem
              label="Aliases"
              value={
                masterEntry.aliases && masterEntry.aliases.length > 0
                  ? masterEntry.aliases.join(", ")
                  : "None"
              }
            />
            <DetailItem
              label="Body format"
              value={formatMasterEntryBodyFormat(masterEntry.body_format)}
            />
            <DetailItem
              label="Body"
              value={
                <pre className="whitespace-pre-wrap rounded-lg border border-[var(--line)] bg-black/25 p-4 font-sans text-sm leading-6 text-[var(--text-main)]">
                  {masterEntry.body || "No body content yet."}
                </pre>
              }
            />
            <DetailItem
              label="Properties JSON"
              value={
                <pre className="whitespace-pre-wrap rounded-lg border border-[var(--line)] bg-black/25 p-4 font-mono text-xs leading-6 text-[var(--text-main)]">
                  {JSON.stringify(masterEntry.properties ?? {}, null, 2)}
                </pre>
              }
            />
          </dl>
        </InfoPanel>

        <InfoPanel title="Metadata and provenance" icon={ClipboardList}>
          <MetadataGrid masterEntry={masterEntry} />
        </InfoPanel>
      </section>

      <section>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#FCA311]/30 bg-[#14213D] text-[#FCA311]">
            <Tags aria-hidden="true" className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[var(--text-main)]">
              Future Master Entry sections
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              These areas are placeholders until editing, organization, imports,
              links, and overrides are designed.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {futureMasterEntrySections.map((section) => (
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

function MetadataGrid({ masterEntry }: { masterEntry: MasterEntryDetail }) {
  return (
    <dl className="space-y-4">
      <DetailItem label="Title" value={masterEntry.title} />
      <DetailItem label="Slug" value={masterEntry.slug} />
      <DetailItem
        label="Library kind"
        value={formatMasterEntryLibraryKind(masterEntry.library_kind)}
      />
      <DetailItem label="Parent library" value={getMasterEntryParentName(masterEntry)} />
      <DetailItem
        label="Entry Type"
        value={masterEntry.entryType?.name || "Entry Type unavailable"}
      />
      <DetailItem
        label="Visibility"
        value={formatMasterEntryVisibility(masterEntry.visibility)}
      />
      <DetailItem label="Sort order" value={String(masterEntry.sort_order)} />
      <DetailItem
        label="Source type"
        value={formatMasterEntrySourceType(masterEntry.source_type)}
      />
      <DetailItem label="License name" value={masterEntry.license_name || "Not set"} />
      <DetailItem
        label="License URL"
        value={
          masterEntry.license_url ? (
            <SafeLink href={masterEntry.license_url}>
              {masterEntry.license_url}
            </SafeLink>
          ) : (
            "Not set"
          )
        }
      />
      <DetailItem
        label="Source URL"
        value={
          masterEntry.source_url ? (
            <SafeLink href={masterEntry.source_url}>{masterEntry.source_url}</SafeLink>
          ) : (
            "Not set"
          )
        }
      />
      <DetailItem label="Source notes" value={masterEntry.source_notes || "Not set"} />
      <DetailItem label="Version" value={masterEntry.version} />
      <DetailItem
        label="Created"
        value={dateFormatter.format(new Date(masterEntry.created_at))}
      />
      <DetailItem
        label="Updated"
        value={dateFormatter.format(new Date(masterEntry.updated_at))}
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

function MasterEntryUnavailableState() {
  return (
    <div className="space-y-8">
      <Link
        href="/master-entries"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#FCA311] transition hover:text-[#ffb33c]"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back to Master Entries
      </Link>

      <section className="rounded-lg border border-[#FCA311]/30 bg-[#FCA311]/10 p-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-2xl font-semibold text-[var(--text-main)]">
            Master Entry not found
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
            This Master Entry does not exist, or your account does not have
            access to it. Master Entry access is protected by Supabase Row Level
            Security.
          </p>
          <Link
            href="/master-entries"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-[#FCA311] px-4 text-sm font-semibold text-black transition hover:bg-[#ffb33c]"
          >
            Return to Master Entries
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
