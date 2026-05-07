"use client";

import { useActionState } from "react";
import { Library } from "lucide-react";

import { createSettingsLibraryAction } from "@/lib/settings-library-actions";
import { initialSettingsLibraryFormState } from "@/lib/settings-library-form-state";
import {
  LIBRARY_SOURCE_CATEGORY_OPTIONS,
  LIBRARY_SOURCE_CLONE_POLICY_OPTIONS,
  LIBRARY_SOURCE_PLAYER_VISIBILITY_OPTIONS,
  LIBRARY_SOURCE_SUBTYPE_OPTIONS,
} from "@/lib/library-source-taxonomy";
import type { GameSystemForSettingsLibraryForm } from "@/lib/settings-libraries";
import {
  SETTINGS_LIBRARY_DESCRIPTION_MAX_LENGTH,
  SETTINGS_LIBRARY_GENRE_MAX_LENGTH,
  SETTINGS_LIBRARY_NAME_MAX_LENGTH,
  SETTINGS_LIBRARY_SOURCE_NOTES_MAX_LENGTH,
  SETTINGS_LIBRARY_SOURCE_TYPES,
  SETTINGS_LIBRARY_TONE_MAX_LENGTH,
  SETTINGS_LIBRARY_VERSION_MAX_LENGTH,
  SETTINGS_LIBRARY_VISIBILITIES,
  type SettingsLibraryInput,
  type SettingsLibrarySourceType,
  type SettingsLibraryVisibility,
} from "@/lib/settings-library-validation";

type CreateSettingsLibraryFormProps = {
  defaultValues?: SettingsLibraryInput;
  gameSystems: GameSystemForSettingsLibraryForm[];
};

const fallbackValues: SettingsLibraryInput = {
  name: "",
  description: "",
  visibility: "private",
  genre: "",
  tone: "",
  sourceType: "manual",
  gameSystemId: "",
  sourceCategory: "setting_world_lore",
  sourceSubtype: "campaign_setting",
  clonePolicy: "cloneable_to_system",
  defaultPlayerVisibility: "gm_only",
  sourceUrl: "",
  sourceNotes: "",
  version: "1.0.0",
};

const visibilityLabels: Record<SettingsLibraryVisibility, string> = {
  private: "Private",
  shared: "Shared later",
  public: "Public",
};

const sourceTypeLabels: Record<SettingsLibrarySourceType, string> = {
  manual: "Manual",
  owned_notes: "Owned Notes",
  markdown_import: "Markdown Import",
  pdf_import: "PDF Import",
  csv_import: "CSV Import",
  campaign_export: "Campaign Export",
  external_reference: "External Reference",
  other: "Other",
};

