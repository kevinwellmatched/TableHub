import Link from "next/link";
import { ArrowLeft, BookOpen, Library, Tags } from "lucide-react";

import { CreateMasterEntryForm } from "@/components/master-entries/create-master-entry-form";
import { PageHeader } from "@/components/page-header";
import { getMasterEntryFormOptions } from "@/lib/master-entries";

export default async function NewMasterEntryPage() {
  const options = await getMasterEntryFormOptions();
  const hasCompendiumPath =
    options.compendiums.length > 0 &&
    options.entryTypes.some((entryType) => entryType.library_kind === "compendium");
  const hasSettingsLibraryPath =
    options.settingsLibraries.length > 0 &&
    options.entryTypes.some(
      (entryType) => entryType.library_kind === "settings_library",
    );
  const canCreateAnyEntry = hasCompendiumPath || hasSettingsLibraryPath;

  return (
    <div className="space-y-8">
      <Link
        href="/master-entries"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#FCA311] transition hover:text-[#ffb33c]"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back to Master Entries
      </Link>

      <PageHeader
        title="Create Master Entry"
        description="Create a basic original entry for one Compendium or one Settings Library. Body content is plain text or Markdown in a textarea for now."
      />

      {!canCreateAnyEntry ? <MissingFoundationsState /> : null}

      <section className="rounded-lg border border-[var(--line)] bg-[var(--panel-bg)] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.2)]">
        <div className="max-w-5xl">
          <h2 className="text-xl font-semibold text-[var(--text-main)]">
            Master Entry details
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
            Each entry belongs to exactly one parent library and one Entry Type.
            Do not add imports, rich text editing, tags, folders, wiki links,
            project links, or overrides in Slice 4E.
          </p>

          <ReadinessNotes
            hasCompendiumPath={hasCompendiumPath}
            hasSettingsLibraryPath={hasSettingsLibraryPath}
          />

          <div className="mt-6">
            {canCreateAnyEntry ? (
              <CreateMasterEntryForm options={options} />
            ) : (
              <p className="rounded-lg border border-[#FCA311]/30 bg-[#FCA311]/10 p-4 text-sm leading-6 text-[var(--text-muted)]">
                Create at least one Compendium or Settings Library and one
                matching Entry Type, then return here to create a Master Entry.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function ReadinessNotes({
  hasCompendiumPath,
  hasSettingsLibraryPath,
}: {
  hasCompendiumPath: boolean;
  hasSettingsLibraryPath: boolean;
}) {
  if (hasCompendiumPath && hasSettingsLibraryPath) {
    return null;
  }

  return (
    <div className="mt-5 grid gap-3 lg:grid-cols-2">
      {!hasCompendiumPath ? (
        <FoundationNote
          icon={BookOpen}
          title="Compendium entries need a Compendium and Compendium Entry Type"
          href="/compendium"
          label="Open Compendium"
        />
      ) : null}
      {!hasSettingsLibraryPath ? (
        <FoundationNote
          icon={Library}
          title="Settings Library entries need a Settings Library and Settings Library Entry Type"
          href="/settings-library"
          label="Open Settings Library"
        />
      ) : null}
    </div>
  );
}

function FoundationNote({
  icon: Icon,
  title,
  href,
  label,
}: {
  icon: typeof BookOpen;
  title: string;
  href: string;
  label: string;
}) {
  return (
    <div className="rounded-lg border border-[#FCA311]/30 bg-[#FCA311]/10 p-4">
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#14213D] text-[#FCA311]">
          <Icon aria-hidden="true" className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--text-main)]">{title}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href={href}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-[#FCA311]/50 px-3 text-sm font-semibold text-[#FCA311] transition hover:bg-[#FCA311] hover:text-black"
            >
              {label}
            </Link>
            <Link
              href="/entry-types"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[var(--line)] px-3 text-sm font-semibold text-[var(--text-main)] transition hover:border-[#FCA311]/60 hover:text-[#FCA311]"
            >
              <Tags aria-hidden="true" className="h-4 w-4" />
              Entry Types
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function MissingFoundationsState() {
  return (
    <section className="rounded-lg border border-[#FCA311]/30 bg-[#FCA311]/10 p-6">
      <h2 className="text-lg font-semibold text-[var(--text-main)]">
        Add the foundations first
      </h2>
      <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
        Master Entries need an accessible parent Compendium or Settings Library
        and a matching Entry Type. Supabase RLS decides which foundations your
        account can use.
      </p>
    </section>
  );
}
