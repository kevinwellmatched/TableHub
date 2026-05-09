import assert from "node:assert/strict";
import test from "node:test";

import {
  normalizeWikiLinkTarget,
  resolveWikiLinkTarget,
  type WikiLinkResolutionCandidate,
} from "./wiki-link-resolution.ts";

const candidates: WikiLinkResolutionCandidate[] = [
  {
    id: "entry-1",
    title: "Waterdeep",
    aliases: ["City of Splendors"],
    href: "/master-entries/entry-1",
  },
  {
    id: "entry-2",
    title: "Lord Neverember",
    aliases: ["Dagult"],
    href: "/master-entries/entry-2",
  },
];

test("normalizes wiki link targets conservatively", () => {
  assert.equal(normalizeWikiLinkTarget("  LORD   Neverember  "), "lord neverember");
  assert.equal(normalizeWikiLinkTarget("\nWaterdeep\tHarbor "), "waterdeep harbor");
});

test("resolves an exact normalized title match", () => {
  assert.deepEqual(resolveWikiLinkTarget(" waterdeep ", candidates), {
    target: "waterdeep",
    label: "waterdeep",
    status: "resolved",
    href: "/master-entries/entry-1",
  });
});

test("resolves an exact normalized alias match", () => {
  assert.deepEqual(resolveWikiLinkTarget("city   of splendors", candidates), {
    target: "city   of splendors",
    label: "city   of splendors",
    status: "resolved",
    href: "/master-entries/entry-1",
  });
});

test("preserves an alias-syntax label while resolving by target", () => {
  assert.deepEqual(
    resolveWikiLinkTarget("Lord Neverember", candidates, "the Open Lord"),
    {
      target: "Lord Neverember",
      label: "the Open Lord",
      status: "resolved",
      href: "/master-entries/entry-2",
    },
  );
});

test("treats no match as unresolved", () => {
  assert.deepEqual(resolveWikiLinkTarget("Neverwinter", candidates), {
    target: "Neverwinter",
    label: "Neverwinter",
    status: "unresolved",
  });
});

test("treats duplicate title matches as ambiguous", () => {
  const result = resolveWikiLinkTarget("Waterdeep", [
    ...candidates,
    {
      id: "entry-3",
      title: "Waterdeep",
      href: "/master-entries/entry-3",
    },
  ]);

  assert.deepEqual(result, {
    target: "Waterdeep",
    label: "Waterdeep",
    status: "ambiguous",
  });
});

test("treats duplicate alias matches as ambiguous", () => {
  const result = resolveWikiLinkTarget("City of Splendors", [
    ...candidates,
    {
      id: "entry-3",
      title: "Deepwater",
      aliases: ["City of Splendors"],
      href: "/master-entries/entry-3",
    },
  ]);

  assert.deepEqual(result, {
    target: "City of Splendors",
    label: "City of Splendors",
    status: "ambiguous",
  });
});

test("does not treat a title and alias on the same entry as ambiguous", () => {
  const result = resolveWikiLinkTarget("Waterdeep", [
    {
      id: "entry-1",
      title: "Waterdeep",
      aliases: ["Waterdeep"],
      href: "/master-entries/entry-1",
    },
  ]);

  assert.equal(result.status, "resolved");
  assert.equal(result.href, "/master-entries/entry-1");
});

test("does not fuzzy match partial targets", () => {
  assert.equal(resolveWikiLinkTarget("Water", candidates).status, "unresolved");
  assert.equal(resolveWikiLinkTarget("Never", candidates).status, "unresolved");
});
