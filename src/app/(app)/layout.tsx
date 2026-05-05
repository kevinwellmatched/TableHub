import { AppShell } from "@/components/app-shell";
import { getCurrentUserProfile } from "@/lib/profiles";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function TableHubAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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

  if (!profile) {
    redirect("/onboarding");
  }

  return (
    <AppShell
      profile={{
        username: profile.username,
        displayName: profile.display_name,
      }}
    >
      {children}
    </AppShell>
  );
}
