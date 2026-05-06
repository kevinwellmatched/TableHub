import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { CreateGameSystemForm } from "@/components/systems/create-game-system-form";
import { DND_5E_2014_STARTER_SYSTEM } from "@/lib/game-system-validation";

type NewSystemPageProps = {
  searchParams: Promise<{
    starter?: string;
  }>;
};

export default async function NewSystemPage({ searchParams }: NewSystemPageProps) {
  const { starter } = await searchParams;
  const defaultValues =
    starter === "dnd-5e-2014" ? DND_5E_2014_STARTER_SYSTEM : undefined;

  return (
    <div className="space-y-8">
      <Link
        href="/systems"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#FCA311] transition hover:text-[#ffb33c]"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back to Systems
      </Link>

      <PageHeader
        title="Create System"
        description="Create a reusable ruleset record with clean source and license metadata. This is the foundation for future compendiums, imports, character sheet templates, and project links."
      />

      <section className="rounded-lg border border-[var(--line)] bg-[var(--panel-bg)] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.2)]">
        <div className="max-w-4xl">
          <h2 className="text-xl font-semibold text-[var(--text-main)]">
            System details
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
            Only system metadata is stored here. Do not add spells, classes, book text,
            rules entries, or imported content in Slice 4A.
          </p>
          <div className="mt-6">
            <CreateGameSystemForm defaultValues={defaultValues} />
          </div>
        </div>
      </section>
    </div>
  );
}
