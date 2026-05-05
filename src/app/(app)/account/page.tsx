import { LogOut } from "lucide-react";

import { ProfileForm } from "@/components/auth/profile-form";
import { PageHeader } from "@/components/page-header";
import { logoutAction } from "@/lib/auth-actions";
import { getCurrentUserProfile } from "@/lib/profiles";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const profile = await getCurrentUserProfile(supabase, user.id);

  if (!profile) {
    return null;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Account"
        description="Manage the safe profile fields TableHub can show inside the app. Your sign-in email stays private and is not shown as a profile field."
      />

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-lg border border-[var(--line)] bg-[var(--panel-bg)] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#FCA311]">
            Username
          </p>
          <p className="mt-2 text-lg font-semibold text-[var(--text-main)]">
            @{profile.username}
          </p>
        </article>

        <article className="rounded-lg border border-[var(--line)] bg-[var(--panel-bg)] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#FCA311]">
            Display name
          </p>
          <p className="mt-2 text-lg font-semibold text-[var(--text-main)]">
            {profile.display_name}
          </p>
        </article>
      </section>

      <section className="rounded-lg border border-[var(--line)] bg-[var(--panel-bg)] p-6">
        <div className="max-w-2xl">
          <h2 className="text-xl font-semibold text-[var(--text-main)]">
            Edit profile
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
            Usernames are unique and can use letters, numbers, and underscores.
            Display names are what other people will recognize at the table.
          </p>
          <div className="mt-6">
            <ProfileForm
              username={profile.username}
              displayName={profile.display_name}
              returnTo="/account"
              submitLabel="Save profile"
            />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-[#FCA311]/30 bg-[#FCA311]/10 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-main)]">
              Leave this session
            </h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Log out when you are done using this computer.
            </p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#FCA311]/50 px-4 text-sm font-semibold text-[#FCA311] transition hover:bg-[#FCA311] hover:text-black"
            >
              <LogOut aria-hidden="true" className="h-4 w-4" />
              Log out
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
