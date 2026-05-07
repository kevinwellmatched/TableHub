const workflowSteps = [
  "Create or choose a Game System.",
  "Create a Library Source, currently a Compendium or Settings Library.",
  "Define Entry Types.",
  "Create Master Entries.",
  "Attach compatible sources into a Project Library.",
];

export function MasterLibraryWorkflow() {
  return (
    <section className="rounded-lg border border-[var(--line)] bg-[var(--panel-bg)] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.2)]">
      <h2 className="text-lg font-semibold text-[var(--text-main)]">
        Recommended workflow
      </h2>
      <ol className="mt-4 grid gap-3 md:grid-cols-5">
        {workflowSteps.map((step, index) => (
          <li
            key={step}
            className="rounded-lg border border-[var(--line)] bg-black/20 p-4"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#FCA311] text-sm font-bold text-black">
              {index + 1}
            </span>
            <p className="mt-3 text-sm leading-6 text-[var(--text-main)]">
              {step}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
