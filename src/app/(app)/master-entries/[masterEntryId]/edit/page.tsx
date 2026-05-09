import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { updateMasterEntryBodyAction } from "@/lib/master-entry-actions";
import { getMasterEntryById } from "@/lib/master-entries";

type EditMasterEntryPageProps = {
  params: Promise<{
    masterEntryId: string;
  }>;
};

export default async function EditMasterEntryPage({
  params,
}: EditMasterEntryPageProps) {
  const { masterEntryId } = await params;
  const masterEntry = await getMasterEntryById(masterEntryId);

  if (!masterEntry) {
    return <MasterEntryEditUnavailableState />;
  }

  return (
    <div className="space-y-8">
      <Link
        href={`/master-entries/${masterEntry.id}`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#FCA311] transition hover:text-[#ffb33c]"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back to Master Entry
      </Link>

      <section className="rounded-lg border border-[#FCA311]/30 bg-[#FCA311]/10 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#FCA311]">
          Edit Master Entry body
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal text-[var(--text-main)] sm:text-4xl">
          {masterEntry.title}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--text-muted)]">
          This edits only the original Master Entry body inside its current
          source container. Project-specific table changes still belong in
          Project Entry Overrides.
        </p>
      </section>

      <section className="rounded-lg border border-[var(--line)] bg-[var(--panel-bg)] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.2)]">
        <form action={updateMasterEntryBodyAction} className="space-y-5">
          <input type="hidden" name="masterEntryId" value={masterEntry.id} />
          <RichTextEditor
            label="Body"
            name="body"
            initialContent={masterEntry.body ?? ""}
            initialFormat={masterEntry.body_format}
            description="Saving from this editor stores sanitized rich text HTML in the existing body field."
            placeholder="Write the entry body."
            minHeight={320}
            formatFieldName="bodyFormat"
            formatFieldValue="html"
          />

          <button
            type="submit"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#FCA311] px-4 text-sm font-semibold text-black transition hover:bg-[#ffb33c] sm:w-auto"
          >
            <Save aria-hidden="true" className="h-4 w-4" />
            Save Body
          </button>
        </form>
      </section>
    </div>
  );
}

function MasterEntryEditUnavailableState() {
  return (
    <div className="space-y-8">
      <Link
        href="/master-entries"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#FCA311] transition hover:text-[#ffb33c]"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back to Master Entries
      </Link>

      <section className="rounded-lg border border-[#FCA311]/30 bg-[#FCA311]/10 p-8">
        <h1 className="text-2xl font-semibold text-[var(--text-main)]">
          Master Entry not found
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
          This Master Entry does not exist, or Supabase Row Level Security did
          not allow your account to access it.
        </p>
      </section>
    </div>
  );
}
