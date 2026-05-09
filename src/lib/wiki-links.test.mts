import assert from "node:assert/strict";
import test from "node:test";

import {
  parseWikiLinkToken,
  renderWikiLinksInSafeHtml,
  splitTextWithWikiLinks,
} from "./wiki-links.ts";

test("parses simple wiki link tokens", () => {
  assert.deepEqual(parseWikiLinkToken("[[Waterdeep]]"), {
    raw: "[[Waterdeep]]",
    target: "Waterdeep",
    label: "Waterdeep",
  });

  assert.deepEqual(parseWikiLinkToken("[[ Lord Neverember ]]"), {
    raw: "[[ Lord Neverember ]]",
    target: "Lord Neverember",
    label: "Lord Neverember",
  });
});

test("parses alias wiki link tokens", () => {
  assert.deepEqual(parseWikiLinkToken("[[Lord Neverember|the Open Lord]]"), {
    raw: "[[Lord Neverember|the Open Lord]]",
    target: "Lord Neverember",
    label: "the Open Lord",
  });
});

test("rejects empty and malformed wiki link tokens", () => {
  assert.equal(parseWikiLinkToken("[[]]"), null);
  assert.equal(parseWikiLinkToken("[[ ]]"), null);
  assert.equal(parseWikiLinkToken("[[Target|]]"), null);
  assert.equal(parseWikiLinkToken("[[Missing close"), null);
  assert.equal(parseWikiLinkToken("Missing open]]"), null);
  assert.equal(parseWikiLinkToken("[[Nested [[Thing]]]]"), null);
});

test("splits text around one or more wiki links", () => {
  assert.deepEqual(splitTextWithWikiLinks("Visit [[Waterdeep]] soon."), [
    { type: "text", text: "Visit " },
    {
      type: "wikiLink",
      raw: "[[Waterdeep]]",
      target: "Waterdeep",
      label: "Waterdeep",
    },
    { type: "text", text: " soon." },
  ]);

  assert.deepEqual(
    splitTextWithWikiLinks("[[One]] and [[Two|second]] plus [ordinary]."),
    [
      { type: "wikiLink", raw: "[[One]]", target: "One", label: "One" },
      { type: "text", text: " and " },
      {
        type: "wikiLink",
        raw: "[[Two|second]]",
        target: "Two",
        label: "second",
      },
      { type: "text", text: " plus [ordinary]." },
    ],
  );
});

test("leaves malformed wiki-looking text alone when splitting", () => {
  assert.deepEqual(splitTextWithWikiLinks("Try [[Missing close here."), [
    { type: "text", text: "Try [[Missing close here." },
  ]);

  assert.deepEqual(splitTextWithWikiLinks("Try [[Nested [[Thing]]]] here."), [
    { type: "text", text: "Try [[Nested [[Thing]]]] here." },
  ]);
});

test("renders wiki links in sanitized HTML text nodes", () => {
  const html = renderWikiLinksInSafeHtml(
    "<p>Visit [[Waterdeep]] and [[Lord Neverember|the Open Lord]].</p>",
  );

  assert.equal(html.includes('<span class="wiki-link"'), true);
  assert.equal(html.includes("Wiki link target: Waterdeep"), true);
  assert.equal(html.includes(">Waterdeep</span>"), true);
  assert.equal(html.includes("Wiki link target: Lord Neverember"), true);
  assert.equal(html.includes(">the Open Lord</span>"), true);
  assert.equal(html.includes("[["), false);
});

test("does not render wiki links inside code, pre, or existing anchors", () => {
  const html = renderWikiLinksInSafeHtml(
    '<p>Text [[Shown]]</p><code>[[Code]]</code><pre>[[Block]]</pre><a href="https://example.com">[[Link]]</a>',
  );

  assert.equal(html.includes("Wiki link target: Shown"), true);
  assert.equal(html.includes("Wiki link target: Code"), false);
  assert.equal(html.includes("Wiki link target: Block"), false);
  assert.equal(html.includes("Wiki link target: Link"), false);
  assert.equal(html.includes("<code>[[Code]]</code>"), true);
  assert.equal(html.includes("<pre>[[Block]]</pre>"), true);
  assert.equal(html.includes('>[[Link]]</a>'), true);
});

test("escapes dangerous wiki target and label text", () => {
  const html = renderWikiLinksInSafeHtml(
    "<p>[[<script>alert(1)</script>]] [[Target|<img src=x onerror=alert(1)>]] [[javascript:alert(1)|click me]]</p>",
  );

  assert.equal(html.includes("<script"), false);
  assert.equal(html.includes("<img"), false);
  assert.equal(html.includes("onerror"), false);
  assert.equal(html.includes('href="javascript:'), false);
  assert.equal(html.includes("[[]]"), true);
  assert.equal(html.includes("[[Target|]]"), true);
  assert.equal(html.includes(">click me</span>"), true);
});

test("preserves allowed rich text tags while rendering wiki links", () => {
  const html = renderWikiLinksInSafeHtml(
    "<h2>Scene</h2><p><strong>Meet [[Mirt]]</strong></p><ul><li>Ask [[Durnan]]</li></ul>",
  );

  assert.equal(html.includes("<h2>Scene</h2>"), true);
  assert.equal(html.includes("<strong>Meet "), true);
  assert.equal(html.includes("<ul><li>Ask "), true);
  assert.equal(html.includes("Wiki link target: Mirt"), true);
  assert.equal(html.includes("Wiki link target: Durnan"), true);
});
