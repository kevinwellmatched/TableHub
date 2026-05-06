"use client";

import { useActionState, useState } from "react";
import { Sparkles, Tags } from "lucide-react";

import { createEntryTypeAction } from "@/lib/entry-type-actions";
import { initialEntryTypeFormState } from "@/lib/entry-type-form-state";
import {
  ENTRY_TYPE_DESCRIPTION_MAX_LENGTH,
  ENTRY_TYPE_LIBRARY_KINDS,
  ENTRY_TYPE_NAME_MAX_LENGTH,
  ENTRY_TYPE_SORT_ORDER_MAX,
  ENTRY_TYPE_SORT_ORDER_MIN,
  ENTRY_TYPE_VISIBILITIES,
  type EntryTypeInput,
  type EntryTypeLibraryKind,
  type EntryTypeVisibility,
} from "@/lib/entry-type-validation";

const fallbackValues: EntryTypeInput = {
  name: "",
  description: "",
  libraryKind: "compendium",
  visibility: "private",
  sortOrder: "0",
};

const starterPresets: Array<
  EntryTypeInput & {
    label: string;
  }
> = [
  {
    label: "Rule",
    libraryKind: "compendium",
    name: "Rule",
    description:
      "General rules reference entries for a game system or compendium.",
    visibility: "private",
    sortOrder: "10",
  },
  {
    label: "Spell",
    libraryKind: "compendium",
    name: "Spell",
    description: "Spell, power, or ability reference entries.",
    visibility: "private",
    sortOrder: "20",
  },
  {
    label: "Item",
    libraryKind: "compendium",
    name: "Item",
    description: "Equipment, treasure, gear, or magic item entries.",
    visibility: "private",
    sortOrder: "30",
  },
  {
    label: "Monster",
    libraryKind: "compendium",
    name: "Monster",
    description: "Creature, adversary, stat block, or bestiary entries.",
    visibility: "private",
    sortOrder: "40",
  },
  {
    label: "Custom Compendium Type",
    libraryKind: "compendium",
    name: "Custom Compendium Type",
    description:
      "A custom rules/reference entry type for this creator's master compendiums.",
    visibility: "private",
    sortOrder: "100",
  },
  {
    label: "NPC",
    libraryKind: "settings_library",
    name: "NPC",
    description:
      "People, allies, rivals, contacts, villains, and other characters in a setting.",
    visibility: "private",
    sortOrder: "10",
  },
  {
    label: "Place",
    libraryKind: "settings_library",
    name: "Place",
    description:
      "Locations, settlements, landmarks, regions, rooms, planes, or points of interest.",
    visibility: "private",
    sortOrder: "20",
  },
  {
    label: "Faction",
    libraryKind: "settings_library",
    name: "Faction",
    description:
      "Organizations, guilds, houses, cults, governments, crews, or other groups.",
    visibility: "private",
    sortOrder: "30",
  },
  {
    label: "Deity",
    libraryKind: "settings_library",
    name: "Deity",
    description:
      "Gods, patrons, spirits, powers, saints, cosmic forces, or mythic beings.",
    visibility: "private",
    sortOrder: "40",
  },
  {
    label: "Timeline Event",
    libraryKind: "settings_library",
    name: "Timeline Event",
    description:
      "Historical events, campaign milestones, prophecies, eras, or scheduled future events.",
    visibility: "private",
    sortOrder: "50",
  },
  {
    label: "Custom Settings Type",
    libraryKind: "settings_library",
    name: "Custom Settings Type",
    description:
      "A custom lore/settings entry type for this creator's master Settings Libraries.",
    visibility: "private",
    sortOrder: "100",
  },
];

const libraryKindLabels: Record<EntryTypeLibraryKind, string> = {
  compendium: "Compendium",
  settings_library: "Settings Library",
};

const visibilityLabels: Record<EntryTypeVisibility, string> = {
  private: "Private",
  shared: "Shared later",
  public: "Public",
};

