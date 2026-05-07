import Link from "next/link";
import {
  Boxes,
  CalendarDays,
  ExternalLink,
  FileText,
  Plus,
  Sparkles,
  Tag,
  type LucideIcon,
} from "lucide-react";

import { MasterLibraryLinkPanel } from "@/components/master-library/master-library-link-panel";
import { PageHeader } from "@/components/page-header";
import {
  formatGameSystemSourceType,
  formatGameSystemVisibility,
  getGameSystemsForCurrentUser,
  type GameSystemRow,
} from "@/lib/game-systems";

export const dynamic = "force-dynamic";

export default async function SystemsPage() {
  const systems = await getGameSystemsForCurrentUser();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <PageHeader
          title="Systems"
          description="Game Systems are reusable master-library records for rulesets such as D&D 5e 2014, Pathfinder 2e, Daggerheart, Shadowdark, Mothership, or custom system-agnostic play."
        />

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/systems/new?starter=dnd-5e-2014"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#FCA311]/50 px-4 text-sm font-semibold text-[#FCA311] transition hover:bg-[#FCA311] hover:text-black"
          >
            <Sparkles aria-hidden="true" className="h-4 w-4" />
            D&D 5e starter
          </Link>
          <Link
            href="/systems/new"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#FCA311] px-4 text-sm font-semibold text-black transition hover:bg-[#ffb33c]"
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
            Create System
          </Link>
        </div>
      </div>

      <MasterLibraryLinkPanel
        title="Ruleset foundation"
        description="Systems are the first layer of the Master Library workflow. Create or choose a ruleset before building reusable Compendiums and Master Entries around it."
        links={[
          { label: "Master Library", href: "/master-library" },
          { label: "Create Compendium", href: "/compendium/new" },
        ]}
      />

      {systems.length > 0 ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {systems.map((system) => (
            <SystemCard key={system.id} system={system} />
          ))}
        </section>
      ) : (
        <EmptySystemsState />
      )}
    </div>
  );
}

function SystemCard({ system }: { system: GameSystemRow }) {
  return (
    <article className="group flex min-h-80 flex-col rounded-lg border border-[var(--line)] bg-[var(--panel-bg)] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.2)] transition duration-200 hover:-translate-y-1 hover:border-[#FCA311]/70 hover:bg-[var(--panel-bg-hover)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#FCA311]/30 bg-[#14213D] text-[#FCA311] transition group-hover:border-[#FCA311] group-hover:bg-[#FCA311] group-hover:text-black">
          <Boxes aria-hidden="true" className="h-5 w-5" />
        </div>
        <span className="rounded-md border border-[var(--line)] bg-black/25 px-2 py-1 text-xs font-medium text-[#FCA311]">
          {formatGameSystemVisibility(system.visibility)}
        </span>
      </div>

      <h2 className="mt-5 text-xl font-semibold tracking-normal text-[var(--text-main)]">
        {system.name}
      </h2>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--text-muted)]">
        {system.description || "No description yet."}
      </p>

      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <MetaItem label="Edition" value={system.edition || "Not set"} />
        <MetaItem label="Publisher" value={system.publisher || "Not set"} />
        <MetaItem
          label="Ruleset year"
          value={system.ruleset_year ? String(system.ruleset_year) : "Not set"}
        />
        <MetaItem label="Version" value={system.version} />
      </dl>

      <div className="mt-5 flex flex-wrap gap-2">
        <Badge icon={FileText} label={formatGameSystemSourceType(system.source_type)} />
        <Badge icon={Tag} label={system.slug} />
      </div>

      <div className="mt-auto pt-5">
        <p className="flex items-center gap-2 border-t border-[var(--line)] pt-4 text-xs font-medium uppercase tracking-[0.14em] text-[#FCA311]/85">
          <CalendarDays aria-hidden="true" className="h-4 w-4" />
          Updated {dateFormatter.format(new Date(system.updated_at))}
        </p>
        <Link
          href={`/systems/${system.id}`}
          className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#FCA311]/50 px-4 text-sm font-semibold text-[#FCA311] transition hover:bg-[#FCA311] hover:text-black"
        >
          Open system
          <ExternalLink aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

function EmptySystemsState() {
  return (
    <section className="rounded-lg border border-[#FCA311]/30 bg-[#FCA311]/10 p-8">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-[#FCA311] text-black">
          <Boxes aria-hidden="true" className="h-6 w-6" />
        </div>
        <h2 className="mt-5 text-2xl font-semibold text-[var(--text-main)]">
          No game systems yet
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
          Start with a Game System. D&D 5e 2014 can be added manually from the
          starter form, then you can create Compendiums and Entry Types around it.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/systems/new?starter=dnd-5e-2014"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#FCA311]/50 px-4 text-sm font-semibold text-[#FCA311] transition hover:bg-[#FCA311] hover:text-black"
          >
            <Sparkles aria-hidden="true" className="h-4 w-4" />
            Prefill D&D 5e 2014
          </Link>
          <Link
            href="/systems/new"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#FCA311] px-4 text-sm font-semibold text-black transition hover:bg-[#ffb33c]"
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
            Create your first system
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
