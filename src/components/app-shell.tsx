"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { logoutAction } from "@/lib/auth-actions";
import { navItems } from "@/lib/tablehub-data";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: React.ReactNode;
  profile: {
    username: string;
    displayName: string;
  };
};

export function AppShell({ children, profile }: AppShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentSection =
    navItems.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)) ??
    navItems[0];

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--text-main)]">
      <div className="flex min-h-screen">
        <Sidebar pathname={pathname} />

        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar
            currentSection={currentSection.title}
            profile={profile}
            mobileOpen={mobileOpen}
            onToggleMobile={() => setMobileOpen((open) => !open)}
          />

          {mobileOpen ? (
            <MobileNav pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          ) : null}

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ pathname }: { pathname: string }) {
  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-[var(--line)] bg-[var(--sidebar-bg)] px-4 py-5 lg:block">
      <Brand />
      <nav aria-label="Primary navigation" className="mt-8 space-y-1">
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} />
        ))}
      </nav>
      <div className="absolute bottom-5 left-4 right-4 rounded-lg border border-[#FCA311]/25 bg-[#FCA311]/10 p-4">
        <p className="text-sm font-semibold text-[#FCA311]">Projects slice</p>
        <p className="mt-2 text-xs leading-5 text-[#E5E5E5]/70">
          Supabase login, profiles, and project membership are connected. Dice,
          files, and sheets come in later slices.
        </p>
      </div>
    </aside>
  );
}

function TopBar({
  currentSection,
  profile,
  mobileOpen,
  onToggleMobile,
}: {
  currentSection: string;
  profile: {
    username: string;
    displayName: string;
  };
  mobileOpen: boolean;
  onToggleMobile: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[var(--topbar-bg)] px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center gap-4">
        <button
          type="button"
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          onClick={onToggleMobile}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--line)] text-[var(--text-muted)] transition hover:border-[#FCA311] hover:text-[#FCA311] lg:hidden"
        >
          {mobileOpen ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
        </button>

        <div className="hidden min-w-0 lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FCA311]">
            Current section
          </p>
          <p className="truncate text-lg font-semibold text-[var(--text-main)]">
            {currentSection}
          </p>
        </div>

        <div className="relative min-w-0 flex-1">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#FCA311]"
          />
          <div className="flex h-11 items-center justify-between rounded-lg border border-[var(--line)] bg-[var(--panel-bg)] pl-12 pr-3 text-sm text-[var(--text-muted)] shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
            <span className="truncate">Search TableHub...</span>
            <kbd className="ml-3 hidden rounded-md border border-[var(--line)] bg-black/35 px-2 py-1 text-xs font-medium text-[var(--text-muted)] sm:inline">
              Ctrl+K
            </kbd>
          </div>
        </div>

        <Link
          href="/account"
          className="hidden min-w-0 rounded-lg border border-[var(--line)] bg-[var(--panel-bg)] px-3 py-2 text-right transition hover:border-[#FCA311]/60 sm:block"
        >
          <span className="block truncate text-sm font-semibold text-[var(--text-main)]">
            {profile.displayName}
          </span>
          <span className="block truncate text-xs text-[var(--text-muted)]">
            @{profile.username}
          </span>
        </Link>

        <form action={logoutAction} className="hidden sm:block">
          <button
            type="submit"
            aria-label="Log out"
            title="Log out"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--line)] text-[var(--text-muted)] transition hover:border-[#FCA311] hover:text-[#FCA311]"
          >
            <LogOut aria-hidden="true" className="h-4 w-4" />
          </button>
        </form>
      </div>
    </header>
  );
}

function MobileNav({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <div className="border-b border-[var(--line)] bg-[var(--sidebar-bg)] px-4 py-4 lg:hidden">
      <Brand compact />
      <nav aria-label="Mobile navigation" className="mt-4 grid gap-2 sm:grid-cols-2">
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} onNavigate={onNavigate} />
        ))}
      </nav>
    </div>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/dashboard" className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#FCA311] text-lg font-black text-black">
        TH
      </div>
      <div>
        <p className="text-lg font-semibold tracking-normal text-[var(--text-main)]">TableHub</p>
        {!compact ? (
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
            D&D 5e 2014 first
          </p>
        ) : null}
      </div>
    </Link>
  );
}

function NavLink({
  item,
  pathname,
  onNavigate,
}: {
  item: (typeof navItems)[number];
  pathname: string;
  onNavigate?: () => void;
}) {
  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "group flex items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-sm font-medium text-[var(--text-muted)] transition",
        "hover:border-[#FCA311]/40 hover:bg-[#FCA311]/10 hover:text-[var(--text-main)]",
        isActive && "border-[#FCA311]/60 bg-[#FCA311]/15 text-[var(--text-main)] shadow-[0_12px_35px_rgba(252,163,17,0.12)]",
      )}
    >
      <Icon
        aria-hidden="true"
        className={cn(
          "h-5 w-5 text-[#E5E5E5]/45 transition group-hover:text-[#FCA311]",
          isActive && "text-[#FCA311]",
        )}
      />
      <span>{item.title}</span>
    </Link>
  );
}
