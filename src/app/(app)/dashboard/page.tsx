import Link from "next/link";
import { Library } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { dashboardCards, navItems, systemStatusCards } from "@/lib/tablehub-data";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <PageHeader
          title="Dashboard"
          description="A private-first home base for campaign prep, table play, and the libraries that power them. This version uses static placeholder data only."
        />

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          {systemStatusCards.map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-[var(--line)] bg-[var(--panel-bg)] p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#FCA311]">
                {item.label}
              </p>
              <p className="mt-2 text-sm font-medium text-[var(--text-main)]">
                {item.value}
              </p>
            </div>
          ))}
        </section>
      </div>

      <section className="rounded-lg border border-[#FCA311]/30 bg-[#FCA311]/10 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#FCA311]/30 bg-[#14213D] text-[#FCA311]">
              <Library aria-hidden="true" className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-main)]">
                Master Library
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                Build reusable systems, compendiums, Settings Libraries, entry
                types, and master entries before attaching them to Projects.
              </p>
            </div>
          </div>
          <Link
            href="/master-library"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-[#FCA311]/50 px-4 text-sm font-semibold text-[#FCA311] transition hover:bg-[#FCA311] hover:text-black"
          >
            Open Master Library
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#FCA311]">
          Today at the table
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dashboardCards.map((card) => (
            <SectionCard key={card.title} {...card} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#FCA311]">
          Explore TableHub
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {navItems.map((section) => (
            <SectionCard
              key={section.href}
              title={section.title}
              description={section.description}
              icon={section.icon}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