export function CreateEntryTypeForm() {
  const [state, formAction, isPending] = useActionState(
    createEntryTypeAction,
    initialEntryTypeFormState,
  );
  const [values, setValues] = useState<EntryTypeInput>(fallbackValues);

  function updateValue(field: keyof EntryTypeInput, value: string) {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  }

  function applyPreset(preset: EntryTypeInput) {
    setValues(preset);
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
            Presets fill the form only. They do not create compendium entries,
            setting entries, imports, tags, folders, or field schemas.
          </p>
        </div>

        <PresetGroup
          title="Compendium presets"
          presets={starterPresets.filter(
            (preset) => preset.libraryKind === "compendium",
          )}
          onApplyPreset={applyPreset}
        />
        <PresetGroup
          title="Settings Library presets"
          presets={starterPresets.filter(
            (preset) => preset.libraryKind === "settings_library",
          )}
          onApplyPreset={applyPreset}
        />
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <TextInput
          label="Entry Type name"
          name="name"
          required
          maxLength={ENTRY_TYPE_NAME_MAX_LENGTH}
          placeholder="NPC"
          value={values.name}
          onChange={(event) => updateValue("name", event.target.value)}
          error={state.fieldErrors?.name}
        />
        <Select
          label="Library kind"
          name="libraryKind"
          value={values.libraryKind}
          onChange={(event) => updateValue("libraryKind", event.target.value)}
          error={state.fieldErrors?.libraryKind}
          options={ENTRY_TYPE_LIBRARY_KINDS.map((libraryKind) => ({
            value: libraryKind,
            label: libraryKindLabels[libraryKind],
          }))}
        />
      </section>

      <Textarea
        label="Description"
        name="description"
        rows={5}
        maxLength={ENTRY_TYPE_DESCRIPTION_MAX_LENGTH}
        placeholder="A short note about what future entries of this type will represent."
        value={values.description}
        onChange={(event) => updateValue("description", event.target.value)}
        error={state.fieldErrors?.description}
      />

      <section className="grid gap-5 lg:grid-cols-2">
        <Select
          label="Visibility"
          name="visibility"
          value={values.visibility}
          onChange={(event) => updateValue("visibility", event.target.value)}
          error={state.fieldErrors?.visibility}
          options={ENTRY_TYPE_VISIBILITIES.map((visibility) => ({
            value: visibility,
            label: visibilityLabels[visibility],
          }))}
        />
        <TextInput
          label="Sort order"
          name="sortOrder"
          type="number"
          min={ENTRY_TYPE_SORT_ORDER_MIN}
          max={ENTRY_TYPE_SORT_ORDER_MAX}
          step={1}
          value={values.sortOrder}
          onChange={(event) => updateValue("sortOrder", event.target.value)}
          error={state.fieldErrors?.sortOrder}
        />
      </section>

      {state.message ? <p className="text-sm text-[#FCA311]">{state.message}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#FCA311] px-4 text-sm font-semibold text-black transition hover:bg-[#ffb33c] disabled:cursor-not-allowed disabled:opacity-65 sm:w-auto"
      >
        <Tags aria-hidden="true" className="h-4 w-4" />
        {isPending ? "Creating..." : "Create Entry Type"}
      </button>
    </form>
  );
}

function PresetGroup({
  title,
  presets,
  onApplyPreset,
}: {
  title: string;
  presets: Array<EntryTypeInput & { label: string }>;
  onApplyPreset: (preset: EntryTypeInput) => void;
}) {
  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#FCA311]/85">
        {title}
      </h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={`${preset.libraryKind}-${preset.name}`}
            type="button"
            onClick={() => onApplyPreset(preset)}
            className="rounded-lg border border-[#FCA311]/35 px-3 py-2 text-sm font-semibold text-[#FCA311] transition hover:bg-[#FCA311] hover:text-black"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
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
