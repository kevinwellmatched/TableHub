"use client";

import { useActionState } from "react";
import { Boxes } from "lucide-react";

import { createGameSystemAction } from "@/lib/game-system-actions";
import { initialGameSystemFormState } from "@/lib/game-system-form-state";
import {
  GAME_SYSTEM_DESCRIPTION_MAX_LENGTH,
  GAME_SYSTEM_EDITION_MAX_LENGTH,
  GAME_SYSTEM_NAME_MAX_LENGTH,
  GAME_SYSTEM_PUBLISHER_MAX_LENGTH,
  GAME_SYSTEM_SOURCE_NOTES_MAX_LENGTH,
  GAME_SYSTEM_SOURCE_TYPES,
  GAME_SYSTEM_VERSION_MAX_LENGTH,
  GAME_SYSTEM_VISIBILITIES,
  type GameSystemInput,
  type GameSystemSourceType,
  type GameSystemVisibility,
} from "@/lib/game-system-validation";

type CreateGameSystemFormProps = {
  defaultValues?: GameSystemInput;
};

const fallbackValues: GameSystemInput = {
  name: "",
  edition: "",
  publisher: "",
  description: "",
  rulesetYear: "",
  visibility: "private",
  licenseName: "",
  licenseUrl: "",
  sourceType: "manual",
  sourceUrl: "",
  sourceNotes: "",
  version: "1.0.0",
};

const visibilityLabels: Record<GameSystemVisibility, string> = {
  private: "Private",
  shared: "Shared later",
  public: "Public",
};

const sourceTypeLabels: Record<GameSystemSourceType, string> = {
  manual: "Manual",
  srd: "SRD",
  private_markdown: "Private Markdown",
  pdf: "PDF",
  csv: "CSV",
  copy_paste: "Copy/Paste",
  external_reference: "External Reference",
};

