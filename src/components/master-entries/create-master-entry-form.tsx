"use client";

import { useActionState, useState } from "react";
import { FileText, Sparkles } from "lucide-react";

import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { createMasterEntryAction } from "@/lib/master-entry-actions";
import { initialMasterEntryFormState } from "@/lib/master-entry-form-state";
import type { MasterEntryFormOptions } from "@/lib/master-entries";
import {
  MASTER_ENTRY_LIBRARY_KINDS,
  MASTER_ENTRY_SORT_ORDER_MAX,
  MASTER_ENTRY_SORT_ORDER_MIN,
  MASTER_ENTRY_SOURCE_TYPES,
  MASTER_ENTRY_SUMMARY_MAX_LENGTH,
  MASTER_ENTRY_TITLE_MAX_LENGTH,
  MASTER_ENTRY_VISIBILITIES,
  MASTER_ENTRY_VERSION_MAX_LENGTH,
  type MasterEntryBodyFormat,
  type MasterEntryInput,
  type MasterEntryLibraryKind,
  type MasterEntrySourceType,
  type MasterEntryVisibility,
} from "@/lib/master-entry-validation";

const fallbackValues: MasterEntryInput = {
  libraryKind: "compendium",
  compendiumId: "",
  settingsLibraryId: "",
  entryTypeId: "",
  title: "",
  aliases: "",
  summary: "",
  body: "",
  bodyFormat: "plain_text",
  properties: "{}",
  visibility: "private",
  sortOrder: "0",
  licenseName: "",
  licenseUrl: "",
  sourceType: "manual",
  sourceUrl: "",
  sourceNotes: "",
  version: "0.1",
};

const starterPresets: Array<
  Omit<MasterEntryInput, "compendiumId" | "settingsLibraryId" | "entryTypeId"> & {
    label: string;
  }
> = [
  {
    label: "Compendium Rule Note",
    libraryKind: "compendium",
    title: "Sample Rule Note",
    aliases: "",
    summary:
      "A simple master compendium entry for testing rules/reference content.",
    bodyFormat: "markdown",
    body:
      "This is placeholder text only. Replace it with your own original or properly licensed content.",
    properties: "{}",
    visibility: "private",
    sourceType: "manual",
    sourceNotes:
      "Placeholder entry only. No copyrighted rules text or imported content.",
    version: "0.1",
    sortOrder: "10",
    licenseName: "",
    licenseUrl: "",
    sourceUrl: "",
  },
  {
    label: "Compendium Item Note",
    libraryKind: "compendium",
    title: "Sample Item Note",
    aliases: "",
    summary:
      "A simple master compendium entry for testing equipment, treasure, or item-style content.",
    bodyFormat: "markdown",
    body:
      "This is placeholder text only. Replace it with your own original or properly licensed content.",
    properties: "{}",
    visibility: "private",
    sourceType: "manual",
    sourceNotes:
      "Placeholder entry only. No copyrighted rules text or imported content.",
    version: "0.1",
    sortOrder: "20",
    licenseName: "",
    licenseUrl: "",
    sourceUrl: "",
  },
  {
    label: "Settings NPC Note",
    libraryKind: "settings_library",
    title: "Sample NPC Note",
    aliases: "",
    summary: "A simple master Settings Library entry for testing NPC-style lore.",
    bodyFormat: "markdown",
    body:
      "This is placeholder lore only. Replace it with your own original setting material.",
    properties: "{}",
    visibility: "private",
    sourceType: "manual",
    sourceNotes:
      "Placeholder entry only. No imported notes or third-party setting content.",
    version: "0.1",
    sortOrder: "10",
    licenseName: "",
    licenseUrl: "",
    sourceUrl: "",
  },
  {
    label: "Settings Place Note",
    libraryKind: "settings_library",
    title: "Sample Place Note",
    aliases: "",
    summary:
      "A simple master Settings Library entry for testing place-style lore.",
    bodyFormat: "markdown",
    body:
      "This is placeholder lore only. Replace it with your own original setting material.",
    properties: "{}",
    visibility: "private",
    sourceType: "manual",
    sourceNotes:
      "Placeholder entry only. No imported notes or third-party setting content.",
    version: "0.1",
    sortOrder: "20",
    licenseName: "",
    licenseUrl: "",
    sourceUrl: "",
  },
];

const libraryKindLabels: Record<MasterEntryLibraryKind, string> = {
  compendium: "Compendium",
  settings_library: "Settings Library",
};

const visibilityLabels: Record<MasterEntryVisibility, string> = {
  private: "Private",
  shared: "Shared later",
  public: "Public",
};

const sourceTypeLabels: Record<MasterEntrySourceType, string> = {
  manual: "Manual",
  srd: "SRD",
  owned_book: "Owned Book",
  owned_notes: "Owned Notes",
  markdown_import: "Markdown Import",
  pdf_import: "PDF Import",
  csv_import: "CSV Import",
  external_reference: "External Reference",
  other: "Other",
};

