import {
  getReadModeEntryBodyRenderFormat,
  renderEntryBodyHtml,
  type EntryBodyRenderFormat,
} from "@/lib/entry-body";

type EntryBodyRendererProps = {
  body: string | null | undefined;
  format?: EntryBodyRenderFormat;
  emptyText?: string;
};

export function EntryBodyRenderer({
  body,
  format,
  emptyText = "No body content yet.",
}: EntryBodyRendererProps) {
  const content = body?.trim();

  if (!content) {
    return (
      <div className="rounded-lg border border-[var(--line)] bg-black/20 p-4 text-sm leading-6 text-[var(--text-muted)]">
        {emptyText}
      </div>
    );
  }

  const renderFormat = format ?? getReadModeEntryBodyRenderFormat(content);
  const renderedHtml = renderEntryBodyHtml(content, renderFormat);

  return (
    <div
      className="entry-body-renderer rounded-lg border border-[var(--line)] bg-black/20 p-4 text-sm leading-7 text-[var(--text-main)]"
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
}