export function CreateGameSystemForm({ defaultValues }: CreateGameSystemFormProps) {
  const [state, formAction, isPending] = useActionState(
    createGameSystemAction,
    initialGameSystemFormState,
  );
  const values = defaultValues ?? fallbackValues;

  return (
    <form action={formAction} className="space-y-8">
      <section className="grid gap-5 lg:grid-cols-2">
        <TextInput
          label="System name"
          name="name"
          required
          maxLength={GAME_SYSTEM_NAME_MAX_LENGTH}
          placeholder="D&D 5e 2014"
          defaultValue={values.name}
          error={state.fieldErrors?.name}
        />
        <TextInput
          label="Edition"
          name="edition"
          maxLength={GAME_SYSTEM_EDITION_MAX_LENGTH}
          placeholder="5th Edition"
          defaultValue={values.edition}
          error={state.fieldErrors?.edition}
        />
        <TextInput
          label="Publisher"
          name="publisher"
          maxLength={GAME_SYSTEM_PUBLISHER_MAX_LENGTH}
          placeholder="Wizards of the Coast"
          defaultValue={values.publisher}
          error={state.fieldErrors?.publisher}
        />
        <TextInput
          label="Ruleset year"
          name="rulesetYear"
          inputMode="numeric"
          placeholder="2014"
          defaultValue={values.rulesetYear}
          error={state.fieldErrors?.rulesetYear}
        />
      </section>

      <Textarea
        label="Description"
        name="description"
        rows={5}
        maxLength={GAME_SYSTEM_DESCRIPTION_MAX_LENGTH}
        placeholder="A short foundation note for this ruleset."
        defaultValue={values.description}
        error={state.fieldErrors?.description}
      />

      <section className="grid gap-5 lg:grid-cols-2">
        <Select
          label="Visibility"
          name="visibility"
          defaultValue={values.visibility}
          error={state.fieldErrors?.visibility}
          options={GAME_SYSTEM_VISIBILITIES.map((visibility) => ({
            value: visibility,
            label: visibilityLabels[visibility],
          }))}
        />
        <TextInput
          label="Version"
          name="version"
          required
          maxLength={GAME_SYSTEM_VERSION_MAX_LENGTH}
          placeholder="1.0.0"
          defaultValue={values.version}
          error={state.fieldErrors?.version}
        />
      </section>

      <section className="space-y-5 rounded-lg border border-[var(--line)] bg-black/15 p-5">
        <div>
          <h2 className="text-lg font-semibold text-[var(--text-main)]">
            Source and provenance
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
            Record where this system metadata came from now, before future imports add
            rules, entries, and book references.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <TextInput
            label="License name"
            name="licenseName"
            placeholder="SRD 5.1 Creative Commons"
            defaultValue={values.licenseName}
            error={state.fieldErrors?.licenseName}
          />
          <TextInput
            label="License URL"
            name="licenseUrl"
            type="url"
            placeholder="https://example.com/license"
            defaultValue={values.licenseUrl}
            error={state.fieldErrors?.licenseUrl}
          />
          <Select
            label="Source type"
            name="sourceType"
            defaultValue={values.sourceType}
            error={state.fieldErrors?.sourceType}
            options={GAME_SYSTEM_SOURCE_TYPES.map((sourceType) => ({
              value: sourceType,
              label: sourceTypeLabels[sourceType],
            }))}
          />
          <TextInput
            label="Source URL"
            name="sourceUrl"
            type="url"
            placeholder="https://example.com/source"
            defaultValue={values.sourceUrl}
            error={state.fieldErrors?.sourceUrl}
          />
        </div>

        <Textarea
          label="Source notes"
          name="sourceNotes"
          rows={4}
          maxLength={GAME_SYSTEM_SOURCE_NOTES_MAX_LENGTH}
          placeholder="System metadata only. No compendium book content imported in Slice 4A."
          defaultValue={values.sourceNotes}
          error={state.fieldErrors?.sourceNotes}
        />
      </section>

      {state.message ? <p className="text-sm text-[#FCA311]">{state.message}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#FCA311] px-4 text-sm font-semibold text-black transition hover:bg-[#ffb33c] disabled:cursor-not-allowed disabled:opacity-65 sm:w-auto"
      >
        <Boxes aria-hidden="true" className="h-4 w-4" />
        {isPending ? "Creating..." : "Create System"}
      </button>
    </form>
  );
}

function TextInput({
  label,
  name,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  error?: string;
}) {
  const errorId = `${name}-error`;

  return (
    <label className="block">
      <span className="text-sm font-medium text-[var(--text-main)]">{label}</span>
      <input
        name={name}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? errorId : undefined}
        className="mt-2 h-11 w-full rounded-lg border border-[var(--line)] bg-black/25 px-3 text-sm text-[var(--text-main)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[#FCA311] focus:ring-2 focus:ring-[#FCA311]/20"
        {...props}
      />
      {error ? (
        <span id={errorId} className="mt-2 block text-sm text-[#FCA311]">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function Textarea({
  label,
  name,
  error,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  name: string;
  error?: string;
}) {
  const errorId = `${name}-error`;

  return (
    <label className="block">
      <span className="text-sm font-medium text-[var(--text-main)]">{label}</span>
      <textarea
        name={name}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? errorId : undefined}
        className="mt-2 w-full resize-y rounded-lg border border-[var(--line)] bg-black/25 px-3 py-3 text-sm leading-6 text-[var(--text-main)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[#FCA311] focus:ring-2 focus:ring-[#FCA311]/20"
        {...props}
      />
      {error ? (
        <span id={errorId} className="mt-2 block text-sm text-[#FCA311]">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function Select({
  label,
  name,
  error,
  options,
  defaultValue,
}: {
  label: string;
  name: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
  defaultValue: string;
}) {
  const errorId = `${name}-error`;

  return (
    <label className="block">
      <span className="text-sm font-medium text-[var(--text-main)]">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? errorId : undefined}
        className="mt-2 h-11 w-full rounded-lg border border-[var(--line)] bg-black/25 px-3 text-sm text-[var(--text-main)] outline-none transition focus:border-[#FCA311] focus:ring-2 focus:ring-[#FCA311]/20"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <span id={errorId} className="mt-2 block text-sm text-[#FCA311]">
          {error}
        </span>
      ) : null}
    </label>
  );
}
