import assert from "node:assert/strict";
import test from "node:test";

import {
  buildImportSourceNote,
  buildMarkdownImportPlan,
  convertImportedMarkdownToEntryHtml,
  formatMarkdownImportPlan,
  parseMarkdownImportCliArgs,
  type MarkdownSourceFile,
} from "./import-markdown-package.ts";
import type { ImportSourcePackageManifest } from "./import-source-package.ts";

const demoManifest: ImportSourcePackageManifest = {
  manifestVersion: 1,
  packageId: "demo20.core-sample",
  packageName: "Demo20 Core Sample",
  distributionStatus: "tablehub_distributable",
  source: {
    name: "Demo20 Core Sample",
    creator: "TableHub Demo Team",
    licenseName: "Original demo content",
    sourceKind: "original_demo",
    mayTableHubRedistribute: true,
    privateToWorkspace: false,
  },
  system: {
    name: "Demo20",
    edition: "Sample Edition",
    publisher: "TableHub Demo Team",
    rulesetYear: 2026,
    version: "1.0.0",
  },
  sourceContainer: {
    name: "Demo20 Core Sample",
    sourceCategory: "core_rulebook",
    sourceSubtype: "core_rulebook",
    defaultPlayerVisibility: "visible",
    clonePolicy: "locked_to_system",
    version: "1.0.0",
  },
  entryTypes: [
    {
      name: "Creature",
      libraryKind: "compendium",
      description: "Fake creature entries for import tests.",
    },
    {
      name: "Spell",
      libraryKind: "compendium",
    },
    {
      name: "Condition",
      libraryKind: "compendium",
    },
  ],
  entries: [
    {
      externalId: "demo20.creature.copper-goblin",
      file: "entries/copper-goblin.md",
      title: "Copper Goblin",
      entryType: "Creature",
      aliases: ["Button Collector"],
      summary: "A nervous fake creature for importer tests.",
    },
    {
      externalId: "demo20.spell.moonfire-bolt",
      file: "entries/moonfire-bolt.md",
      title: "Moonfire Bolt",
      entryType: "Spell",
    },
    {
      externalId: "demo20.condition.rattled",
      file: "entries/rattled.md",
      title: "Rattled",
      entryType: "Condition",
    },
  ],
};

const demoFiles: MarkdownSourceFile[] = [
  {
    path: "entries/copper-goblin.md",
    content:
      "# Copper Goblin\n\nA nervous little demo creature.\n\n## Traits\n\n- Small\n- Cowardly\n\nA copper goblin often becomes [[Rattled]] when surprised.",
  },
  {
    path: "entries/moonfire-bolt.md",
    content:
      "# Moonfire Bolt\n\nA harmless demo spell.\n\n## Effect\n\nThe caster points at a distant lantern.\n\nSee also [[Copper Goblin]].",
  },
  {
    path: "entries/rattled.md",
    content:
      "# Rattled\n\nA fake demo condition used only for import testing.",
  },
];

function cloneManifest(
  changes: Partial<ImportSourcePackageManifest> = {},
): ImportSourcePackageManifest {
  return {
    ...structuredClone(demoManifest),
    ...changes,
  };
}

function issueCodesFor(
  manifest: ImportSourcePackageManifest,
  files: MarkdownSourceFile[] = demoFiles,
) {
  return buildMarkdownImportPlan({ manifest, files }).issues.map(
    (issue) => issue.code,
  );
}

test("builds a plan for the fake Demo20 package", () => {
  const plan = buildMarkdownImportPlan({
    manifest: demoManifest,
    files: demoFiles,
  });

  assert.equal(plan.ok, true);
  assert.equal(plan.packageId, "demo20.core-sample");
  assert.equal(plan.packageName, "Demo20 Core Sample");
  assert.equal(plan.dryRunOnly, true);
  assert.deepEqual(
    plan.actions.map((action) => action.type),
    [
      "create_game_system",
      "create_compendium",
      "create_entry_type",
      "create_entry_type",
      "create_entry_type",
      "create_master_entry",
      "create_master_entry",
      "create_master_entry",
    ],
  );
  assert.deepEqual(plan.issues, []);
});

test("rejects missing Markdown files", () => {
  assert.equal(
    issueCodesFor(demoManifest, demoFiles.slice(1)).includes(
      "markdown_file_missing",
    ),
    true,
  );
});

test("rejects empty Markdown files", () => {
  const files = demoFiles.map((file) =>
    file.path === "entries/rattled.md" ? { ...file, content: "   \n" } : file,
  );

  assert.equal(
    issueCodesFor(demoManifest, files).includes("markdown_file_empty"),
    true,
  );
});

test("rejects undeclared entry types", () => {
  const manifest = cloneManifest({
    entries: [
      {
        ...demoManifest.entries[0],
        entryType: "Treasure",
      },
    ],
  });

  assert.equal(
    issueCodesFor(manifest).includes("entry_type_not_declared"),
    true,
  );
});

