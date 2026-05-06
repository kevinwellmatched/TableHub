import Link from "next/link";
import { ArrowLeft, Boxes, Sparkles } from "lucide-react";

import { CreateCompendiumForm } from "@/components/compendiums/create-compendium-form";
import { PageHeader } from "@/components/page-header";
import { DND_5E_2014_STARTER_COMPENDIUM } from "@/lib/compendium-validation";
import { getGameSystemsForCompendiumForm } from "@/lib/compendiums";

type NewCompendiumPageProps = {
  searchParams: Promise<{
    starter?: string;
  }>;
};

export default async function NewCompendiumPage({
  searchParams,
}: NewCompendiumPageProps) {
  const [{ starter }, gameSystems] = await Promise.all([
    searchParams,
    getGameSystemsForCompendiumForm(),
  ]);
  const defaultValues =
    starter === "dnd-5e-2014" ? DND_5E_2014_STARTER_COMPENDIUM : undefined;

  return (
    <div className="space-y-8">
      <Link
        href="/compendium"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#FCA311] transition hover:text-[#ffb33c]"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back to Compendium
      </Link>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <PageHeader
          title="Create Compendium"
          description="Create a reusable master-library container linked to a game system. This stores metadata only; entries, imports, and project overrides come later."
        />

        {starter === "dnd-5e-2014" ? (
          <div className="rounded-lg border border-[#FCA311]/30 bg-[#FCA311]/10 p-4 lg:max-w-sm">
            <p className="flex items-center gap-2 text-sm font-semibold text-[#FCA311]">
              <Sparkles aria-hidden="true" className="h-4 w-4" />
              Starter prefill active
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
              The form is prefilled as a safe D&D 5e 2014 container. Select the
              matching game system before creating it.
            </p>
          </div>
        ) : null}
      </div>

      {gameSystems.length === 0 ? (
        <section className="rounded-lg border border-[#FCA311]/30 bg-[#FCA311]/10 p-6">
          <div className="max-w-2xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#FCA311] text-black">
              <Boxes aria-hidden="true" className="h-5 w-5" />
            </div>
            <h2 className="mt-5 text-xl font-semibold text-[var(--text-main)]">
              Create a game system first
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
              Every compendium must link to an accessible game system. Add a
              system, then return here to create the compendium container.
            </p>
            <Link
              href="/systems/new?starter=dnd-5e-2014"
              className="mt-5 inline-flex h-11 items-center justify-center rounded-lg bg-[#FCA311] px-4 text-sm font-semibold text-black transition hover:bg-[#ffb33c]"
            >
              Create D&D 5e system
            </Link>
          </div>
        </section>
      ) : (
        <section className="rounded-lg border border-[var(--line)] bg-[var(--panel-bg)] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.2)]">
          <div className="max-w-4xl">
            <h2 className="text-xl font-semibold text-[var(--text-main)]">
              Compendium details
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
              Do not add spells, monsters, classes, items, book text, SRD entries,
              or third-party data in Slice 4B.
            </p>
            <div className="mt-6">
              <CreateCompendiumForm
                defaultValues={defaultValues}
                gameSystems={gameSystems}
              />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
