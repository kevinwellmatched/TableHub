import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function MasterLibraryBreadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Master Library breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-2 text-[var(--text-muted)]">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            {index > 0 ? <span className="text-[#FCA311]/60">/</span> : null}
            {item.href ? (
              <Link
                href={item.href}
                className="font-semibold text-[#FCA311] transition hover:text-[#ffb33c]"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-[var(--text-main)]">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
