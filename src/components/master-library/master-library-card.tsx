import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { formatOverviewCount } from "@/lib/master-library-overview-copy";

type MasterLibraryCardProps = {
  title: string;
  description: string;
  count: number;
  countName: string;
  countPlural?: string;
  href: string;
  createHref?: string;
  createLabel?: string;
  icon: LucideIcon;
};

export function MasterLibraryCard({
  title,
  description,
  count,
  countName,
  countPlural,
  href,
  createHref,
  createLabel = "Create",
  icon: Icon,
}: MasterLibraryCardProps) {
  return (
    <article className="group flex min-h-64 flex-col rounded-lg border border-[var(--line)] bg-[var(--panel-bg)] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.2)] transition duration-200 hover:-translate-y-1 hover:border-[#FCA311]/70 hover:bg-[var(--panel-bg-hover)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#FCA311]/30 bg-[#14213D] text-[#FCA311] transition group-hover:border-[#FCA311] group-hover:bg-[#FCA311] group-hover:text-black">
          <Icon aria-hidden="true" className="h-5 w-5" />
        </div>
        <span className="rounded-md border border-[var(--line)] bg-black/25 px-2 py-1 text-xs font-medium text-[#FCA311]">
          {formatOverviewCount(count, countName, countPlural)}
        </span>
      </div>

      <h2 className="mt-5 text-xl font-semibold tracking-normal text-[var(--text-main)]">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
        {description}
      </p>

      <div className="mt-auto flex flex-col gap-3 pt-5 sm:flex-row">
        <Link
          href={href}
          className="inline-flex h-10 items-center justify-center rounded-lg border border-[#FCA311]/50 px-4 text-sm font-semibold text-[#FCA311] transition hover:bg-[#FCA311] hover:text-black"
        >
          Open list
        </Link>
        {createHref ? (
          <Link
            href={createHref}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-[#FCA311] px-4 text-sm font-semibold text-black transition hover:bg-[#ffb33c]"
          >
            {createLabel}
          </Link>
        ) : null}
      </div>
    </article>
  );
}
