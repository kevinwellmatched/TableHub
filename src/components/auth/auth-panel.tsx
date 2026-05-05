import Link from "next/link";

type AuthPanelProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  footerText?: string;
  footerHref?: string;
  footerLink?: string;
};

export function AuthPanel({
  eyebrow,
  title,
  description,
  children,
  footerText,
  footerHref,
  footerLink,
}: AuthPanelProps) {
  return (
    <main className="min-h-screen bg-[var(--app-bg)] px-4 py-10 text-[var(--text-main)] sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center">
        <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(380px,480px)] lg:items-center">
          <section className="max-w-2xl">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#FCA311] text-lg font-black text-black">
                TH
              </span>
              <span>
                <span className="block text-lg font-semibold">TableHub</span>
                <span className="block text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  Private-first table tools
                </span>
              </span>
            </Link>

            <p className="mt-12 text-sm font-semibold uppercase tracking-[0.18em] text-[#FCA311]">
              {eyebrow}
            </p>
            <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-normal sm:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[var(--text-muted)]">
              {description}
            </p>
          </section>

          <section className="rounded-lg border border-[var(--line)] bg-[var(--panel-bg)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-8">
            {children}
            {footerText && footerHref && footerLink ? (
              <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
                {footerText}{" "}
                <Link
                  href={footerHref}
                  className="font-semibold text-[#FCA311] hover:text-white"
                >
                  {footerLink}
                </Link>
              </p>
            ) : null}
          </section>
        </div>
      </div>
    </main>
  );
}