export function CreateMasterEntryForm({ options }: { options: MasterEntryFormOptions }) {
  const [state, formAction, isPending] = useActionState(
    createMasterEntryAction,
    initialMasterEntryFormState,
  );
  const [values, setValues] = useState<MasterEntryInput>({
    ...fallbackValues,
    compendiumId: options.compendiums[0]?.id ?? "",
    settingsLibraryId: "",
    entryTypeId:
      options.entryTypes.find((entryType) => entryType.library_kind === "compendium")
        ?.id ?? "",
  });
  const [editorRevision, setEditorRevision] = useState(0);

  const selectedLibraryKind = values.libraryKind as MasterEntryLibraryKind;
  const matchingEntryTypes = options.entryTypes.filter(
    (entryType) => entryType.library_kind === selectedLibraryKind,
  );

  function updateValue(field: keyof MasterEntryInput, value: string) {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  }

  function updateLibraryKind(libraryKind: string) {
    const nextLibraryKind = libraryKind as MasterEntryLibraryKind;
    const firstEntryType =
      options.entryTypes.find(
        (entryType) => entryType.library_kind === nextLibraryKind,
      )?.id ?? "";

    setValues((currentValues) => ({
      ...currentValues,
      libraryKind: nextLibraryKind,
      compendiumId:
        nextLibraryKind === "compendium"
          ? currentValues.compendiumId || options.compendiums[0]?.id || ""
          : "",
      settingsLibraryId:
        nextLibraryKind === "settings_library"
          ? currentValues.settingsLibraryId ||
            options.settingsLibraries[0]?.id ||
            ""
          : "",
      entryTypeId: firstEntryType,
    }));
  }

  function applyPreset(
    preset: Omit<
      MasterEntryInput,
      "compendiumId" | "settingsLibraryId" | "entryTypeId"
    >,
  ) {
    const nextLibraryKind = preset.libraryKind as MasterEntryLibraryKind;
    const firstEntryType =
      options.entryTypes.find(
        (entryType) => entryType.library_kind === nextLibraryKind,
      )?.id ?? "";

    setValues((currentValues) => ({
      ...preset,
      compendiumId:
        nextLibraryKind === "compendium"
          ? currentValues.compendiumId || options.compendiums[0]?.id || ""
          : "",
      settingsLibraryId:
        nextLibraryKind === "settings_library"
          ? currentValues.settingsLibraryId ||
            options.settingsLibraries[0]?.id ||
            ""
          : "",
      entryTypeId: firstEntryType,
    }));
    setEditorRevision((currentRevision) => currentRevision + 1);
  }

  return (
    <form action={formAction} className="space-y-8">
      <section className="space-y-4 rounded-lg border border-[#FCA311]/30 bg-[#FCA311]/10 p-5">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-[#FCA311]">
            <Sparkles aria-hidden="true" className="h-4 w-4" />
            Starter presets
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
            Presets fill the form only. They do not create imports, tags,
            folders, project links, or overrides.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {starterPresets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => applyPreset(preset)}
              className="rounded-lg border border-[#FCA311]/35 px-3 py-2 text-sm font-semibold text-[#FCA311] transition hover:bg-[#FCA311] hover:text-black"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <Select
          label="Library kind"
          name="libraryKind"
          value={values.libraryKind}
          onChange={(event) => updateLibraryKind(event.target.value)}
          error={state.fieldErrors?.libraryKind}
          options={MASTER_ENTRY_LIBRARY_KINDS.map((libraryKind) => ({
            value: libraryKind,
            label: libraryKindLabels[libraryKind],
          }))}
        />

        {values.libraryKind === "compendium" ? (
          <>
            <Select
              label="Parent Compendium"
              name="compendiumId"
              value={values.compendiumId}
              onChange={(event) => updateValue("compendiumId", event.target.value)}
              error={state.fieldErrors?.compendiumId}
              options={[
                { value: "", label: "Choose a Compendium" },
                ...options.compendiums.map((compendium) => ({
                  value: compendium.id,
                  label: compendium.name,
                })),
              ]}
            />
            <input type="hidden" name="settingsLibraryId" value="" />
          </>
        ) : (
          <>
            <Select
              label="Parent Settings Library"
              name="settingsLibraryId"
              value={values.settingsLibraryId}
              onChange={(event) =>
                updateValue("settingsLibraryId", event.target.value)
              }
              error={state.fieldErrors?.settingsLibraryId}
              options={[
                { value: "", label: "Choose a Settings Library" },
                ...options.settingsLibraries.map((settingsLibrary) => ({
                  value: settingsLibrary.id,
                  label: settingsLibrary.name,
                })),
              ]}
            />
            <input type="hidden" name="compendiumId" value="" />
          </>
        )}
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <Select
          label="Entry Type"
          name="entryTypeId"
          value={values.entryTypeId}
          onChange={(event) => updateValue("entryTypeId", event.target.value)}
          error={state.fieldErrors?.entryTypeId}
          options={[
            { value: "", label: "Choose an Entry Type" },
            ...matchingEntryTypes.map((entryType) => ({
              value: entryType.id,
              label: entryType.name,
            })),
          ]}
        />
        <TextInput
          label="Title"
          name="title"
          required
          maxLength={MASTER_ENTRY_TITLE_MAX_LENGTH}
          placeholder="Sample Rule Note"
          value={values.title}
          onChange={(event) => updateValue("title", event.target.value)}
          error={state.fieldErrors?.title}
        />
      </section>

      <TextInput
        label="Aliases"
        name="aliases"
        placeholder="Optional comma-separated aliases"
        value={values.aliases}
        onChange={(event) => updateValue("aliases", event.target.value)}
        error={state.fieldErrors?.aliases}
      />

      <Textarea
        label="Summary"
        name="summary"
        rows={4}
        maxLength={MASTER_ENTRY_SUMMARY_MAX_LENGTH}
        placeholder="A short plain-English summary."
        value={values.summary}
        onChange={(event) => updateValue("summary", event.target.value)}
        error={state.fieldErrors?.summary}
      />

      <RichTextEditor
        key={editorRevision}
        label="Body"
        name="body"
        initialContent={values.body}
        initialFormat={values.bodyFormat as MasterEntryBodyFormat}
        description="Rich text saves as sanitized HTML. Legacy plain text and Markdown-looking content can still be opened and saved."
        placeholder="Write the entry body."
        minHeight={260}
        formatFieldName="bodyFormat"
        formatFieldValue="html"
        error={state.fieldErrors?.body ?? state.fieldErrors?.bodyFormat}
      />

      <Textarea
        label="Properties JSON"
        name="properties"
        rows={5}
        value={values.properties}
        onChange={(event) => updateValue("properties", event.target.value)}
        error={state.fieldErrors?.properties}
      />

      <section className="grid gap-5 lg:grid-cols-3">
        <Select
          label="Visibility"
          name="visibility"
          value={values.visibility}
          onChange={(event) => updateValue("visibility", event.target.value)}
          error={state.fieldErrors?.visibility}
          options={MASTER_ENTRY_VISIBILITIES.map((visibility) => ({
            value: visibility,
            label: visibilityLabels[visibility],
          }))}
        />
        <TextInput
          label="Sort order"
          name="sortOrder"
          type="number"
          min={MASTER_ENTRY_SORT_ORDER_MIN}
          max={MASTER_ENTRY_SORT_ORDER_MAX}
          step={1}
          value={values.sortOrder}
          onChange={(event) => updateValue("sortOrder", event.target.value)}
          error={state.fieldErrors?.sortOrder}
        />
        <TextInput
          label="Version"
          name="version"
          required
          maxLength={MASTER_ENTRY_VERSION_MAX_LENGTH}
          value={values.version}
          onChange={(event) => updateValue("version", event.target.value)}
          error={state.fieldErrors?.version}
        />
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <Select
          label="Source type"
          name="sourceType"
          value={values.sourceType}
          onChange={(event) => updateValue("sourceType", event.target.value)}
          error={state.fieldErrors?.sourceType}
          options={MASTER_ENTRY_SOURCE_TYPES.map((sourceType) => ({
            value: sourceType,
            label: sourceTypeLabels[sourceType],
          }))}
        />
        <TextInput
          label="License name"
          name="licenseName"
          value={values.licenseName}
          onChange={(event) => updateValue("licenseName", event.target.value)}
          error={state.fieldErrors?.licenseName}
        />
        <TextInput
          label="License URL"
          name="licenseUrl"
          type="url"
          value={values.licenseUrl}
          onChange={(event) => updateValue("licenseUrl", event.target.value)}
          error={state.fieldErrors?.licenseUrl}
        />
        <TextInput
          label="Source URL"
          name="sourceUrl"
          type="url"
          value={values.sourceUrl}
          onChange={(event) => updateValue("sourceUrl", event.target.value)}
          error={state.fieldErrors?.sourceUrl}
        />
      </section>

      <Textarea
        label="Source notes"
        name="sourceNotes"
        rows={4}
        value={values.sourceNotes}
        onChange={(event) => updateValue("sourceNotes", event.target.value)}
        error={state.fieldErrors?.sourceNotes}
      />

      {state.message ? <p className="text-sm text-[#FCA311]">{state.message}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#FCA311] px-4 text-sm font-semibold text-black transition hover:bg-[#ffb33c] disabled:cursor-not-allowed disabled:opacity-65 sm:w-auto"
      >
        <FileText aria-hidden="true" className="h-4 w-4" />
        {isPending ? "Creating..." : "Create Master Entry"}
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
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  name: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}) {
  const errorId = `${name}-error`;

  return (
    <label className="block">
      <span className="text-sm font-medium text-[var(--text-main)]">{label}</span>
      <select
        name={name}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? errorId : undefined}
        className="mt-2 h-11 w-full rounded-lg border border-[var(--line)] bg-black/25 px-3 text-sm text-[var(--text-main)] outline-none transition focus:border-[#FCA311] focus:ring-2 focus:ring-[#FCA311]/20"
        {...props}
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
