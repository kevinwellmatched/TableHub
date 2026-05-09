import assert from "node:assert/strict";
import test from "node:test";

import {
  convertMarkdownToSafeHtml,
  looksLikeMarkdown,
  normalizePastedTextForEditor,
} from "./markdown-paste.ts";

test("detects common Markdown block patterns", () => {
  assert.equal(looksLikeMarkdown("# Heading 1"), true);
  assert.equal(looksLikeMarkdown("## Heading 2"), true);
  assert.equal(looksLikeMarkdown("### Heading 3"), true);
  assert.equal(looksLikeMarkdown("- bullet item"), true);
  assert.equal(looksLikeMarkdown("* bullet item"), true);
  assert.equal(looksLikeMarkdown("1. ordered item"), true);
  assert.equal(looksLikeMarkdown("> quoted text"), true);
  assert.equal(looksLikeMarkdown("```\ncode block\n```"), true);
  assert.equal(looksLikeMarkdown("---"), true);
});

test("detects common Markdown inline patterns", () => {
  assert.equal(looksLikeMarkdown("This has **bold** text."), true);
  assert.equal(looksLikeMarkdown("This has *italic* text."), true);
  assert.equal(looksLikeMarkdown("This has _italic_ text."), true);
  assert.equal(looksLikeMarkdown("Use `code` here."), true);
  assert.equal(looksLikeMarkdown("[TableHub](https://example.com)"), true);
});

test("does not over-detect ordinary prose as Markdown", () => {
  assert.equal(looksLikeMarkdown("This is a normal sentence."), false);
  assert.equal(looksLikeMarkdown("A short note with two lines\nand no markup."), false);
  assert.equal(looksLikeMarkdown("Use 1.5 cups of water."), false);
  assert.equal(looksLikeMarkdown("An asterisk * by itself is just text."), false);
});

test("converts Markdown headings and emphasis to safe HTML", () => {
  const html = convertMarkdownToSafeHtml(
    "# Heading 1\n\n## Heading 2\n\n### Heading 3\n\nThis is **bold** and *italic*.",
  );

  assert.equal(html.includes("<h1>Heading 1</h1>"), true);
  assert.equal(html.includes("<h2>Heading 2</h2>"), true);
  assert.equal(html.includes("<h3>Heading 3</h3>"), true);
  assert.equal(html.includes("<strong>bold</strong>"), true);
  assert.equal(html.includes("<em>italic</em>"), true);
});

test("converts Markdown lists and blockquotes to safe HTML", () => {
  const html = convertMarkdownToSafeHtml(
    "- bullet one\n- bullet two\n\n1. ordered one\n2. ordered two\n\n> quoted text",
  );

  assert.equal(html.includes("<ul>"), true);
  assert.equal(html.includes("<li>bullet one</li>"), true);
  assert.equal(html.includes("<ol>"), true);
  assert.equal(html.includes("<li>ordered one</li>"), true);
  assert.equal(html.includes("<blockquote>"), true);
  assert.equal(html.includes("<p>quoted text</p>"), true);
});

test("converts Markdown code, rules, and safe links to safe HTML", () => {
  const html = convertMarkdownToSafeHtml(
    "Use `inline code`.\n\n```\nconst roll = 'd20';\n```\n\n---\n\n[Example](https://example.com)",
  );

  assert.equal(html.includes("<code>inline code</code>"), true);
  assert.equal(html.includes("<pre><code>const roll = 'd20';\n</code></pre>"), true);
  assert.equal(html.includes("<hr>"), true);
  assert.equal(html.includes('<a href="https://example.com">Example</a>'), true);
});

test("sanitizes dangerous HTML from Markdown conversion", () => {
  const html = convertMarkdownToSafeHtml(
    '# Safe\n\n<script>alert("no")</script>\n\n<p onclick="alert(1)">Bad event</p>\n\n[Bad](javascript:alert(1))',
  );

  assert.equal(html.includes("<script"), false);
  assert.equal(html.includes("onclick"), false);
  assert.equal(html.includes("javascript:"), false);
  assert.equal(html.includes("<h1>Safe</h1>"), true);
});

test("keeps ordinary pasted plain text as paragraphs", () => {
  const html = normalizePastedTextForEditor("First paragraph.\n\nSecond paragraph.");

  assert.equal(html, "<p>First paragraph.</p><p>Second paragraph.</p>");
});

test("normalizes Markdown-looking pasted text to sanitized rich text HTML", () => {
  const html = normalizePastedTextForEditor("## Scene\n\n[[Some Entry]] stays plain.");

  assert.equal(html.includes("<h2>Scene</h2>"), true);
  assert.equal(html.includes("[[Some Entry]] stays plain."), true);
  assert.equal(html.includes("<a"), false);
});
