import Link from "next/link";
import {
  ArrowLeft,
  ClipboardList,
  FolderTree,
  GitBranch,
  Layers,
  Tags,
  TextCursorInput,
} from "lucide-react";

import { MasterLibraryBreadcrumbs } from "@/components/master-library/master-library-breadcrumbs";
import { MasterLibraryLinkPanel } from "@/components/master-library/master-library-link-panel";
import { SectionCard } from "@/components/section-card";
import {
  formatEntryTypeLibraryKind,
  formatEntryTypeVisibility,
  getEntryTypeById,
  type EntryTypeDetail,
} from "@/lib/entry-types";

type EntryTypeDetailPageProps = {
  params: Promise<{
    entryTypeId: string;
  }>;
};

const futureEntryTypeSections = [
  {
    title: "Entries",
    description: "Actual Compendium and Settings Library entries come later.",
    meta: "Later slice",
    icon: Layers,
  },
  {
    title: "Fields & Properties",
    description: "Custom field definitions and property panels are not built yet.",
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
    title: "Project Overrides",
    description: "Projects will use linked copies with overrides instead of editing masters.",
    meta: "Overrides later",
    icon: GitBranch,
  },
];

export default async function EntryTypeDetailPage({
  params,
}: EntryTypeDetailPageProps) {
  const { entryTypeId } = await params;
  const entryType = await getEntryTypeById(entryTypeId);

  if (!entryType) {
    return <EntryTypeUnavailableState />;
  }

  return (
    <div className="space-y-8">
      <MasterLibraryBreadcrumbs
        items={[
          { label: "Master Library", href: "/master-library" },
          { label: "Entry Types", href: "/entry-types" },
          { label: entryType.name },
        ]}
      />

      <Link
        href="/entry-types"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#FCA311] transition hover:text-[#ffb33c]"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back to Entry Types
      </Link>

      <section className="rounded-lg border border-[#FCA311]/30 bg-[#FCA311]/10 p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#FCA311]">
              Master Entry Type
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal text-[var(--text-main)] sm:text-4xl">
              {entryType.name}
            </h1>
            <p className="mt-3 text-base leading-7 text-[var(--text-muted)]">
              {entryType.description ||
                "This Entry Type does not have a description yet. It is a reusable definition for future entries."}
            </p>
          </div>

          <div className="grid gap-3 rounded-lg border border-[var(--line)] bg-black/25 p-4 sm:grid-cols-2 lg:min-w-80">
            <HeroMeta
              label="Library"
              value={formatEntryTypeLibraryKind(entryType.library_kind)}
            />
            <HeroMeta
              label="Visibility"
              value={formatEntryTypeVisibility(entryType.visibility)}
            />
            <HeroMeta label="Sort order" value={String(entryType.sort_order)} />
            <HeroMeta label="Slug" value={entryType.slug} />
          </div>
        </div>
      </section>

      <MasterLibraryLinkPanel
        title="Related Master Library actions"
        description="This Entry Type defines a future category. Create Master Entries only after the matching parent library exists."
        links={[
          { label: "Back to Entry Types", href: "/entry-types" },
          { label: "Master Library", href: "/master-library" },
          { label: "Create Master Entry", href: "/master-entries/new" },
          { label: "View Master Entries", href: "/master-entries" },
        ]}
      />

      <section className="rounded-lg border border-[var(--line)] bg-[var(--panel-bg)] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.2)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#FCA311]/30 bg-[#14213D] text-[#FCA311]">
            <Tags aria-hidden="true" className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-main)]">
              Actual entries are coming later
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
              Slice 4D stores Entry Type definitions only. No compendium entries,
              setting entries, rich text, body content, tags, folders, field
              schemas, imports, or linked project overrides exist here yet.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-[var(--line)] bg-[var(--panel-bg)] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.2)]">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#FCA311]/30 bg-[#14213D] text-[#FCA311]">
            <ClipboardList aria-hidden="true" className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-semibold text-[var(--text-main)]">
            Entry Type metadata
          </h2>
        </div>
        <MetadataGrid entryType={entryType} />
      </section>

      <section>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#FCA311]/30 bg-[#14213D] text-[#FCA311]">
            <Layers aria-hidden="true" className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[var(--text-main)]">
              Future Entry Type sections
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              These areas are placeholders until entries, fields, organization,
              and project overrides are designed.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {futureEntryTypeSections.map((section) => (
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

function MetadataGrid({ entryType }: { entryType: EntryTypeDetail }) {
  return (
    <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <DetailItem label="Name" value={entryType.name} />
      <DetailItem label="Slug" value={entryType.slug} />
      <DetailItem
        label="Library kind"
        value={formatEntryTypeLibraryKind(entryType.library_kind)}
      />
      <DetailItem
        label="Visibility"
        value={formatEntryTypeVisibility(entryType.visibility)}
      />
      <DetailItem label="Sort order" value={String(entryType.sort_order)} />
      <DetailItem
        label="Created"
        value={dateFormatter.format(new Date(entryType.created_at))}
      />
      <DetailItem
        label="Updated"
        value={dateFormatter.format(new Date(entryType.updated_at))}
      />
    </dl>
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

function EntryTypeUnavailableState() {
  return (
    <div className="space-y-8">
      <Link
        href="/entry-types"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#FCA311] transition hover:text-[#ffb33c]"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back to Entry Types
      </Link>

      <section className="rounded-lg border border-[#FCA311]/30 bg-[#FCA311]/10 p-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-2xl font-semibold text-[var(--text-main)]">
            Entry Type not found
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
            This Entry Type does not exist, or your account does not have access
            to it. Entry Type access is protected by Supabase Row Level Security.
          </p>
          <Link
            href="/entry-types"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-[#FCA311] px-4 text-sm font-semibold text-black transition hover:bg-[#ffb33c]"
          >
            Return to Entry Types
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
