import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { CreateProjectForm } from "@/components/projects/create-project-form";
import { PageHeader } from "@/components/page-header";
import { getGameSystemsForProjectForm } from "@/lib/projects";

export default async function NewProjectPage() {
  const gameSystems = await getGameSystemsForProjectForm();

  return (
    <div className="space-y-8">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#FCA311] transition hover:text-[#ffb33c]"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back to Projects
      </Link>

      <PageHeader
        title="Create Project"
        description="Start the workspace that will gather this table's systems, compendiums, Settings Library sources, campaigns, files, permissions, and project-level overrides."
      />

      <section className="rounded-lg border border-[var(--line)] bg-[var(--panel-bg)] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.2)]">
        <div className="max-w-2xl">
          <h2 className="text-xl font-semibold text-[var(--text-main)]">
            Project details
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
            Keep this focused. You can add campaigns and linked source libraries in
            future slices.
          </p>
          <div className="mt-6">
            <CreateProjectForm gameSystems={gameSystems} />
          </div>
        </div>
      </section>
    </div>
  );
}
