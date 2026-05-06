"use client";

import { useActionState } from "react";
import { BookOpen } from "lucide-react";

import { createCompendiumAction } from "@/lib/compendium-actions";
import { initialCompendiumFormState } from "@/lib/compendium-form-state";
import {
  COMPENDIUM_DESCRIPTION_MAX_LENGTH,
  COMPENDIUM_NAME_MAX_LENGTH,
  COMPENDIUM_SOURCE_NOTES_MAX_LENGTH,
  COMPENDIUM_SOURCE_TYPES,
  COMPENDIUM_VERSION_MAX_LENGTH,
  COMPENDIUM_VISIBILITIES,
  type CompendiumInput,
  type CompendiumSourceType,
  type CompendiumVisibility,
} from "@/lib/compendium-validation";
import type { GameSystemForCompendiumForm } from "@/lib/compendiums";

type CreateCompendiumFormProps = {
  defaultValues?: CompendiumInput;
  gameSystems: GameSystemForCompendiumForm[];
};

const fallbackValues: CompendiumInput = {
  name: "",
  description: "",
  gameSystemId: "",
  visibility: "private",
  licenseName: "",
  licenseUrl: "",
  sourceType: "manual",
  sourceUrl: "",
  sourceNotes: "",
  version: "1.0.0",
};

const visibilityLabels: Record<CompendiumVisibility, string> = {
  private: "Private",
  shared: "Shared later",
  public: "Public",
};

const sourceTypeLabels: Record<CompendiumSourceType, string> = {
  manual: "Manual",
  srd: "SRD",
  owned_book: "Owned Book",
  markdown_import: "Markdown Import",
  pdf_import: "PDF Import",
  csv_import: "CSV Import",
  external_reference: "External Reference",
  other: "Other",
};

export function CreateCompendiumForm({
  defaultValues,
  gameSystems,
}: CreateCompendiumFormProps) {
  const [state, formAction, isPending] = useActionState(
    createCompendiumAction,
    initialCompendiumFormState,
  );
  const values = defaultValues ?? fallbackValues;

  return (
    <form action={formAction} className="space-y-8">
      <section className="grid gap-5 lg:grid-cols-2">
        <TextInput
          label="Compendium name"
          name="name"
          required
          maxLength={COMPENDIUM_NAME_MAX_LENGTH}
          placeholder="D&D 5e 2014 Starter Compendium"
          defaultValue={values.name}
          error={state.fieldErrors?.name}
        />
        <Select
          label="Game system"
          name="gameSystemId"
          required
          defaultValue={values.gameSystemId}
          error={state.fieldErrors?.gameSystemId}
          options={gameSystems.map((system) => ({
            value: system.id,
            label: formatGameSystemOption(system),
          }))}
          placeholder="Choose a game system"
        />
      </section>

      <Textarea
        label="Description"
        name="description"
        rows={5}
        maxLength={COMPENDIUM_DESCRIPTION_MAX_LENGTH}
        placeholder="A short note about what this master compendium will contain later."
        defaultValue={values.description}
        error={state.fieldErrors?.description}
      />

      <section className="grid gap-5 lg:grid-cols-2">
        <Select
          label="Visibility"
          name="visibility"
          defaultValue={values.visibility}
          error={state.fieldErrors?.visibility}
          options={COMPENDIUM_VISIBILITIES.map((visibility) => ({
            value: visibility,
            label: visibilityLabels[visibility],
          }))}
        />
        <TextInput
          label="Version"
          name="version"
          required
          maxLength={COMPENDIUM_VERSION_MAX_LENGTH}
          placeholder="0.1"
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
            Track the origin and license notes for this master container. Entries and
            imports are intentionally left for later slices.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <TextInput
            label="License name"
            name="licenseName"
            placeholder="Manual placeholder"
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
            options={COMPENDIUM_SOURCE_TYPES.map((sourceType) => ({
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
          maxLength={COMPENDIUM_SOURCE_NOTES_MAX_LENGTH}
          placeholder="Container only. No rules text or third-party data imported."
          defaultValue={values.sourceNotes}
          error={state.fieldErrors?.sourceNotes}
        />
      </section>

      {state.message ? <p className="text-sm text-[#FCA311]">{state.message}</p> : null}

      <button
        type="submit"
        disabled={isPending || gameSystems.length === 0}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#FCA311] px-4 text-sm font-semibold text-black transition hover:bg-[#ffb33c] disabled:cursor-not-allowed disabled:opacity-65 sm:w-auto"
      >
        <BookOpen aria-hidden="true" className="h-4 w-4" />
        {isPending ? "Creating..." : "Create Compendium"}
      </button>
    </form>
  );
}

function formatGameSystemOption(system: GameSystemForCompendiumForm) {
  const details = [system.edition, system.publisher].filter(Boolean).join(" - ");
  return details ? `${system.name} (${details})` : system.name;
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
  placeholder,
  required,
}: {
  label: string;
  name: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
  defaultValue: string;
  placeholder?: string;
  required?: boolean;
}) {
  const errorId = `${name}-error`;

  return (
    <label className="block">
      <span className="text-sm font-medium text-[var(--text-main)]">{label}</span>
      <select
        name={name}
        required={required}
        defaultValue={defaultValue}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? errorId : undefined}
        className="mt-2 h-11 w-full rounded-lg border border-[var(--line)] bg-black/25 px-3 text-sm text-[var(--text-main)] outline-none transition focus:border-[#FCA311] focus:ring-2 focus:ring-[#FCA311]/20"
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
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
