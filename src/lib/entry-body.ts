import DOMPurify from "isomorphic-dompurify";

import type { MasterEntryBodyFormat } from "@/lib/master-entry-validation";

export type EntryBodyRenderFormat = MasterEntryBodyFormat;

const allowedRichTextTags = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "s",
  "strike",
  "h1",
  "h2",
  "h3",
  "ul",
  "ol",
  "li",
  "blockquote",
  "code",
  "pre",
  "hr",
  "a",
];

const allowedRichTextAttributes = ["href", "title", "target", "rel"];

export function looksLikeHtml(value: string | null | undefined) {
  if (!value) {
    return false;
  }

  return /<\/?[a-z][\s\S]*>/i.test(value);
}

export function sanitizeEntryHtml(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  return DOMPurify.sanitize(value, {
    ALLOWED_TAGS: allowedRichTextTags,
    ALLOWED_ATTR: allowedRichTextAttributes,
    ALLOW_DATA_ATTR: false,
  });
}

export function isBlankRichTextHtml(value: string | null | undefined) {
  const sanitized = sanitizeEntryHtml(value)
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/(p|h1|h2|h3|li|blockquote|pre)>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .trim();

  return sanitized.length === 0;
}

export function normalizeStoredEntryBody(
  body: string,
  bodyFormat: EntryBodyRenderFormat,
) {
  if (bodyFormat !== "html") {
    return body.trim();
  }

  if (isBlankRichTextHtml(body)) {
    return "";
  }

  return sanitizeEntryHtml(body).trim();
}

export function getProjectEntryBodyRenderFormat({
  masterBodyFormat,
  overrideBody,
}: {
  masterBodyFormat: EntryBodyRenderFormat;
  overrideBody: string | null | undefined;
}): EntryBodyRenderFormat {
  if (typeof overrideBody === "string" && overrideBody.trim().length > 0) {
    return looksLikeHtml(overrideBody) ? "html" : "plain_text";
  }

  return masterBodyFormat;
}

export function getReadModeEntryBodyRenderFormat(
  body: string | null | undefined,
): EntryBodyRenderFormat {
  return looksLikeHtml(body) ? "html" : "plain_text";
}
