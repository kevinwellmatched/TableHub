type PageHeaderProps = {
  title: string;
  description: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#FCA311]">
        TableHub
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-normal text-[var(--text-main)] sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 text-base leading-7 text-[var(--text-muted)]">
        {description}
      </p>
    </header>
  );
}
