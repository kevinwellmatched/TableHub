import {
  BookOpen,
  Boxes,
  Castle,
  CircleUserRound,
  FileText,
  FolderKanban,
  Library,
  ScrollText,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";

const sections = [
  {
    name: "Dashboard",
    description: "A calm starting point for recent worlds, campaigns, and prep.",
    icon: FolderKanban,
  },
  {
    name: "Compendium",
    description: "Master D&D 5e 2014 rules content will live here safely.",
    icon: BookOpen,
  },
  {
    name: "Systems",
    description: "Game rulesets begin with D&D 5e 2014 and can expand later.",
    icon: Boxes,
  },
  {
    name: "Settings Library",
    description: "Reusable setting material that projects can link without mutating.",
    icon: Library,
  },
  {
    name: "Projects",
    description: "Private GM workspaces for campaign planning and source selection.",
    icon: Castle,
  },
  {
    name: "Campaigns",
    description: "Table-facing play spaces built from controlled project copies.",
    icon: UsersRound,
  },
  {
    name: "Characters",
    description: "Player and NPC records will connect to campaigns in a later slice.",
    icon: ScrollText,
  },
  {
    name: "Files",
    description: "A future home for maps, handouts, references, and session assets.",
    icon: FileText,
  },
  {
    name: "Account",
    description: "Private profile and access settings will appear after auth exists.",
    icon: CircleUserRound,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f2e8] text-[#111111] dark:bg-[#05070d] dark:text-[#f7f2e8]">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-6 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-4 border-b border-[#d8c78f]/70 pb-6 sm:flex-row sm:items-center sm:justify-between dark:border-[#d8c78f]/30">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9d7a25] dark:text-[#d8c78f]">
              Private-first tabletop hub
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal text-[#111111] sm:text-5xl dark:text-[#f7f2e8]">
              TableHub
            </h1>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-[#d8c78f]/70 bg-white/65 px-4 py-3 text-sm text-[#12203a] shadow-sm dark:border-[#d8c78f]/25 dark:bg-[#0c1426] dark:text-[#f7f2e8]">
            <ShieldCheck aria-hidden="true" className="h-5 w-5 text-[#9d7a25]" />
            <span>Supabase is planned, but not connected yet.</span>
          </div>
        </header>

        <section className="grid flex-1 gap-8 py-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-lg bg-[#111111] px-3 py-2 text-sm font-medium text-[#f7f2e8] dark:bg-[#d8c78f] dark:text-[#05070d]">
              <Sparkles aria-hidden="true" className="h-4 w-4" />
              Foundation slice
            </div>
            <h2 className="text-3xl font-semibold leading-tight tracking-normal text-[#111111] sm:text-5xl dark:text-[#f7f2e8]">
              A clean starting table for GMs, players, and future rules content.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-[#35405a] sm:text-lg dark:text-[#cfc7b8]">
              This first version is only the project foundation: Next.js, TypeScript,
              Tailwind, ESLint, planning docs, and a placeholder dashboard. Auth,
              database tables, editors, dice, sheets, files, and real Supabase
              integration are intentionally left for later slices.
            </p>
            <div className="mt-8 grid gap-3 text-sm text-[#12203a] sm:grid-cols-2 dark:text-[#e9dfcc]">
              <div className="rounded-lg border border-[#d8c78f]/70 bg-white/70 p-4 dark:border-[#d8c78f]/25 dark:bg-[#0c1426]">
                <p className="font-semibold text-[#111111] dark:text-[#f7f2e8]">
                  First system
                </p>
                <p className="mt-1">D&amp;D 5e 2014</p>
              </div>
              <div className="rounded-lg border border-[#d8c78f]/70 bg-white/70 p-4 dark:border-[#d8c78f]/25 dark:bg-[#0c1426]">
                <p className="font-semibold text-[#111111] dark:text-[#f7f2e8]">
                  Core pattern
                </p>
                <p className="mt-1">Linked copies with overrides</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {sections.map((section) => {
              const Icon = section.icon;

              return (
                <article
                  key={section.name}
                  className="rounded-lg border border-[#d8c78f]/70 bg-white/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#9d7a25] hover:shadow-md dark:border-[#d8c78f]/20 dark:bg-[#0c1426] dark:hover:border-[#d8c78f]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#12203a] text-[#d8c78f] dark:bg-[#d8c78f] dark:text-[#05070d]">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-[#111111] dark:text-[#f7f2e8]">
                    {section.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#4b5367] dark:text-[#cfc7b8]">
                    {section.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <footer className="border-t border-[#d8c78f]/70 py-5 text-sm text-[#35405a] dark:border-[#d8c78f]/30 dark:text-[#cfc7b8]">
          Master library content stays protected. Project and campaign edits will
          use controlled copies so originals remain safe.
        </footer>
      </div>
    </main>
  );
}
