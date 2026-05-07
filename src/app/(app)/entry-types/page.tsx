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

import { PageHeader } from "@/components/page-header";
import {
  formatEntryTypeLibraryKind,
  formatEntryTypeVisibility,
  getEntryTypes,
  type EntryTypeListItem,
} from "@/lib/entry-types";

export const dynamic = "force-dynamic";

export default async function EntryTypesPage() {
  const entryTypes = await getEntryTypes();
  const compendiumEntryTypes = entryTypes.filter(
    (entryType) => entryType.library_kind === "compendium",
  );
  const settingsLibraryEntryTypes = entryTypes.filter(
    (entryType) => entryType.library_kind === "settings_library",
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <PageHeader
          title="Entry Types"
          description="Reusable type definitions for future Compendium and Settings Library entries. This slice defines categories only; it does not create actual entries."
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
            href="/entry-types/new"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#FCA311] px-4 text-sm font-semibold text-black transition hover:bg-[#ffb33c]"
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
            Create Entry Type
          </Link>
        </div>
      </div>

      {entryTypes.length > 0 ? (
        <div className="space-y-8">
          <EntryTypeGroup
            title="Compendium Entry Types"
            description="Rules and reference categories for future master compendium entries."
            icon={Layers}
            entryTypes={compendiumEntryTypes}
          />
          <EntryTypeGroup
            title="Settings Library Entry Types"
            description="Lore and setting categories for future master Settings Library entries."
            icon={Library}
            entryTypes={settingsLibraryEntryTypes}
          />
        </div>
      ) : (
        <EmptyEntryTypesState />
      )}

      <section className="rounded-lg border border-[var(--line)] bg-[var(--panel-bg)] p-5">
        <h2 className="text-lg font-semibold text-[var(--text-main)]">
          Entries are not created yet
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
          Slice 4D only stores reusable definitions such as Rule, Spell, NPC, or
          Place. Actual compendium entries, setting entries, rich text, fields,
          tags, folders, project links, and overrides come in later slices.
        </p>
      </section>
    </div>
  );
}

function EntryTypeGroup({
  title,
  description,
  icon: Icon,
  entryTypes,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  entryTypes: EntryTypeListItem[];
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

      {entryTypes.length > 0 ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {entryTypes.map((entryType) => (
            <EntryTypeCard key={entryType.id} entryType={entryType} />
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-lg border border-[var(--line)] bg-black/15 p-4 text-sm text-[var(--text-muted)]">
          No definitions in this group yet.
        </p>
      )}
    </section>
  );
}

function EntryTypeCard({ entryType }: { entryType: EntryTypeListItem }) {
  return (
    <article className="group flex min-h-72 flex-col rounded-lg border border-[var(--line)] bg-[var(--panel-bg)] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.2)] transition duration-200 hover:-translate-y-1 hover:border-[#FCA311]/70 hover:bg-[var(--panel-bg-hover)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#FCA311]/30 bg-[#14213D] text-[#FCA311] transition group-hover:border-[#FCA311] group-hover:bg-[#FCA311] group-hover:text-black">
          <Tags aria-hidden="true" className="h-5 w-5" />
        </div>
        <span className="rounded-md border border-[var(--line)] bg-black/25 px-2 py-1 text-xs font-medium text-[#FCA311]">
          {formatEntryTypeVisibility(entryType.visibility)}
        </span>
      </div>

      <h3 className="mt-5 text-xl font-semibold tracking-normal text-[var(--text-main)]">
        {entryType.name}
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--text-muted)]">
        {entryType.description || "No description yet."}
      </p>

      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <MetaItem
          label="Library"
          value={formatEntryTypeLibraryKind(entryType.library_kind)}
        />
        <MetaItem label="Sort order" value={String(entryType.sort_order)} />
      </dl>

      <div className="mt-auto pt-5">
        <p className="flex items-center gap-2 border-t border-[var(--line)] pt-4 text-xs font-medium uppercase tracking-[0.14em] text-[#FCA311]/85">
          <CalendarDays aria-hidden="true" className="h-4 w-4" />
          Updated {dateFormatter.format(new Date(entryType.updated_at))}
        </p>
        <Link
          href={`/entry-types/${entryType.id}`}
          className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#FCA311]/50 px-4 text-sm font-semibold text-[#FCA311] transition hover:bg-[#FCA311] hover:text-black"
        >
          Open Entry Type
          <ExternalLink aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

function EmptyEntryTypesState() {
  return (
    <section className="rounded-lg border border-[#FCA311]/30 bg-[#FCA311]/10 p-8">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-[#FCA311] text-black">
          <Tags aria-hidden="true" className="h-6 w-6" />
        </div>
        <h2 className="mt-5 text-2xl font-semibold text-[var(--text-main)]">
          No Entry Types yet
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
          Create your first reusable definition before building future Compendium
          or Settings Library entries. This does not add rules text, lore pages,
          tags, folders, imports, or project overrides.
        </p>
        <Link
          href="/entry-types/new"
          className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#FCA311] px-4 text-sm font-semibold text-black transition hover:bg-[#ffb33c]"
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
          Create your first Entry Type
        </Link>
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
