import { redirect } from "next/navigation";

import { AuthPanel } from "@/components/auth/auth-panel";
import { ProfileForm } from "@/components/auth/profile-form";
import { getCurrentUserProfile } from "@/lib/profiles";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  if (!hasSupabaseEnv()) {
    redirect("/login");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await getCurrentUserProfile(supabase, user.id);

  if (profile) {
    redirect("/dashboard");
  }

  return (
    <AuthPanel
      eyebrow="Profile setup"
      title="Choose how TableHub should show you."
      description="Your email stays private. Your username and display name are the safe identity fields the app can show inside shared tabletop spaces."
      footerText="Need to switch accounts?"
      footerHref="/login"
      footerLink="Go to login"
    >
      <ProfileForm returnTo="/dashboard" submitLabel="Finish profile" />
    </AuthPanel>
  );
}
