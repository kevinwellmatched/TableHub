import Link from "next/link";
import {
  CalendarDays,
  ExternalLink,
  FileText,
  Library,
  Plus,
  Sparkles,
  Tag,
  Tags,
  type LucideIcon,
} from "lucide-react";

import { MasterLibraryLinkPanel } from "@/components/master-library/master-library-link-panel";
import { PageHeader } from "@/components/page-header";
import {
  formatSettingsLibrarySourceType,
  formatSettingsLibraryVisibility,
  getSettingsLibraries,
  type SettingsLibraryListItem,
} from "@/lib/settings-libraries";
import { formatLibrarySourceCategory } from "@/lib/library-source-taxonomy";

export const dynamic = "force-dynamic";

export default async function SettingsLibraryPage() {
  const settingsLibraries = await getSettingsLibraries();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <PageHeader
          title="Settings Library"
          description="Settings Libraries are the current Library Source containers for reusable setting and world lore. Setting entries, imports, project links, and overrides come in later slices."
        />

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/master-entries"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[var(--line)] px-4 text-sm font-semibold text-[var(--text-main)] transition hover:border-[#FCA311]/60 hover:text-[#FCA311]"
          >
            <FileText aria-hidden="true" className="h-4 w-4" />
            View Master Entries
          </Link>
          <Link
            href="/entry-types"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[var(--line)] px-4 text-sm font-semibold text-[var(--text-main)] transition hover:border-[#FCA311]/60 hover:text-[#FCA311]"
          >
            <Tags aria-hidden="true" className="h-4 w-4" />
            Manage Entry Types
          </Link>
          <Link
            href="/settings-library/new?starter=fantasy"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#FCA311]/50 px-4 text-sm font-semibold text-[#FCA311] transition hover:bg-[#FCA311] hover:text-black"
          >
            <Sparkles aria-hidden="true" className="h-4 w-4" />
            Fantasy starter
          </Link>
          <Link
            href="/settings-library/new"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#FCA311] px-4 text-sm font-semibold text-black transition hover:bg-[#ffb33c]"
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
            Create Settings Library
          </Link>
        </div>
      </div>

      <MasterLibraryLinkPanel
        title="Reusable setting and world lore Library Sources"
        description="Settings Libraries hold original setting material for later Project Library use. Create a container, define matching Entry Types, then add reusable Master Entries."
        links={[
          { label: "Master Library", href: "/master-library" },
          { label: "Entry Types", href: "/entry-types" },
          { label: "Master Entries", href: "/master-entries" },
          { label: "Create Settings Library", href: "/settings-library/new" },
        ]}
      />

      {settingsLibraries.length > 0 ? (
        <div className="space-y-6">
          <section className="rounded-lg border border-[#FCA311]/30 bg-[#FCA311]/10 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-6 text-[var(--text-muted)]">
                Basic entries are original master records inside a Library Source.
                Project overrides come later through linked copies, not direct
                edits to master content.
              </p>
              <Link
                href="/master-entries/new"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#FCA311]/50 px-4 text-sm font-semibold text-[#FCA311] transition hover:bg-[#FCA311] hover:text-black"
              >
                <Plus aria-hidden="true" className="h-4 w-4" />
                Create Master Entry
              </Link>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {settingsLibraries.map((settingsLibrary) => (
              <SettingsLibraryCard
                key={settingsLibrary.id}
                settingsLibrary={settingsLibrary}
              />
            ))}
          </section>
        </div>
      ) : (
        <EmptySettingsLibraryState />
      )}
    </div>
  );
}

function SettingsLibraryCard({
  settingsLibrary,
}: {
  settingsLibrary: SettingsLibraryListItem;
}) {
  return (
    <article className="group flex min-h-80 flex-col rounded-lg border border-[var(--line)] bg-[var(--panel-bg)] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.2)] transition duration-200 hover:-translate-y-1 hover:border-[#FCA311]/70 hover:bg-[var(--panel-bg-hover)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#FCA311]/30 bg-[#14213D] text-[#FCA311] transition group-hover:border-[#FCA311] group-hover:bg-[#FCA311] group-hover:text-black">
          <Library aria-hidden="true" className="h-5 w-5" />
        </div>
        <span className="rounded-md border border-[var(--line)] bg-black/25 px-2 py-1 text-xs font-medium text-[#FCA311]">
          {formatSettingsLibraryVisibility(settingsLibrary.visibility)}
        </span>
      </div>

      <h2 className="mt-5 text-xl font-semibold tracking-normal text-[var(--text-main)]">
        {settingsLibrary.name}
      </h2>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--text-muted)]">
        {settingsLibrary.description || "No description yet."}
      </p>

      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <MetaItem label="Genre" value={settingsLibrary.genre || "Not set"} />
        <MetaItem
          label="System"
          value={settingsLibrary.gameSystem?.name || "Not set"}
        />
        <MetaItem label="Tone" value={settingsLibrary.tone || "Not set"} />
        <MetaItem label="Version" value={settingsLibrary.version} />
        <MetaItem
          label="Category"
          value={formatLibrarySourceCategory(settingsLibrary.source_category)}
        />
      </dl>

      <div className="mt-5 flex flex-wrap gap-2">
        <Badge
          icon={FileText}
          label={formatSettingsLibrarySourceType(settingsLibrary.source_type)}
        />
        <Badge
          icon={Tags}
          label={formatLibrarySourceCategory(settingsLibrary.source_category)}
        />
        <Badge icon={Tag} label={settingsLibrary.slug} />
      </div>

      <div className="mt-auto pt-5">
        <p className="flex items-center gap-2 border-t border-[var(--line)] pt-4 text-xs font-medium uppercase tracking-[0.14em] text-[#FCA311]/85">
          <CalendarDays aria-hidden="true" className="h-4 w-4" />
          Updated {dateFormatter.format(new Date(settingsLibrary.updated_at))}
        </p>
        <Link
          href={`/settings-library/${settingsLibrary.id}`}
          className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#FCA311]/50 px-4 text-sm font-semibold text-[#FCA311] transition hover:bg-[#FCA311] hover:text-black"
        >
          Open Settings Library
          <ExternalLink aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

function EmptySettingsLibraryState() {
  return (
    <section className="rounded-lg border border-[#FCA311]/30 bg-[#FCA311]/10 p-8">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-[#FCA311] text-black">
          <Library aria-hidden="true" className="h-6 w-6" />
        </div>
        <h2 className="mt-5 text-2xl font-semibold text-[var(--text-main)]">
          No Settings Libraries yet
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
          Create a Settings Library after you know what reusable Library Source
          you need for setting and world lore. Entry Types and Master Entries can
          be added next.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/settings-library/new?starter=fantasy"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#FCA311]/50 px-4 text-sm font-semibold text-[#FCA311] transition hover:bg-[#FCA311] hover:text-black"
          >
            <Sparkles aria-hidden="true" className="h-4 w-4" />
            Prefill fantasy starter
          </Link>
          <Link
            href="/settings-library/new"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#FCA311] px-4 text-sm font-semibold text-black transition hover:bg-[#ffb33c]"
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
            Create your first Settings Library
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

function Badge({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-md border border-[var(--line)] bg-black/25 px-2 py-1 text-xs font-medium text-[var(--text-muted)]">
      <Icon aria-hidden="true" className="h-3.5 w-3.5 text-[#FCA311]" />
      {label}
    </span>
  );
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});
