import Link from "next/link";
import {
  CalendarDays,
  ExternalLink,
  FileText,
  Layers,
  Library,
  Plus,
  Tags,
  type LucideIcon,
} from "lucide-react";

import { MasterLibraryLinkPanel } from "@/components/master-library/master-library-link-panel";
import { PageHeader } from "@/components/page-header";
import {
  formatMasterEntryLibraryKind,
  formatMasterEntryVisibility,
  getMasterEntries,
  getMasterEntryParentName,
  type MasterEntryListItem,
} from "@/lib/master-entries";

export const dynamic = "force-dynamic";

export default async function MasterEntriesPage() {
  const masterEntries = await getMasterEntries();
  const compendiumEntries = masterEntries.filter(
    (entry) => entry.library_kind === "compendium",
  );
  const settingsLibraryEntries = masterEntries.filter(
    (entry) => entry.library_kind === "settings_library",
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <PageHeader
          title="Master Entries"
          description="Reusable original entries inside Library Source containers. Rules/reference entries live under Compendium sources, and setting/lore entries live under Settings Library sources."
        />

        <Link
          href="/master-entries/new"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#FCA311] px-4 text-sm font-semibold text-black transition hover:bg-[#ffb33c]"
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
          Create Master Entry
        </Link>
      </div>

      <MasterLibraryLinkPanel
        title="Reusable originals"
        description="Master Entries are original reusable records. Project-specific changes and overrides come later through linked copies, not direct edits to master content."
        links={[
          { label: "Master Library", href: "/master-library" },
          { label: "Compendiums", href: "/compendium" },
          { label: "Settings Library", href: "/settings-library" },
          { label: "Entry Types", href: "/entry-types" },
        ]}
      />

      {masterEntries.length > 0 ? (
        <div className="space-y-8">
          <MasterEntryGroup
            title="Rules / Reference Entries"
            description="Original records that belong to a rules/reference source container."
            icon={Layers}
            entries={compendiumEntries}
          />
          <MasterEntryGroup
            title="Setting / Lore Entries"
            description="Original records that belong to a setting/lore source container."
            icon={Library}
            entries={settingsLibraryEntries}
          />
        </div>
      ) : (
        <EmptyMasterEntriesState />
      )}

      <section className="rounded-lg border border-[var(--line)] bg-[var(--panel-bg)] p-5">
        <h2 className="text-lg font-semibold text-[var(--text-main)]">
          Later entry tools are not built yet
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
          Slice 6A adds the shared rich text body editor and safe renderer while
          keeping entries otherwise simple: title, aliases, summary, JSON
          properties, visibility, version, and provenance. Imports, tags,
          folders, wiki links, project links, and advanced wiki tools come
          later.
        </p>
      </section>
    </div>
  );
}

function MasterEntryGroup({
  title,
  description,
  icon: Icon,
  entries,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  entries: MasterEntryListItem[];
}) {
  return (
    <section>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#FCA311]/30 bg-[#14213D] text-[#FCA311]">
          <Icon aria-hidden="true" className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-main)]">
            {title}
          </h2>
          <p className="text-sm leading-6 text-[var(--text-muted)]">
            {description}
          </p>
        </div>
      </div>

      {entries.length > 0 ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {entries.map((entry) => (
            <MasterEntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-lg border border-[var(--line)] bg-black/15 p-4 text-sm text-[var(--text-muted)]">
          No entries in this group yet.
        </p>
      )}
    </section>
  );
}

function MasterEntryCard({ entry }: { entry: MasterEntryListItem }) {
  return (
    <article className="group flex min-h-80 flex-col rounded-lg border border-[var(--line)] bg-[var(--panel-bg)] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.2)] transition duration-200 hover:-translate-y-1 hover:border-[#FCA311]/70 hover:bg-[var(--panel-bg-hover)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#FCA311]/30 bg-[#14213D] text-[#FCA311] transition group-hover:border-[#FCA311] group-hover:bg-[#FCA311] group-hover:text-black">
          <FileText aria-hidden="true" className="h-5 w-5" />
        </div>
        <span className="rounded-md border border-[var(--line)] bg-black/25 px-2 py-1 text-xs font-medium text-[#FCA311]">
          {formatMasterEntryVisibility(entry.visibility)}
        </span>
      </div>

      <h3 className="mt-5 text-xl font-semibold tracking-normal text-[var(--text-main)]">
        {entry.title}
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--text-muted)]">
        {entry.summary || "No summary yet."}
      </p>

      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <MetaItem
          label="Source type"
          value={formatMasterEntryLibraryKind(entry.library_kind)}
        />
        <MetaItem label="Source" value={getMasterEntryParentName(entry)} />
        <MetaItem
          label="Entry Type"
          value={entry.entryType?.name || "Entry Type unavailable"}
        />
        <MetaItem label="Version" value={entry.version} />
      </dl>

      <div className="mt-auto pt-5">
        <p className="flex items-center gap-2 border-t border-[var(--line)] pt-4 text-xs font-medium uppercase tracking-[0.14em] text-[#FCA311]/85">
          <CalendarDays aria-hidden="true" className="h-4 w-4" />
          Updated {dateFormatter.format(new Date(entry.updated_at))}
        </p>
        <Link
          href={`/master-entries/${entry.id}`}
          className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#FCA311]/50 px-4 text-sm font-semibold text-[#FCA311] transition hover:bg-[#FCA311] hover:text-black"
        >
          Open Master Entry
          <ExternalLink aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

function EmptyMasterEntriesState() {
  return (
    <section className="rounded-lg border border-[#FCA311]/30 bg-[#FCA311]/10 p-8">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-[#FCA311] text-black">
          <FileText aria-hidden="true" className="h-6 w-6" />
        </div>
        <h2 className="mt-5 text-2xl font-semibold text-[var(--text-main)]">
          No Master Entries yet
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
          Create original reusable records after you have a parent source
          container and matching Entry Type. Project links and overrides come
          later.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/entry-types"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#FCA311]/50 px-4 text-sm font-semibold text-[#FCA311] transition hover:bg-[#FCA311] hover:text-black"
          >
            <Tags aria-hidden="true" className="h-4 w-4" />
            Manage Entry Types
          </Link>
          <Link
            href="/master-entries/new"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#FCA311] px-4 text-sm font-semibold text-black transition hover:bg-[#ffb33c]"
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
            Create Master Entry
          </Link>
        </div>
      </div>
    </section>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[#FCA311]/80">
        {label}
      </dt>
      <dd className="mt-1 text-[var(--text-main)]">{value}</dd>
    </div>
  );
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});
