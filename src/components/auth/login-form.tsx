"use client";

import { useActionState } from "react";
import { LogIn } from "lucide-react";

import { loginAction } from "@/lib/auth-actions";
import { initialAuthFormState } from "@/lib/auth-form-state";
import { FormField } from "@/components/auth/form-field";

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialAuthFormState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="next" value={next} />
      <FormField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        error={state.fieldErrors?.email}
      />
      <FormField
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        minLength={6}
        error={state.fieldErrors?.password}
      />

      {state.message ? (
        <p
          className={
            state.status === "error"
              ? "text-sm text-[#FCA311]"
              : "text-sm text-[var(--text-muted)]"
          }
        >
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#FCA311] px-4 text-sm font-semibold text-black transition hover:bg-[#ffb33c] disabled:cursor-not-allowed disabled:opacity-65"
      >
        <LogIn aria-hidden="true" className="h-4 w-4" />
        {isPending ? "Logging in..." : "Log in"}
      </button>
    </form>
  );
}
