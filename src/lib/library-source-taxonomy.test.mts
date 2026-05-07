import assert from "node:assert/strict";
import test from "node:test";

import {
  LIBRARY_SOURCE_CATEGORIES,
  LIBRARY_SOURCE_CLONE_POLICIES,
  LIBRARY_SOURCE_PLAYER_VISIBILITIES,
  LIBRARY_SOURCE_SUBTYPES,
  formatLibrarySourceCategory,
  formatLibrarySourceClonePolicy,
  formatLibrarySourcePlayerVisibility,
  formatLibrarySourceSubtype,
  getDefaultClonePolicyForCategory,
  getDefaultPlayerVisibilityForCategory,
  getLibrarySourceClonePolicyDescription,
  isLibrarySourceCategory,
  isLibrarySourceClonePolicy,
  isLibrarySourcePlayerVisibility,
  isLibrarySourceSubtype,
} from "./library-source-taxonomy.ts";

test("keeps Library Source categories in the approved order", () => {
  assert.deepEqual(LIBRARY_SOURCE_CATEGORIES, [
    "core_rulebook",
    "expansion_supplement",
    "setting_world_lore",
    "adventure_module",
    "other",
  ]);
});

test("labels every Library Source category", () => {
  for (const category of LIBRARY_SOURCE_CATEGORIES) {
    assert.notEqual(formatLibrarySourceCategory(category), "");
  }

  assert.equal(formatLibrarySourceCategory("core_rulebook"), "Core Rulebooks");
  assert.equal(
    formatLibrarySourceCategory("expansion_supplement"),
    "Expansions & Supplements",
  );
  assert.equal(
    formatLibrarySourceCategory("adventure_module"),
    "Adventures & Modules",
  );
});

test("keeps Library Source subtypes controlled but extensible", () => {
  assert.equal(LIBRARY_SOURCE_SUBTYPES.includes("srd"), true);
  assert.equal(LIBRARY_SOURCE_SUBTYPES.includes("gm_screen"), true);
  assert.equal(LIBRARY_SOURCE_SUBTYPES.includes("import_batch"), true);
  assert.equal(formatLibrarySourceSubtype("homebrew_packet"), "Homebrew Packet");
});

test("labels and explains every clone policy", () => {
  for (const clonePolicy of LIBRARY_SOURCE_CLONE_POLICIES) {
    assert.notEqual(formatLibrarySourceClonePolicy(clonePolicy), "");
    assert.notEqual(getLibrarySourceClonePolicyDescription(clonePolicy), "");
  }

  assert.equal(
    formatLibrarySourceClonePolicy("locked_to_system"),
    "Locked to System",
  );
  assert.equal(
    getLibrarySourceClonePolicyDescription("system_agnostic"),
    "Can be used across Systems with little or no conversion.",
  );
});

test("labels every default player visibility", () => {
  for (const visibility of LIBRARY_SOURCE_PLAYER_VISIBILITIES) {
    assert.notEqual(formatLibrarySourcePlayerVisibility(visibility), "");
  }

  assert.equal(formatLibrarySourcePlayerVisibility("visible"), "Visible");
  assert.equal(formatLibrarySourcePlayerVisibility("gm_only"), "GM Only");
  assert.equal(formatLibrarySourcePlayerVisibility("mixed"), "Mixed");
});

test("returns expected defaults by Library Source category", () => {
  assert.equal(
    getDefaultClonePolicyForCategory("core_rulebook"),
    "locked_to_system",
  );
  assert.equal(
    getDefaultClonePolicyForCategory("expansion_supplement"),
    "locked_to_system",
  );
  assert.equal(
    getDefaultClonePolicyForCategory("setting_world_lore"),
    "cloneable_to_system",
  );
  assert.equal(
    getDefaultClonePolicyForCategory("adventure_module"),
    "cloneable_to_system",
  );
  assert.equal(getDefaultClonePolicyForCategory("other"), "locked_to_system");

  assert.equal(getDefaultPlayerVisibilityForCategory("core_rulebook"), "visible");
  assert.equal(
    getDefaultPlayerVisibilityForCategory("expansion_supplement"),
    "visible",
  );
  assert.equal(
    getDefaultPlayerVisibilityForCategory("setting_world_lore"),
    "gm_only",
  );
  assert.equal(
    getDefaultPlayerVisibilityForCategory("adventure_module"),
    "gm_only",
  );
  assert.equal(getDefaultPlayerVisibilityForCategory("other"), "mixed");
});

test("handles unknown taxonomy inputs safely", () => {
  assert.equal(isLibrarySourceCategory("adventure_campaign"), false);
  assert.equal(isLibrarySourceSubtype("third_party_wiki"), false);
  assert.equal(isLibrarySourceClonePolicy("copy_everywhere"), false);
  assert.equal(isLibrarySourcePlayerVisibility("players_only"), false);

  assert.equal(formatLibrarySourceCategory("adventure_campaign"), "Other");
  assert.equal(formatLibrarySourceSubtype("third_party_wiki"), "Other");
  assert.equal(formatLibrarySourceClonePolicy("copy_everywhere"), "Locked to System");
  assert.equal(formatLibrarySourcePlayerVisibility("players_only"), "Mixed");
  assert.equal(getDefaultClonePolicyForCategory("adventure_campaign"), "locked_to_system");
  assert.equal(getDefaultPlayerVisibilityForCategory("adventure_campaign"), "mixed");
});
