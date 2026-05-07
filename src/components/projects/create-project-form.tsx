"use client";

import { useActionState } from "react";
import { FolderPlus } from "lucide-react";

import { createProjectAction } from "@/lib/project-actions";
import { initialProjectFormState } from "@/lib/project-form-state";
import {
  PROJECT_DESCRIPTION_MAX_LENGTH,
  PROJECT_NAME_MAX_LENGTH,
} from "@/lib/project-validation";
import type { GameSystemForProjectForm } from "@/lib/projects";

type CreateProjectFormProps = {
  gameSystems: GameSystemForProjectForm[];
};

export function CreateProjectForm({ gameSystems }: CreateProjectFormProps) {
  const [state, formAction, isPending] = useActionState(
    createProjectAction,
    initialProjectFormState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <label className="block">
        <span className="text-sm font-medium text-[var(--text-main)]">
          Project name
        </span>
        <input
          name="projectName"
          type="text"
          required
          maxLength={PROJECT_NAME_MAX_LENGTH}
          aria-invalid={state.fieldErrors?.projectName ? "true" : "false"}
          aria-describedby={
            state.fieldErrors?.projectName ? "projectName-error" : undefined
          }
          placeholder="The Ember Vault"
          className="mt-2 h-11 w-full rounded-lg border border-[var(--line)] bg-black/25 px-3 text-sm text-[var(--text-main)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[#FCA311] focus:ring-2 focus:ring-[#FCA311]/20"
        />
        {state.fieldErrors?.projectName ? (
          <span id="projectName-error" className="mt-2 block text-sm text-[#FCA311]">
            {state.fieldErrors.projectName}
          </span>
        ) : null}
      </label>

      {gameSystems.length > 0 ? (
        <label className="block">
          <span className="text-sm font-medium text-[var(--text-main)]">
            Primary System
          </span>
          <select
            name="primaryGameSystemId"
            defaultValue=""
            aria-invalid={state.fieldErrors?.primaryGameSystemId ? "true" : "false"}
            aria-describedby={
              state.fieldErrors?.primaryGameSystemId
                ? "primaryGameSystemId-error"
                : "primaryGameSystemId-help"
            }
            className="mt-2 h-11 w-full rounded-lg border border-[var(--line)] bg-black/25 px-3 text-sm text-[var(--text-main)] outline-none transition focus:border-[#FCA311] focus:ring-2 focus:ring-[#FCA311]/20"
          >
            <option value="">No primary System yet</option>
            {gameSystems.map((system) => (
              <option key={system.id} value={system.id}>
                {formatGameSystemOption(system)}
              </option>
            ))}
          </select>
          {state.fieldErrors?.primaryGameSystemId ? (
            <span
              id="primaryGameSystemId-error"
              className="mt-2 block text-sm text-[#FCA311]"
            >
              {state.fieldErrors.primaryGameSystemId}
            </span>
          ) : (
            <span
              id="primaryGameSystemId-help"
              className="mt-2 block text-sm text-[var(--text-muted)]"
            >
              Optional for this slice. Choosing one helps filter future Project
              Library sources.
            </span>
          )}
        </label>
      ) : null}

      <label className="block">
        <span className="text-sm font-medium text-[var(--text-main)]">
          Description
        </span>
        <textarea
          name="projectDescription"
          rows={6}
          maxLength={PROJECT_DESCRIPTION_MAX_LENGTH}
          aria-invalid={state.fieldErrors?.projectDescription ? "true" : "false"}
          aria-describedby={
            state.fieldErrors?.projectDescription
              ? "projectDescription-error"
              : "projectDescription-help"
          }
          placeholder="A reusable workspace for rules, lore, campaigns, files, and table prep."
          className="mt-2 w-full resize-y rounded-lg border border-[var(--line)] bg-black/25 px-3 py-3 text-sm leading-6 text-[var(--text-main)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[#FCA311] focus:ring-2 focus:ring-[#FCA311]/20"
        />
        {state.fieldErrors?.projectDescription ? (
          <span
            id="projectDescription-error"
            className="mt-2 block text-sm text-[#FCA311]"
          >
            {state.fieldErrors.projectDescription}
          </span>
        ) : (
          <span
            id="projectDescription-help"
            className="mt-2 block text-sm text-[var(--text-muted)]"
          >
            Optional. Keep it short enough that future players and GMs can scan it.
          </span>
        )}
      </label>

      {state.message ? <p className="text-sm text-[#FCA311]">{state.message}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#FCA311] px-4 text-sm font-semibold text-black transition hover:bg-[#ffb33c] disabled:cursor-not-allowed disabled:opacity-65 sm:w-auto"
      >
        <FolderPlus aria-hidden="true" className="h-4 w-4" />
        {isPending ? "Creating..." : "Create Project"}
      </button>
    </form>
  );
}

function formatGameSystemOption(system: GameSystemForProjectForm) {
  const details = [system.edition, system.publisher].filter(Boolean).join(" - ");
  return details ? `${system.name} (${details})` : system.name;
}
