import Link from "next/link";

type MasterLibraryLink = {
  label: string;
  href: string;
};

export function MasterLibraryLinkPanel({
  title,
  description,
  links,
}: {
  title: string;
  description: string;
  links: MasterLibraryLink[];
}) {
  return (
    <section className="rounded-lg border border-[var(--line)] bg-[var(--panel-bg)] p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <h2 className="text-lg font-semibold text-[var(--text-main)]">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
            {description}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-wrap lg:justify-end">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-[#FCA311]/50 px-4 text-sm font-semibold text-[#FCA311] transition hover:bg-[#FCA311] hover:text-black"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
