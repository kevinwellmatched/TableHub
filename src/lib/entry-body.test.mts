import assert from "node:assert/strict";
import test from "node:test";

import {
  getProjectEntryBodyRenderFormat,
  looksLikeHtml,
  renderEntryBodyHtml,
  sanitizeEntryHtml,
} from "./entry-body.ts";

test("detects basic HTML body content", () => {
  assert.equal(looksLikeHtml("<p>Hello</p>"), true);
  assert.equal(looksLikeHtml("Before <strong>bold</strong> after"), true);
  assert.equal(looksLikeHtml("**Markdown-looking text**"), false);
  assert.equal(looksLikeHtml("Plain text with < angle bracket"), false);
});

test("sanitizes dangerous HTML before rendering", () => {
  const sanitized = sanitizeEntryHtml(
    '<h2 onclick="alert(1)">Title</h2><script>alert(1)</script><p><a href="javascript:alert(1)">Bad link</a><img src=x onerror="alert(1)"></p>',
  );

  assert.equal(sanitized.includes("<script"), false);
  assert.equal(sanitized.includes("onclick"), false);
  assert.equal(sanitized.includes("onerror"), false);
  assert.equal(sanitized.includes("javascript:"), false);
  assert.equal(sanitized.includes("<img"), false);
  assert.equal(sanitized.includes("<h2>Title</h2>"), true);
});

test("keeps expected rich text tags when sanitizing HTML", () => {
  const sanitized = sanitizeEntryHtml(
    "<h1>Heading 1</h1><h2>Heading</h2><p><strong>Bold</strong> and <em>italic</em></p><ul><li>One</li></ul><blockquote>Quote</blockquote><pre><code>code</code></pre>",
  );

  assert.equal(sanitized.includes("<h1>Heading 1</h1>"), true);
  assert.equal(sanitized.includes("<h2>Heading</h2>"), true);
  assert.equal(sanitized.includes("<strong>Bold</strong>"), true);
  assert.equal(sanitized.includes("<em>italic</em>"), true);
  assert.equal(sanitized.includes("<ul><li>One</li></ul>"), true);
  assert.equal(sanitized.includes("<blockquote>Quote</blockquote>"), true);
  assert.equal(sanitized.includes("<pre><code>code</code></pre>"), true);
});

test("renders wiki links through the shared HTML body display path", () => {
  const html = renderEntryBodyHtml(
    "<p>Visit [[Waterdeep]] and <strong>stay alert</strong>.</p>",
    "html",
  );

  assert.equal(html.includes('<span class="wiki-link"'), true);
  assert.equal(html.includes("Wiki link target: Waterdeep"), true);
  assert.equal(html.includes("<strong>stay alert</strong>"), true);
});

test("renders wiki links in legacy plain text without changing stored text", () => {
  const html = renderEntryBodyHtml(
    "Visit [[Waterdeep]].\nBring notes.",
    "plain_text",
  );

  assert.equal(html.includes("Visit "), true);
  assert.equal(html.includes("Wiki link target: Waterdeep"), true);
  assert.equal(html.includes("<br>Bring notes."), true);
});

test("chooses project override body HTML only when the override looks like HTML", () => {
  assert.equal(
    getProjectEntryBodyRenderFormat({
      masterBodyFormat: "markdown",
      overrideBody: "<p>Project version</p>",
    }),
    "html",
  );
  assert.equal(
    getProjectEntryBodyRenderFormat({
      masterBodyFormat: "html",
      overrideBody: "Project plain text",
    }),
    "plain_text",
  );
  assert.equal(
    getProjectEntryBodyRenderFormat({
      masterBodyFormat: "markdown",
      overrideBody: null,
    }),
    "markdown",
  );
});
