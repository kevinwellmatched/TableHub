import assert from "node:assert/strict";
import test from "node:test";

import {
  STARTER_FANTASY_SETTINGS_LIBRARY,
  createSettingsLibrarySlugFromName,
  validateSettingsLibraryInput,
} from "./settings-library-validation.ts";

test("creates lowercase kebab-case slugs from Settings Library names", () => {
  assert.equal(
    createSettingsLibrarySlugFromName("Starter Fantasy Settings Library"),
    "starter-fantasy-settings-library",
  );
  assert.equal(
    createSettingsLibrarySlugFromName("  My Lore / Campaign Notes!  "),
    "my-lore-campaign-notes",
  );
});

test("accepts valid Settings Library details", () => {
  const result = validateSettingsLibraryInput({
    name: "Starter Fantasy Settings Library",
    description: "A reusable master container with no setting entries yet.",
    visibility: "private",
    genre: "Fantasy",
    tone: "Adventurous, mysterious, table-ready",
    sourceType: "manual",
    gameSystemId: "11111111-1111-4111-8111-111111111111",
    sourceCategory: "setting_world_lore",
    sourceSubtype: "campaign_setting",
    clonePolicy: "cloneable_to_system",
    defaultPlayerVisibility: "gm_only",
    sourceUrl: "https://example.com/source",
    sourceNotes: "Container only.",
    version: "0.1",
  });

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.deepEqual(result.values, {
      name: "Starter Fantasy Settings Library",
      slug: "starter-fantasy-settings-library",
      description: "A reusable master container with no setting entries yet.",
      visibility: "private",
      genre: "Fantasy",
      tone: "Adventurous, mysterious, table-ready",
      source_type: "manual",
      game_system_id: "11111111-1111-4111-8111-111111111111",
      source_category: "setting_world_lore",
      source_subtype: "campaign_setting",
      clone_policy: "cloneable_to_system",
      default_player_visibility: "gm_only",
      source_url: "https://example.com/source",
      source_notes: "Container only.",
      version: "0.1",
    });
  }
});

test("rejects missing required Settings Library values", () => {
  const result = validateSettingsLibraryInput({
    name: "",
    description: "",
    visibility: "private",
    genre: "",
    tone: "",
    sourceType: "manual",
    gameSystemId: "",
    sourceCategory: "setting_world_lore",
    sourceSubtype: "campaign_setting",
    clonePolicy: "cloneable_to_system",
    defaultPlayerVisibility: "gm_only",
    sourceUrl: "",
    sourceNotes: "",
    version: "",
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.fieldErrors.name, "Settings Library name is required.");
    assert.equal(result.fieldErrors.version, "Version is required.");
  }
});

test("rejects invalid Settings Library option values and URLs", () => {
  const result = validateSettingsLibraryInput({
    name: "Unsafe Import",
    description: "",
    visibility: "campaign",
    genre: "",
    tone: "",
    sourceType: "scraped_site",
    gameSystemId: "",
    sourceCategory: "setting_world_lore",
    sourceSubtype: "campaign_setting",
    clonePolicy: "cloneable_to_system",
    defaultPlayerVisibility: "gm_only",
    sourceUrl: "not a url",
    sourceNotes: "",
    version: "0.1",
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.fieldErrors.visibility, "Choose private, shared, or public.");
    assert.equal(result.fieldErrors.sourceType, "Choose a supported source type.");
    assert.equal(result.fieldErrors.sourceUrl, "Enter a valid URL, or leave it blank.");
  }
});

test("rejects invalid Settings Library source metadata values", () => {
  const result = validateSettingsLibraryInput({
    name: "Unsafe Lore Source",
    description: "",
    visibility: "private",
    genre: "",
    tone: "",
    sourceType: "manual",
    gameSystemId: "",
    sourceCategory: "campaign_book",
    sourceSubtype: "wiki_scrape",
    clonePolicy: "copy_everywhere",
    defaultPlayerVisibility: "players_only",
    sourceUrl: "",
    sourceNotes: "",
    version: "0.1",
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.fieldErrors.sourceCategory, "Choose a supported source category.");
    assert.equal(result.fieldErrors.sourceSubtype, "Choose a supported source subtype.");
    assert.equal(result.fieldErrors.clonePolicy, "Choose a supported clone policy.");
    assert.equal(
      result.fieldErrors.defaultPlayerVisibility,
      "Choose a supported default player visibility.",
    );
  }
});

test("allows Settings Library game system to stay optional", () => {
  const result = validateSettingsLibraryInput({
    name: "System Neutral Lore",
    description: "",
    visibility: "private",
    genre: "",
    tone: "",
    sourceType: "manual",
    gameSystemId: "",
    sourceCategory: "setting_world_lore",
    sourceSubtype: "campaign_setting",
    clonePolicy: "cloneable_to_system",
    defaultPlayerVisibility: "gm_only",
    sourceUrl: "",
    sourceNotes: "",
    version: "0.1",
  });

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.values.game_system_id, null);
  }
});

test("enforces Settings Library field length limits", () => {
  const result = validateSettingsLibraryInput({
    name: "A".repeat(121),
    description: "A".repeat(2001),
    visibility: "private",
    genre: "A".repeat(81),
    tone: "A".repeat(121),
    sourceType: "manual",
    gameSystemId: "",
    sourceCategory: "setting_world_lore",
    sourceSubtype: "campaign_setting",
    clonePolicy: "cloneable_to_system",
    defaultPlayerVisibility: "gm_only",
    sourceUrl: "",
    sourceNotes: "",
    version: "A".repeat(41),
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.fieldErrors.name, "Settings Library name must be 120 characters or fewer.");
    assert.equal(result.fieldErrors.description, "Description must be 2000 characters or fewer.");
    assert.equal(result.fieldErrors.genre, "Genre must be 80 characters or fewer.");
    assert.equal(result.fieldErrors.tone, "Tone must be 120 characters or fewer.");
    assert.equal(result.fieldErrors.version, "Version must be 40 characters or fewer.");
  }
});

test("provides safe starter fantasy Settings Library metadata only", () => {
  assert.deepEqual(STARTER_FANTASY_SETTINGS_LIBRARY, {
    name: "Starter Fantasy Settings Library",
    description:
      "A reusable master Settings Library container for fantasy campaign lore. No NPCs, places, factions, maps, timelines, or lore entries have been created yet.",
    visibility: "private",
    genre: "Fantasy",
    tone: "Adventurous, mysterious, table-ready",
    sourceType: "manual",
    gameSystemId: "",
    sourceCategory: "setting_world_lore",
    sourceSubtype: "campaign_setting",
    clonePolicy: "cloneable_to_system",
    defaultPlayerVisibility: "gm_only",
    sourceUrl: "",
    sourceNotes:
      "Container only. No setting entries, imported notes, copyrighted text, or third-party data have been added.",
    version: "0.1",
  });
});
