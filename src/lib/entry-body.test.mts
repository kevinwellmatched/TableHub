import assert from "node:assert/strict";
import test from "node:test";

import {
  getProjectEntryBodyRenderFormat,
  looksLikeHtml,
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
    "<h2>Heading</h2><p><strong>Bold</strong> and <em>italic</em></p><ul><li>One</li></ul><blockquote>Quote</blockquote><pre><code>code</code></pre>",
  );

  assert.equal(sanitized.includes("<h2>Heading</h2>"), true);
  assert.equal(sanitized.includes("<strong>Bold</strong>"), true);
  assert.equal(sanitized.includes("<em>italic</em>"), true);
  assert.equal(sanitized.includes("<ul><li>One</li></ul>"), true);
  assert.equal(sanitized.includes("<blockquote>Quote</blockquote>"), true);
  assert.equal(sanitized.includes("<pre><code>code</code></pre>"), true);
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
