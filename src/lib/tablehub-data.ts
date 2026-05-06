import {
  BookOpen,
  Boxes,
  Castle,
  CircleUserRound,
  Compass,
  Dice5,
  FileText,
  FolderKanban,
  Library,
  ScrollText,
  ShieldCheck,
  Sparkles,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  description: string;
  icon: LucideIcon;
};

export type DashboardCard = {
  title: string;
  eyebrow: string;
  description: string;
  meta: string;
  icon: LucideIcon;
};

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    description: "Recent prep, active tables, and next steps.",
    icon: FolderKanban,
  },
  {
    title: "Compendium",
    href: "/compendium",
    description: "Rules, spells, monsters, items, and reference entries.",
    icon: BookOpen,
  },
  {
    title: "Systems",
    href: "/systems",
    description: "Rulesets beginning with D&D 5e 2014.",
    icon: Boxes,
  },
  {
    title: "Settings Library",
    href: "/settings-library",
    description: "Reusable lore, factions, places, and histories.",
    icon: Library,
  },
  {
    title: "Projects",
    href: "/projects",
    description: "GM workspaces built from linked sources and overrides.",
    icon: Castle,
  },
  {
    title: "Campaigns",
    href: "/campaigns",
    description: "Invite-only active play spaces for tables.",
    icon: UsersRound,
  },
  {
    title: "Characters",
    href: "/characters",
    description: "Player and GM character binders.",
    icon: ScrollText,
  },
  {
    title: "Files",
    href: "/files",
    description: "Maps, handouts, portraits, PDFs, and table assets.",
    icon: FileText,
  },
  {
    title: "Account",
    href: "/account",
    description: "Profile, app preferences, and future privacy controls.",
    icon: CircleUserRound,
  },
];

export const dashboardCards: DashboardCard[] = [
  {
    title: "Continue Campaign",
    eyebrow: "Next table",
    description: "Open The Ember Vault and review the GM dashboard before play.",
    meta: "Session prep placeholder",
    icon: Compass,
  },
  {
    title: "Master Compendiums",
    eyebrow: "Containers first",
    description: "Create reusable compendium records before entries and imports arrive.",
    meta: "No entries yet",
    icon: BookOpen,
  },
  {
    title: "Active Characters",
    eyebrow: "Player binder",
    description: "Track character profiles, campaign membership, and sheet plans.",
    meta: "Sheets not built yet",
    icon: ScrollText,
  },
  {
    title: "Settings Library",
    eyebrow: "Lore workspace",
    description: "Keep reusable setting lore, factions, places, and secrets organized.",
    meta: "Linked overrides later",
    icon: Library,
  },
  {
    title: "Dice Roller",
    eyebrow: "Coming later",
    description: "A quick roll surface will live here once dice notation is added.",
    meta: "No dice parser yet",
    icon: Dice5,
  },
  {
    title: "Upcoming Sessions",
    eyebrow: "Calendar placeholder",
    description: "Future sessions, recap prompts, and prep status will appear here.",
    meta: "Static mock data",
    icon: Sparkles,
  },
  {
    title: "GM Tools",
    eyebrow: "Private prep",
    description: "Reveal controls, GM-only notes, and project tools are planned.",
    meta: "Frontend placeholder",
    icon: ShieldCheck,
  },
  {
    title: "Player Binder",
    eyebrow: "Player view",
    description: "Characters, journals, party notes, and visible lore will gather here.",
    meta: "Privacy-first direction",
    icon: UsersRound,
  },
];

export const systemStatusCards = [
  {
    label: "First system",
    value: "D&D 5e 2014",
  },
  {
    label: "Core pattern",
    value: "Linked copies with overrides",
  },
  {
    label: "Security direction",
    value: "Supabase RLS later",
  },
  {
    label: "Global search",
    value: "Ctrl+K planned",
  },
];
