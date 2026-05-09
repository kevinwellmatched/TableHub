import { marked } from "marked";

import { looksLikeHtml, sanitizeEntryHtml } from "./entry-body.ts";

const markdownBlockPatterns = [
  /^#{1,3}\s+\S/m,
  /^\s*[-*]\s+\S/m,
  /^\s*\d+\.\s+\S/m,
  /^>\s+\S/m,
  /^```[\s\S]*```/m,
  /^---\s*$/m,
];

const markdownInlinePatterns = [
  /(^|\s)(\*\*|__)\S[\s\S]*?\S\2(?=\s|[.,;:!?)]|$)/,
  /(^|\s)(\*|_)\S[^\n]*?\S\2(?=\s|[.,;:!?)]|$)/,
  /`[^`\n]+`/,
  /\[[^\]\n]+\]\((https?:\/\/|mailto:)[^)]+?\)/i,
];

export function looksLikeMarkdown(input: string | null | undefined) {
  const value = input?.trim();

  if (!value || looksLikeHtml(value)) {
    return false;
  }

  return [...markdownBlockPatterns, ...markdownInlinePatterns].some((pattern) =>
    pattern.test(value),
  );
}

export function convertMarkdownToSafeHtml(input: string) {
  const html = marked(input, {
    async: false,
    breaks: false,
    gfm: true,
  });

  return sanitizeEntryHtml(html).trim();
}

export function normalizePastedTextForEditor(input: string) {
  const value = input.trim();

  if (!value) {
    return "";
  }

  if (looksLikeMarkdown(value)) {
    return convertMarkdownToSafeHtml(value);
  }

  return textToParagraphHtml(value);
}

function textToParagraphHtml(value: string) {
  return sanitizeEntryHtml(
    value
      .split(/\n{2,}/)
      .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`)
      .join(""),
  );
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
