"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";

import { saveProfileAction } from "@/lib/auth-actions";
import { initialAuthFormState } from "@/lib/auth-form-state";
import { FormField } from "@/components/auth/form-field";

type ProfileFormProps = {
  username?: string;
  displayName?: string;
  returnTo: string;
  submitLabel: string;
};

export function ProfileForm({
  username,
  displayName,
  returnTo,
  submitLabel,
}: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(
    saveProfileAction,
    initialAuthFormState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="returnTo" value={returnTo} />
      <FormField
        label="Username"
        name="username"
        autoComplete="username"
        defaultValue={username}
        placeholder="table_keeper"
        minLength={3}
        maxLength={32}
        pattern="[A-Za-z0-9_]+"
        error={state.fieldErrors?.username}
      />
      <FormField
        label="Display name"
        name="displayName"
        autoComplete="name"
        defaultValue={displayName}
        placeholder="Kev the Keeper"
        maxLength={80}
        error={state.fieldErrors?.displayName}
      />

      {state.message ? <p className="text-sm text-[#FCA311]">{state.message}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#FCA311] px-4 text-sm font-semibold text-black transition hover:bg-[#ffb33c] disabled:cursor-not-allowed disabled:opacity-65 sm:w-auto"
      >
        <Save aria-hidden="true" className="h-4 w-4" />
        {isPending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
