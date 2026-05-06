import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

import { CreateSettingsLibraryForm } from "@/components/settings-library/create-settings-library-form";
import { PageHeader } from "@/components/page-header";
import { STARTER_FANTASY_SETTINGS_LIBRARY } from "@/lib/settings-library-validation";

type NewSettingsLibraryPageProps = {
  searchParams: Promise<{
    starter?: string;
  }>;
};

export default async function NewSettingsLibraryPage({
  searchParams,
}: NewSettingsLibraryPageProps) {
  const { starter } = await searchParams;
  const defaultValues =
    starter === "fantasy" ? STARTER_FANTASY_SETTINGS_LIBRARY : undefined;

  return (
    <div className="space-y-8">
      <Link
        href="/settings-library"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#FCA311] transition hover:text-[#ffb33c]"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back to Settings Library
      </Link>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <PageHeader
          title="Create Settings Library"
          description="Create a reusable master-library container for setting lore. This stores metadata only; entries, imports, and project overrides come later."
        />

        {starter === "fantasy" ? (
          <div className="rounded-lg border border-[#FCA311]/30 bg-[#FCA311]/10 p-4 lg:max-w-sm">
            <p className="flex items-center gap-2 text-sm font-semibold text-[#FCA311]">
              <Sparkles aria-hidden="true" className="h-4 w-4" />
              Starter prefill active
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
              The form is prefilled as a safe fantasy container. It does not add
              setting entries or imported lore content.
            </p>
          </div>
        ) : null}
      </div>

      <section className="rounded-lg border border-[var(--line)] bg-[var(--panel-bg)] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.2)]">
        <div className="max-w-4xl">
          <h2 className="text-xl font-semibold text-[var(--text-main)]">
            Settings Library details
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
            Do not add NPCs, places, factions, deities, maps, timelines, lore
            pages, imported notes, PDFs, Markdown, CSVs, or third-party data in
            Slice 4C.
          </p>
          <div className="mt-6">
            <CreateSettingsLibraryForm defaultValues={defaultValues} />
          </div>
        </div>
      </section>
    </div>
  );
}