test("rejects non-compendium entry types for the first importer", () => {
  const manifest = cloneManifest({
    entryTypes: [
      {
        name: "Lore",
        libraryKind: "settings_library",
      },
    ],
    entries: [
      {
        ...demoManifest.entries[0],
        entryType: "Lore",
      },
    ],
  });

  assert.equal(
    issueCodesFor(manifest).includes("entry_type_library_kind_not_supported"),
    true,
  );
});

test("rejects inline body content in manifest entries", () => {
  const manifest = cloneManifest({
    entries: [
      {
        ...demoManifest.entries[0],
        body: "Body content belongs in Markdown files.",
      } as ImportSourcePackageManifest["entries"][number],
    ],
  });

  assert.equal(
    issueCodesFor(manifest).includes("entry_body_not_allowed"),
    true,
  );
});

test("preserves wiki-link syntax in converted imported HTML", () => {
  const html = convertImportedMarkdownToEntryHtml(
    "# Copper Goblin\n\nSee [[Rattled]] and [[Moonfire Bolt|moonlight]].",
  );

  assert.match(html, /<h1>Copper Goblin<\/h1>/);
  assert.match(html, /\[\[Rattled\]\]/);
  assert.match(html, /\[\[Moonfire Bolt\|moonlight\]\]/);
});

test("converts Markdown headings, lists, and links safely", () => {
  const html = convertImportedMarkdownToEntryHtml(
    "# Title\n\n- one\n- two\n\n[Example](https://example.com)",
  );

  assert.match(html, /<h1>Title<\/h1>/);
  assert.match(html, /<ul>/);
  assert.match(html, /<li>one<\/li>/);
  assert.match(html, /href="https:\/\/example.com"/);
});

test("sanitizes unsafe Markdown and raw HTML", () => {
  const html = convertImportedMarkdownToEntryHtml(
    "# Title\n\n<script>alert('bad')</script>\n\n<img src=x onerror=alert(1)>\n\n[Bad](javascript:alert(1))",
  );

  assert.doesNotMatch(html, /script/i);
  assert.doesNotMatch(html, /img/i);
  assert.doesNotMatch(html, /javascript:/i);
});

test("builds source notes with package and entry markers", () => {
  const note = buildImportSourceNote({
    packageId: "demo20.core-sample",
    externalId: "demo20.creature.copper-goblin",
    distributionStatus: "tablehub_distributable",
  });

  assert.match(note, /Imported by TableHub source package/);
  assert.match(note, /packageId: demo20\.core-sample/);
  assert.match(note, /externalId: demo20\.creature\.copper-goblin/);
  assert.match(note, /distributionStatus: tablehub_distributable/);
});

test("formats dry-run plans readably", () => {
  const output = formatMarkdownImportPlan(
    buildMarkdownImportPlan({
      manifest: demoManifest,
      files: demoFiles,
    }),
  );

  assert.match(output, /Package: Demo20 Core Sample \(demo20\.core-sample\)/);
  assert.match(output, /- Create game system: Demo20/);
  assert.match(output, /- Create master entry: Copper Goblin/);
  assert.match(output, /Issues:\n- None/);
});

test("formats warnings and errors clearly", () => {
  const output = formatMarkdownImportPlan(
    buildMarkdownImportPlan({
      manifest: demoManifest,
      files: demoFiles.slice(1),
    }),
  );

  assert.match(output, /\[error\] markdown_file_missing/);
  assert.match(output, /entries\/copper-goblin\.md/);
});

test("parses CLI args with dry-run as the default mode", () => {
  const result = parseMarkdownImportCliArgs([
    "--manifest",
    "docs/examples/demo20-source-package/manifest.json",
  ]);

  assert.equal(result.ok, true);
  assert.equal(result.args.manifestPath, "docs/examples/demo20-source-package/manifest.json");
  assert.equal(result.args.mode, "dry-run");
  assert.equal(result.args.ownerId, undefined);
});

test("parses CLI apply mode with owner id", () => {
  const result = parseMarkdownImportCliArgs([
    "--manifest",
    "manifest.json",
    "--apply",
    "--owner-id",
    "aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa",
  ]);

  assert.equal(result.ok, true);
  assert.equal(result.args.mode, "apply");
  assert.equal(result.args.ownerId, "aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa");
});

test("rejects missing manifest and conflicting modes", () => {
  assert.equal(parseMarkdownImportCliArgs([]).ok, false);
  assert.equal(
    parseMarkdownImportCliArgs([
      "--manifest",
      "manifest.json",
      "--dry-run",
      "--apply",
    ]).ok,
    false,
  );
});

test("rejects apply mode without a valid owner id", () => {
  assert.equal(
    parseMarkdownImportCliArgs([
      "--manifest",
      "manifest.json",
      "--apply",
    ]).ok,
    false,
  );
  assert.equal(
    parseMarkdownImportCliArgs([
      "--manifest",
      "manifest.json",
      "--apply",
      "--owner-id",
      "not-a-uuid",
    ]).ok,
    false,
  );
});
