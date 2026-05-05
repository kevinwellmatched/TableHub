import { AuthPanel } from "@/components/auth/auth-panel";
import { SignupForm } from "@/components/auth/signup-form";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function SignupPage() {
  if (!hasSupabaseEnv()) {
    return (
      <AuthPanel
        eyebrow="Setup needed"
        title="Connect Supabase before signing up."
        description="The auth screens are ready, but this local workspace needs the public Supabase URL and anon key in .env.local."
        footerText="Already configured?"
        footerHref="/login"
        footerLink="Go to login"
      >
        <div className="rounded-lg border border-[#FCA311]/30 bg-[#FCA311]/10 p-4 text-sm leading-6 text-[var(--text-main)]">
          Restart the dev server after adding <code>.env.local</code> so
          Next.js can load the values.
        </div>
      </AuthPanel>
    );
  }

  return (
    <AuthPanel
      eyebrow="Start clean"
      title="Create your TableHub account."
      description="Sign up with email and password, then choose the username and display name other table members can see later."
      footerText="Already have an account?"
      footerHref="/login"
      footerLink="Log in"
    >
      <SignupForm />
    </AuthPanel>
  );
}