export function CreateSettingsLibraryForm({
  defaultValues,
  gameSystems,
}: CreateSettingsLibraryFormProps) {
  const [state, formAction, isPending] = useActionState(
    createSettingsLibraryAction,
    initialSettingsLibraryFormState,
  );
  const values = defaultValues ?? fallbackValues;

  return (
    <form action={formAction} className="space-y-8">
      <section className="grid gap-5 lg:grid-cols-2">
        <TextInput
          label="Settings Library name"
          name="name"
          required
          maxLength={SETTINGS_LIBRARY_NAME_MAX_LENGTH}
          placeholder="Starter Fantasy Settings Library"
          defaultValue={values.name}
          error={state.fieldErrors?.name}
        />
        <Select
          label="Visibility"
          name="visibility"
          defaultValue={values.visibility}
          error={state.fieldErrors?.visibility}
          options={SETTINGS_LIBRARY_VISIBILITIES.map((visibility) => ({
            value: visibility,
            label: visibilityLabels[visibility],
          }))}
        />
      </section>

      <Textarea
        label="Description"
        name="description"
        rows={5}
        maxLength={SETTINGS_LIBRARY_DESCRIPTION_MAX_LENGTH}
        placeholder="A short note about the reusable lore container."
        defaultValue={values.description}
        error={state.fieldErrors?.description}
      />

      <section className="grid gap-5 lg:grid-cols-2">
        <TextInput
          label="Genre"
          name="genre"
          maxLength={SETTINGS_LIBRARY_GENRE_MAX_LENGTH}
          placeholder="Fantasy"
          defaultValue={values.genre}
          error={state.fieldErrors?.genre}
        />
        <TextInput
          label="Tone"
          name="tone"
          maxLength={SETTINGS_LIBRARY_TONE_MAX_LENGTH}
          placeholder="Adventurous, mysterious, table-ready"
          defaultValue={values.tone}
          error={state.fieldErrors?.tone}
        />
        <TextInput
          label="Version"
          name="version"
          required
          maxLength={SETTINGS_LIBRARY_VERSION_MAX_LENGTH}
          placeholder="0.1"
          defaultValue={values.version}
          error={state.fieldErrors?.version}
        />
        {gameSystems.length > 0 ? (
          <Select
            label="Game system"
            name="gameSystemId"
            defaultValue={values.gameSystemId}
            error={state.fieldErrors?.gameSystemId}
            options={gameSystems.map((system) => ({
              value: system.id,
              label: formatGameSystemOption(system),
            }))}
            placeholder="No system selected"
          />
        ) : null}
      </section>

      <section className="space-y-5 rounded-lg border border-[var(--line)] bg-black/15 p-5">
        <div>
          <h2 className="text-lg font-semibold text-[var(--text-main)]">
            Source and provenance
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
            Track where this master container came from. Entries and imports are
            intentionally left for later slices.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <Select
            label="Source type"
            name="sourceType"
            defaultValue={values.sourceType}
            error={state.fieldErrors?.sourceType}
            options={SETTINGS_LIBRARY_SOURCE_TYPES.map((sourceType) => ({
              value: sourceType,
              label: sourceTypeLabels[sourceType],
            }))}
          />
          <Select
            label="Source category"
            name="sourceCategory"
            defaultValue={values.sourceCategory}
            error={state.fieldErrors?.sourceCategory}
            options={LIBRARY_SOURCE_CATEGORY_OPTIONS.map((option) => ({
              value: option.value,
              label: option.label,
            }))}
          />
          <Select
            label="Source subtype"
            name="sourceSubtype"
            defaultValue={values.sourceSubtype}
            error={state.fieldErrors?.sourceSubtype}
            options={LIBRARY_SOURCE_SUBTYPE_OPTIONS.map((option) => ({
              value: option.value,
              label: option.label,
            }))}
          />
          <Select
            label="Clone policy"
            name="clonePolicy"
            defaultValue={values.clonePolicy}
            error={state.fieldErrors?.clonePolicy}
            options={LIBRARY_SOURCE_CLONE_POLICY_OPTIONS.map((option) => ({
              value: option.value,
              label: option.label,
            }))}
          />
          <Select
            label="Default player visibility"
            name="defaultPlayerVisibility"
            defaultValue={values.defaultPlayerVisibility}
            error={state.fieldErrors?.defaultPlayerVisibility}
            options={LIBRARY_SOURCE_PLAYER_VISIBILITY_OPTIONS.map((option) => ({
              value: option.value,
              label: option.label,
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
          maxLength={SETTINGS_LIBRARY_SOURCE_NOTES_MAX_LENGTH}
          placeholder="Container only. No setting entries or imported lore content."
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
        <Library aria-hidden="true" className="h-4 w-4" />
        {isPending ? "Creating..." : "Create Settings Library"}
      </button>
    </form>
  );
}

function formatGameSystemOption(system: GameSystemForSettingsLibraryForm) {
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
}: {
  label: string;
  name: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
  defaultValue: string;
  placeholder?: string;
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
        {placeholder ? <option value="">{placeholder}</option> : null}
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
