import Link from "next/link";
import { ArrowLeft, RotateCcw, Save } from "lucide-react";

import {
  resetProjectEntryOverrideAction,
  saveProjectEntryOverrideAction,
} from "@/lib/project-entry-override-actions";
import { getProjectLibraryEntry } from "@/lib/project-entry-override-data";
import {
  formatProjectEntryOverrideVisibility,
  PROJECT_ENTRY_OVERRIDE_VISIBILITIES,
} from "@/lib/project-entry-overrides";
import { formatProjectRole, getProjectById } from "@/lib/projects";

type ProjectLibraryEntryPageProps = {
  params: Promise<{
    projectId: string;
    masterEntryId: string;
  }>;
  searchParams: Promise<{
    status?: string;
    message?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function ProjectLibraryEntryPage({
  params,
  searchParams,
}: ProjectLibraryEntryPageProps) {
  const { projectId, masterEntryId } = await params;
  const messageParams = await searchParams;
  const project = await getProjectById(projectId);

  if (!project) {
    return <ProjectEntryUnavailableState />;
  }

  const canManageOverrides = ["owner", "gm"].includes(
    (project.role ?? "").toLowerCase(),
  );

  if (!canManageOverrides) {
    return <ProjectEntryRoleState projectId={project.id} role={project.role} />;
  }

  const entry = await getProjectLibraryEntry(project.id, masterEntryId);

  if (!entry) {
    return <ProjectEntryUnavailableState projectId={project.id} />;
  }

  return (
    <div className="space-y-8">
      <Link
        href={`/projects/${project.id}/library`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#FCA311] transition hover:text-[#ffb33c]"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back to Project Library
      </Link>

      <section className="rounded-lg border border-[#FCA311]/30 bg-[#FCA311]/10 p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#FCA311]">
              Project-specific entry
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal text-[var(--text-main)] sm:text-4xl">
              {entry.effective.title}
            </h1>
            <p className="mt-3 text-base leading-7 text-[var(--text-muted)]">
              {entry.effective.summary ||
                "This Project view falls back to the original Master Entry summary."}
            </p>
          </div>

          <div className="rounded-lg border border-[var(--line)] bg-black/25 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#FCA311]">
              Source
            </p>
            <p className="mt-2 text-sm font-semibold text-[var(--text-main)]">
              {entry.source.sourceName}
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#FCA311]">
              Override status
            </p>
            <p className="mt-2 text-sm font-semibold text-[var(--text-main)]">
              {entry.override ? "Project override exists" : "Original values"}
            </p>
          </div>
        </div>
      </section>

      {messageParams.message ? (
        <MessageBanner
          status={messageParams.status === "success" ? "success" : "error"}
          message={messageParams.message}
        />
      ) : null}

      <section className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <article className="rounded-lg border border-[var(--line)] bg-[var(--panel-bg)] p-5">
          <h2 className="text-xl font-semibold text-[var(--text-main)]">
            Effective Project Entry
          </h2>
          <div className="mt-5 space-y-5">
            <EffectiveField
              label="Title"
              value={entry.effective.title}
              overridden={entry.overrideStatus.title}
            />
            <EffectiveField
              label="Summary"
              value={entry.effective.summary || "No summary."}
              overridden={entry.overrideStatus.summary}
            />
            <EffectiveField
              label="Body"
              value={entry.effective.body || "No body."}
              overridden={entry.overrideStatus.body}
              preserveLines
            />
            <EffectiveField
              label="Properties"
              value={formatJson(entry.effective.properties)}
              overridden={entry.overrideStatus.properties}
              preserveLines
            />
            <EffectiveField
              label="Visibility"
              value={entry.effective.visibility}
              overridden={entry.overrideStatus.visibility}
            />
          </div>
        </article>

        <article className="rounded-lg border border-[var(--line)] bg-[var(--panel-bg)] p-5">
          <h2 className="text-xl font-semibold text-[var(--text-main)]">
            Original Master Entry
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
            These values stay unchanged when the Project override is saved.
          </p>
          <dl className="mt-5 space-y-4 text-sm">
            <OriginalField label="Title" value={entry.title} />
            <OriginalField label="Summary" value={entry.summary || "No summary."} />
            <OriginalField
              label="Body"
              value={entry.body || "No body."}
              preserveLines
            />
            <OriginalField
              label="Properties"
              value={formatJson(entry.properties ?? {})}
              preserveLines
            />
            <OriginalField label="Visibility" value={entry.visibility} />
          </dl>
        </article>
      </section>

      <section className="rounded-lg border border-[var(--line)] bg-[var(--panel-bg)] p-5">
        <h2 className="text-xl font-semibold text-[var(--text-main)]">
          Edit Project Override
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
          Leave a text field empty to inherit the original Master Entry value.
          Properties are shallow-merged over the original properties.
        </p>

        <form action={saveProjectEntryOverrideAction} className="mt-6 space-y-5">
          <input type="hidden" name="projectId" value={project.id} />
          <input type="hidden" name="masterEntryId" value={entry.id} />

          <TextInput
            label="Override title"
            name="overrideTitle"
            defaultValue={entry.override?.override_title ?? ""}
          />
          <Textarea
            label="Override summary"
            name="overrideSummary"
            rows={4}
            defaultValue={entry.override?.override_summary ?? ""}
          />
          <Textarea
            label="Override body"
            name="overrideBody"
            rows={8}
            defaultValue={entry.override?.override_body ?? ""}
          />
          <Textarea
            label="Override properties JSON"
            name="overrideProperties"
            rows={5}
            defaultValue={formatJson(entry.override?.override_properties ?? {})}
          />
          <Select
            label="Override visibility"
            name="overrideVisibility"
            defaultValue={entry.override?.override_visibility ?? "inherit"}
          />
          <Textarea
            label="Override reason"
            name="overrideReason"
            rows={3}
            defaultValue={entry.override?.override_reason ?? ""}
          />

          <button
            type="submit"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#FCA311] px-4 text-sm font-semibold text-black transition hover:bg-[#ffb33c] sm:w-auto"
          >
            <Save aria-hidden="true" className="h-4 w-4" />
            Save Project Override
          </button>
        </form>

        {entry.override ? (
          <form action={resetProjectEntryOverrideAction} className="mt-4">
            <input type="hidden" name="projectId" value={project.id} />
            <input type="hidden" name="masterEntryId" value={entry.id} />
            <button
              type="submit"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[var(--line)] px-4 text-sm font-semibold text-[var(--text-main)] transition hover:border-[#FCA311]/70 hover:text-[#FCA311] sm:w-auto"
            >
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
              Reset Override
            </button>
          </form>
        ) : null}
      </section>
    </div>
  );
}

function EffectiveField({
  label,
  value,
  overridden,
  preserveLines = false,
}: {
  label: string;
  value: string;
  overridden: boolean;
  preserveLines?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-semibold text-[#FCA311]">{label}</h3>
        <span className="rounded-md border border-[var(--line)] bg-black/25 px-2 py-1 text-xs font-medium text-[var(--text-muted)]">
          {overridden ? "Overridden" : "Original"}
        </span>
      </div>
      <p
        className={
          preserveLines
            ? "mt-2 whitespace-pre-wrap rounded-lg border border-[var(--line)] bg-black/20 p-3 text-sm leading-6 text-[var(--text-main)]"
            : "mt-2 text-sm leading-6 text-[var(--text-main)]"
        }
      >
        {value}
      </p>
    </div>
  );
}

function OriginalField({
  label,
  value,
  preserveLines = false,
}: {
  label: string;
  value: string;
  preserveLines?: boolean;
}) {
  return (
    <div>
      <dt className="font-semibold text-[#FCA311]">{label}</dt>
      <dd
        className={
          preserveLines
            ? "mt-2 whitespace-pre-wrap rounded-lg border border-[var(--line)] bg-black/20 p-3 leading-6 text-[var(--text-main)]"
            : "mt-1 leading-6 text-[var(--text-main)]"
        }
      >
        {value}
      </dd>
    </div>
  );
}

function TextInput({
  label,
  name,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-[var(--text-main)]">{label}</span>
      <input
        name={name}
        className="mt-2 h-11 w-full rounded-lg border border-[var(--line)] bg-black/25 px-3 text-sm text-[var(--text-main)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[#FCA311] focus:ring-2 focus:ring-[#FCA311]/20"
        {...props}
      />
    </label>
  );
}

function Textarea({
  label,
  name,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  name: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-[var(--text-main)]">{label}</span>
      <textarea
        name={name}
        className="mt-2 w-full resize-y rounded-lg border border-[var(--line)] bg-black/25 px-3 py-3 text-sm leading-6 text-[var(--text-main)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[#FCA311] focus:ring-2 focus:ring-[#FCA311]/20"
        {...props}
      />
    </label>
  );
}

function Select({
  label,
  name,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  name: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-[var(--text-main)]">{label}</span>
      <select
        name={name}
        className="mt-2 h-11 w-full rounded-lg border border-[var(--line)] bg-black/25 px-3 text-sm text-[var(--text-main)] outline-none transition focus:border-[#FCA311] focus:ring-2 focus:ring-[#FCA311]/20"
        {...props}
      >
        {PROJECT_ENTRY_OVERRIDE_VISIBILITIES.map((visibility) => (
          <option key={visibility} value={visibility}>
            {formatProjectEntryOverrideVisibility(visibility)}
          </option>
        ))}
      </select>
    </label>
  );
}

function MessageBanner({
  status,
  message,
}: {
  status: "success" | "error";
  message: string;
}) {
  const isSuccess = status === "success";

  return (
    <section
      className={
        isSuccess
          ? "rounded-lg border border-emerald-400/30 bg-emerald-500/10 p-4 text-sm text-emerald-100"
          : "rounded-lg border border-[#FCA311]/30 bg-[#FCA311]/10 p-4 text-sm text-[#FCA311]"
      }
    >
      {message}
    </section>
  );
}

function ProjectEntryRoleState({
  projectId,
  role,
}: {
  projectId: string;
  role: string | null;
}) {
  return (
    <div className="space-y-8">
      <Link
        href={`/projects/${projectId}`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#FCA311] transition hover:text-[#ffb33c]"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back to Project
      </Link>
      <section className="rounded-lg border border-[#FCA311]/30 bg-[#FCA311]/10 p-8">
        <h1 className="text-2xl font-semibold text-[var(--text-main)]">
          Project Entry overrides are GM-facing for now
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
          Your current role is {formatProjectRole(role)}. Player-facing
          visibility filters and reveal controls come later, so this first
          override editor is limited to Project Owners and GMs.
        </p>
      </section>
    </div>
  );
}

function ProjectEntryUnavailableState({ projectId }: { projectId?: string }) {
  return (
    <div className="space-y-8">
      <Link
        href={projectId ? `/projects/${projectId}/library` : "/projects"}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#FCA311] transition hover:text-[#ffb33c]"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        {projectId ? "Back to Project Library" : "Back to Projects"}
      </Link>
      <section className="rounded-lg border border-[#FCA311]/30 bg-[#FCA311]/10 p-8">
        <h1 className="text-2xl font-semibold text-[var(--text-main)]">
          Project Entry unavailable
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
          This Master Entry is not reachable through a Library Source attached
          to this Project, or Supabase RLS did not allow access.
        </p>
      </section>
    </div>
  );
}

function formatJson(value: unknown) {
  return JSON.stringify(value ?? {}, null, 2);
}
