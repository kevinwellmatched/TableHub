import { navItems } from "@/lib/tablehub-data";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";

type PlaceholderPageProps = {
  title: string;
  description: string;
  activeHref: string;
};

export function PlaceholderPage({
  title,
  description,
  activeHref,
}: PlaceholderPageProps) {
  const activeSection = navItems.find((item) => item.href === activeHref);
  const relatedSections = navItems.filter((item) => item.href !== activeHref).slice(0, 4);
  const ActiveIcon = activeSection?.icon;

  return (
    <div className="space-y-8">
      <PageHeader title={title} description={description} />

      {activeSection && ActiveIcon ? (
        <section className="rounded-lg border border-[#FCA311]/30 bg-[#FCA311]/10 p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#FCA311] text-black">
              <ActiveIcon aria-hidden="true" className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[var(--text-main)]">
                {activeSection.title} foundation
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
                {activeSection.description} This page is intentionally static in App
                Shell v1. Real data, permissions, and Supabase wiring come later.
              </p>
            </div>
          </div>
        </section>
      ) : null}

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#FCA311]">
          Major sections
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {relatedSections.map((section) => (
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
