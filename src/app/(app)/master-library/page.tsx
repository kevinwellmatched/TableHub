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
    description:
      "Projects attach compatible Library Sources into a Project Library.",
    meta: "Project Library",
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

const librarySourceCategories = [
  "Core Rulebooks",
  "Expansions & Supplements",
  "Setting & World Lore",
  "Adventures & Modules",
  "Other",
];

export default async function MasterLibraryPage() {
  const overview = await getMasterLibraryOverview();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <PageHeader
          title="Library"
          description="The reusable content hub for Systems, Library Sources, Entry Types, and Master Entries. Build original sources here, then attach them to Projects without changing the originals."
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
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-main)]">
              Library Sources stay reusable
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
              Library Sources are reusable containers under Systems. They include
              rules references, lore sources, modules, private homebrew packets,
              and other original material that Projects can link to later.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {librarySourceCategories.map((category) => (
              <span
                key={category}
                className="rounded-md border border-[#FCA311]/25 bg-black/20 px-2 py-1 text-xs font-medium text-[#FCA311]"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </section>

      {overview.totalCount === 0 ? (
        <section className="rounded-lg border border-[var(--line)] bg-[var(--panel-bg)] p-6">
          <h2 className="text-lg font-semibold text-[var(--text-main)]">
            Start with a Game System
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
            Add D&D 5e 2014 or another ruleset first, then create a Library
            Source for rules or lore, define Entry Types, and add Master Entries.
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
          title="Systems"
          description="Ruleset foundations such as D&D 5e 2014 or a private custom system."
          count={overview.gameSystems.length}
          countName="system"
          href="/systems"
          createHref="/systems/new"
          createLabel="Create System"
          icon={Boxes}
        />
        <MasterLibraryCard
          title="Rules-reference sources"
          description="Create Compendiums for core rulebooks, expansions, supplements, and other rules-reference sources."
          count={overview.compendiums.length}
          countName="compendium"
          href="/compendium"
          createHref="/compendium/new"
          createLabel="Create Source"
          icon={BookOpen}
        />
        <MasterLibraryCard
          title="Lore-world sources"
          description="Create Settings Libraries for setting lore, worldbuilding, factions, places, and adventures."
          count={overview.settingsLibraries.length}
          countName="Settings Library"
          countPlural="Settings Libraries"
          href="/settings-library"
          createHref="/settings-library/new"
          createLabel="Create Source"
          icon={Library}
        />
        <MasterLibraryCard
          title="Entry Types"
          description="Reusable category definitions for entries inside Library Sources."
          count={overview.entryTypes.length}
          countName="Entry Type"
          href="/entry-types"
          createHref="/entry-types/new"
          createLabel="Create Entry Type"
          icon={Tags}
        />
        <MasterLibraryCard
          title="Master Entries"
          description="Reusable original records that belong inside a Library Source."
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
