import Link from "next/link";
import {
  BookOpen,
  Boxes,
  FileText,
  FolderTree,
  GitBranch,
  Library,
  Search,
  Tags,
  TextCursorInput,
} from "lucide-react";

import { MasterLibraryCard } from "@/components/master-library/master-library-card";
import { MasterLibraryWorkflow } from "@/components/master-library/master-library-workflow";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { getMasterLibraryOverview } from "@/lib/master-library-overview";

export const dynamic = "force-dynamic";

const comingLater = [
  {
    title: "Project Sources",
    description: "Projects will attach reusable master sources in a later slice.",
    meta: "Slice 5 direction",
    icon: GitBranch,
  },
  {
    title: "Overrides",
    description: "Project customization will use linked copies with field-level changes.",
    meta: "Later slice",
    icon: FolderTree,
  },
  {
    title: "Tags & Folders",
    description: "Organization tools will help larger libraries stay readable.",
    meta: "Later slice",
    icon: Tags,
  },
  {
    title: "Rich Text Editor",
    description: "Rich editing, Markdown paste, and wiki-link tools come later.",
    meta: "Later slice",
    icon: TextCursorInput,
  },
  {
    title: "Search",
    description: "Permission-aware search will connect these libraries later.",
    meta: "Future search",
    icon: Search,
  },
];

export default async function MasterLibraryPage() {
  const overview = await getMasterLibraryOverview();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <PageHeader
          title="Master Library"
          description="The reusable original content area for game systems, compendiums, Settings Libraries, entry types, and master entries."
        />

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/master-entries/new"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#FCA311]/50 px-4 text-sm font-semibold text-[#FCA311] transition hover:bg-[#FCA311] hover:text-black"
          >
            <FileText aria-hidden="true" className="h-4 w-4" />
            Create Master Entry
          </Link>
          <Link
            href="/systems/new"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#FCA311] px-4 text-sm font-semibold text-black transition hover:bg-[#ffb33c]"
          >
            <Boxes aria-hidden="true" className="h-4 w-4" />
            Create System
          </Link>
        </div>
      </div>

      <section className="rounded-lg border border-[#FCA311]/30 bg-[#FCA311]/10 p-5">
        <h2 className="text-lg font-semibold text-[var(--text-main)]">
          Keep master records safe
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
          Project-specific changes and overrides come later. Master records should
          stay reusable originals so future Projects can link to them without
          directly mutating the source content.
        </p>
      </section>

      {overview.totalCount === 0 ? (
        <section className="rounded-lg border border-[var(--line)] bg-[var(--panel-bg)] p-6">
          <h2 className="text-lg font-semibold text-[var(--text-main)]">
            Start with a Game System
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
            Add D&D 5e 2014 or another ruleset first, then create a Compendium or
            Settings Library, define Entry Types, and add Master Entries.
          </p>
          <Link
            href="/systems/new?starter=dnd-5e-2014"
            className="mt-5 inline-flex h-10 items-center justify-center rounded-lg border border-[#FCA311]/50 px-4 text-sm font-semibold text-[#FCA311] transition hover:bg-[#FCA311] hover:text-black"
          >
            Prefill D&D 5e 2014
          </Link>
        </section>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MasterLibraryCard
          title="Game Systems"
          description="Ruleset foundations such as D&D 5e 2014 or a private custom system."
          count={overview.gameSystems.length}
          countName="system"
          href="/systems"
          createHref="/systems/new"
          createLabel="Create System"
          icon={Boxes}
        />
        <MasterLibraryCard
          title="Compendiums"
          description="Reusable rules and reference containers linked to game systems."
          count={overview.compendiums.length}
          countName="compendium"
          href="/compendium"
          createHref="/compendium/new"
          createLabel="Create Compendium"
          icon={BookOpen}
        />
        <MasterLibraryCard
          title="Settings Libraries"
          description="Reusable lore and setting containers for places, factions, histories, and notes."
          count={overview.settingsLibraries.length}
          countName="Settings Library"
          countPlural="Settings Libraries"
          href="/settings-library"
          createHref="/settings-library/new"
          createLabel="Create Settings Library"
          icon={Library}
        />
        <MasterLibraryCard
          title="Entry Types"
          description="Reusable category definitions for future Compendium and Settings Library entries."
          count={overview.entryTypes.length}
          countName="Entry Type"
          href="/entry-types"
          createHref="/entry-types/new"
          createLabel="Create Entry Type"
          icon={Tags}
        />
        <MasterLibraryCard
          title="Master Entries"
          description="Reusable original records that belong to a Compendium or Settings Library."
          count={overview.masterEntries.length}
          countName="Master Entry"
          href="/master-entries"
          createHref="/master-entries/new"
          createLabel="Create Master Entry"
          icon={FileText}
        />
      </section>

      <MasterLibraryWorkflow />

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#FCA311]">
          Coming later
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {comingLater.map((item) => (
            <SectionCard key={item.title} {...item} />
          ))}
        </div>
      </section>
    </div>
  );
}
