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
