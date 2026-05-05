import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type SectionCardProps = {
  title: string;
  eyebrow?: string;
  description: string;
  meta?: string;
  icon: LucideIcon;
  className?: string;
};

export function SectionCard({
  title,
  eyebrow,
  description,
  meta,
  icon: Icon,
  className,
}: SectionCardProps) {
  return (
    <article
      className={cn(
        "group rounded-lg border border-[var(--line)] bg-[var(--panel-bg)] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.2)] transition duration-200 hover:-translate-y-1 hover:border-[#FCA311]/70 hover:bg-[var(--panel-bg-hover)]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#FCA311]/30 bg-[#14213D] text-[#FCA311] transition group-hover:border-[#FCA311] group-hover:bg-[#FCA311] group-hover:text-black">
          <Icon aria-hidden="true" className="h-5 w-5" />
        </div>
        {eyebrow ? (
          <span className="rounded-md border border-[var(--line)] bg-black/25 px-2 py-1 text-xs font-medium text-[#FCA311]">
            {eyebrow}
          </span>
        ) : null}
      </div>
      <h3 className="mt-5 text-lg font-semibold tracking-normal text-[var(--text-main)]">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
        {description}
      </p>
      {meta ? (
        <p className="mt-4 border-t border-[var(--line)] pt-3 text-xs font-medium uppercase tracking-[0.14em] text-[#FCA311]/85">
          {meta}
        </p>
      ) : null}
    </article>
  );
}
