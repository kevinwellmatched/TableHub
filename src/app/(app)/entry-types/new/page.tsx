import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { CreateEntryTypeForm } from "@/components/entry-types/create-entry-type-form";
import { PageHeader } from "@/components/page-header";

export default function NewEntryTypePage() {
  return (
    <div className="space-y-8">
      <Link
        href="/entry-types"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#FCA311] transition hover:text-[#ffb33c]"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back to Entry Types
      </Link>

      <PageHeader
        title="Create Entry Type"
        description="Define a reusable category for future Compendium or Settings Library entries. This stores the definition only; no actual entries are created."
      />

      <section className="rounded-lg border border-[var(--line)] bg-[var(--panel-bg)] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.2)]">
        <div className="max-w-4xl">
          <h2 className="text-xl font-semibold text-[var(--text-main)]">
            Entry Type details
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
            Do not add NPC records, places, factions, spells, monsters, items,
            lore pages, rich text, tags, folders, imports, field schemas, or
            project overrides in Slice 4D.
          </p>
          <div className="mt-6">
            <CreateEntryTypeForm />
          </div>
        </div>
      </section>
    </div>
  );
}
