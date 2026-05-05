import { AuthPanel } from "@/components/auth/auth-panel";
import { LoginForm } from "@/components/auth/login-form";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next = "/dashboard" } = await searchParams;

  if (!hasSupabaseEnv()) {
    return (
      <AuthPanel
        eyebrow="Setup needed"
        title="Connect Supabase before logging in."
        description="Create .env.local with the public Supabase URL and anon key, then restart the local dev server. No service role key is needed."
      >
        <div className="rounded-lg border border-[#FCA311]/30 bg-[#FCA311]/10 p-4 text-sm leading-6 text-[var(--text-main)]">
          Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{" "}
          <code>.env.local</code>. The full SQL and setup notes are in{" "}
          <code>SUPABASE_SETUP.md</code>.
        </div>
      </AuthPanel>
    );
  }

  return (
    <AuthPanel
      eyebrow="Welcome back"
      title="Log in to your private table hub."
      description="Open your campaign prep, character binder, files, and future compendiums from one protected workspace."
      footerText="New to TableHub?"
      footerHref="/signup"
      footerLink="Create an account"
    >
      <LoginForm next={next} />
    </AuthPanel>
  );
}
