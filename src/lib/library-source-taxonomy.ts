export const LIBRARY_SOURCE_CATEGORIES = [
  "core_rulebook",
  "expansion_supplement",
  "setting_world_lore",
  "adventure_module",
  "other",
] as const;

export const LIBRARY_SOURCE_SUBTYPES = [
  "srd",
  "core_rulebook",
  "starter_set",
  "beginner_box",
  "rules_cyclopedia",
  "expansion_book",
  "supplement",
  "splatbook",
  "sourcebook",
  "bestiary",
  "monster_book",
  "campaign_setting",
  "gazetteer",
  "worldbook",
  "lorebook",
  "adventure",
  "module",
  "adventure_path",
  "adventure_anthology",
  "dungeon",
  "hexcrawl",
  "gm_screen",
  "rollable_table_collection",
  "reference_sheet",
  "homebrew_packet",
  "import_batch",
  "other",
] as const;

export const LIBRARY_SOURCE_CLONE_POLICIES = [
  "locked_to_system",
  "cloneable_to_system",
  "system_agnostic",
] as const;

export const LIBRARY_SOURCE_PLAYER_VISIBILITIES = [
  "visible",
  "gm_only",
  "mixed",
] as const;

export type LibrarySourceCategory =
  (typeof LIBRARY_SOURCE_CATEGORIES)[number];
export type LibrarySourceSubtype = (typeof LIBRARY_SOURCE_SUBTYPES)[number];
export type LibrarySourceClonePolicy =
  (typeof LIBRARY_SOURCE_CLONE_POLICIES)[number];
export type LibrarySourcePlayerVisibility =
  (typeof LIBRARY_SOURCE_PLAYER_VISIBILITIES)[number];

type TaxonomyOption<TValue extends string> = {
  value: TValue;
  label: string;
  description: string;
};

const CATEGORY_LABELS: Record<LibrarySourceCategory, string> = {
  core_rulebook: "Core Rulebooks",
  expansion_supplement: "Expansions & Supplements",
  setting_world_lore: "Setting & World Lore",
  adventure_module: "Adventures & Modules",
  other: "Other",
};

const CATEGORY_DESCRIPTIONS: Record<LibrarySourceCategory, string> = {
  core_rulebook: "Primary rules sources for one System.",
  expansion_supplement: "Additional rules, options, monsters, items, or references.",
  setting_world_lore: "Reusable setting, place, faction, history, and lore sources.",
  adventure_module: "Adventure, module, dungeon, hexcrawl, and scenario sources.",
  other: "A source that does not fit the current controlled categories.",
};

const SUBTYPE_LABELS: Record<LibrarySourceSubtype, string> = {
  srd: "SRD",
  core_rulebook: "Core Rulebook",
  starter_set: "Starter Set",
  beginner_box: "Beginner Box",
  rules_cyclopedia: "Rules Cyclopedia",
  expansion_book: "Expansion Book",
  supplement: "Supplement",
  splatbook: "Splatbook",
  sourcebook: "Sourcebook",
  bestiary: "Bestiary",
  monster_book: "Monster Book",
  campaign_setting: "Campaign Setting",
  gazetteer: "Gazetteer",
  worldbook: "Worldbook",
  lorebook: "Lorebook",
  adventure: "Adventure",
  module: "Module",
  adventure_path: "Adventure Path",
  adventure_anthology: "Adventure Anthology",
  dungeon: "Dungeon",
  hexcrawl: "Hexcrawl",
  gm_screen: "GM Screen",
  rollable_table_collection: "Rollable Table Collection",
  reference_sheet: "Reference Sheet",
  homebrew_packet: "Homebrew Packet",
  import_batch: "Import Batch",
  other: "Other",
};

const SUBTYPE_DESCRIPTIONS: Record<LibrarySourceSubtype, string> = {
  srd: "Open or reference-system document source metadata.",
  core_rulebook: "A primary rulebook for one System.",
  starter_set: "A starter product or starter rules source.",
  beginner_box: "A beginner-focused boxed set or starter bundle.",
  rules_cyclopedia: "A compiled rules reference source.",
  expansion_book: "A book that expands an existing System.",
  supplement: "Additional rules, options, or reference material.",
  splatbook: "A focused supplement for a class, theme, faction, or option set.",
  sourcebook: "A broad reference source for rules, lore, or options.",
  bestiary: "A creature or monster reference source.",
  monster_book: "A monster-focused source.",
  campaign_setting: "A published or private campaign setting source.",
  gazetteer: "A place-focused setting reference.",
  worldbook: "A broad world or setting reference.",
  lorebook: "A lore-focused source.",
  adventure: "A playable adventure source.",
  module: "A playable module source.",
  adventure_path: "A connected adventure path source.",
  adventure_anthology: "A collection of multiple adventures.",
  dungeon: "A dungeon-focused adventure source.",
  hexcrawl: "A map-travel or exploration-focused adventure source.",
  gm_screen: "A GM screen or quick-reference source.",
  rollable_table_collection: "A collection of rollable tables.",
  reference_sheet: "A compact reference sheet.",
  homebrew_packet: "A private or table-created homebrew packet.",
  import_batch: "A batch created by a future import workflow.",
  other: "A subtype that does not fit the current controlled list.",
};

const CLONE_POLICY_LABELS: Record<LibrarySourceClonePolicy, string> = {
  locked_to_system: "Locked to System",
  cloneable_to_system: "Cloneable to System",
  system_agnostic: "System Agnostic",
};

const CLONE_POLICY_DESCRIPTIONS: Record<LibrarySourceClonePolicy, string> = {
  locked_to_system: "Rules/mechanics source tied to one System.",
  cloneable_to_system: "May be copied/adapted to another System.",
  system_agnostic: "Can be used across Systems with little or no conversion.",
};

const PLAYER_VISIBILITY_LABELS: Record<LibrarySourcePlayerVisibility, string> = {
  visible: "Visible",
  gm_only: "GM Only",
  mixed: "Mixed",
};

const PLAYER_VISIBILITY_DESCRIPTIONS: Record<
  LibrarySourcePlayerVisibility,
  string
> = {
  visible: "Players can usually see this source by default.",
  gm_only: "This source should usually start hidden from players.",
  mixed: "This source may contain both player-visible and GM-only material.",
};

const DEFAULT_CLONE_POLICY_BY_CATEGORY: Record<
  LibrarySourceCategory,
  LibrarySourceClonePolicy
> = {
  core_rulebook: "locked_to_system",
  expansion_supplement: "locked_to_system",
  setting_world_lore: "cloneable_to_system",
  adventure_module: "cloneable_to_system",
  other: "locked_to_system",
};

const DEFAULT_PLAYER_VISIBILITY_BY_CATEGORY: Record<
  LibrarySourceCategory,
  LibrarySourcePlayerVisibility
> = {
  core_rulebook: "visible",
  expansion_supplement: "visible",
  setting_world_lore: "gm_only",
  adventure_module: "gm_only",
  other: "mixed",
};

export const LIBRARY_SOURCE_CATEGORY_OPTIONS =
  LIBRARY_SOURCE_CATEGORIES.map<TaxonomyOption<LibrarySourceCategory>>(
    (category) => ({
      value: category,
      label: CATEGORY_LABELS[category],
      description: CATEGORY_DESCRIPTIONS[category],
    }),
  );

export const LIBRARY_SOURCE_SUBTYPE_OPTIONS =
  LIBRARY_SOURCE_SUBTYPES.map<TaxonomyOption<LibrarySourceSubtype>>(
    (subtype) => ({
      value: subtype,
      label: SUBTYPE_LABELS[subtype],
      description: SUBTYPE_DESCRIPTIONS[subtype],
    }),
  );

export const LIBRARY_SOURCE_CLONE_POLICY_OPTIONS =
  LIBRARY_SOURCE_CLONE_POLICIES.map<TaxonomyOption<LibrarySourceClonePolicy>>(
    (clonePolicy) => ({
      value: clonePolicy,
      label: CLONE_POLICY_LABELS[clonePolicy],
      description: CLONE_POLICY_DESCRIPTIONS[clonePolicy],
    }),
  );

export const LIBRARY_SOURCE_PLAYER_VISIBILITY_OPTIONS =
  LIBRARY_SOURCE_PLAYER_VISIBILITIES.map<
    TaxonomyOption<LibrarySourcePlayerVisibility>
  >((visibility) => ({
    value: visibility,
    label: PLAYER_VISIBILITY_LABELS[visibility],
    description: PLAYER_VISIBILITY_DESCRIPTIONS[visibility],
  }));

export function isLibrarySourceCategory(
  value: string,
): value is LibrarySourceCategory {
  return LIBRARY_SOURCE_CATEGORIES.includes(value as LibrarySourceCategory);
}

export function isLibrarySourceSubtype(
  value: string,
): value is LibrarySourceSubtype {
  return LIBRARY_SOURCE_SUBTYPES.includes(value as LibrarySourceSubtype);
}

export function isLibrarySourceClonePolicy(
  value: string,
): value is LibrarySourceClonePolicy {
  return LIBRARY_SOURCE_CLONE_POLICIES.includes(
    value as LibrarySourceClonePolicy,
  );
}

export function isLibrarySourcePlayerVisibility(
  value: string,
): value is LibrarySourcePlayerVisibility {
  return LIBRARY_SOURCE_PLAYER_VISIBILITIES.includes(
    value as LibrarySourcePlayerVisibility,
  );
}

export function formatLibrarySourceCategory(value: string) {
  const category = isLibrarySourceCategory(value) ? value : "other";
  return CATEGORY_LABELS[category];
}

export function getLibrarySourceCategoryDescription(value: string) {
  const category = isLibrarySourceCategory(value) ? value : "other";
  return CATEGORY_DESCRIPTIONS[category];
}

export function formatLibrarySourceSubtype(value: string) {
  const subtype = isLibrarySourceSubtype(value) ? value : "other";
  return SUBTYPE_LABELS[subtype];
}

export function getLibrarySourceSubtypeDescription(value: string) {
  const subtype = isLibrarySourceSubtype(value) ? value : "other";
  return SUBTYPE_DESCRIPTIONS[subtype];
}

export function formatLibrarySourceClonePolicy(value: string) {
  const clonePolicy = isLibrarySourceClonePolicy(value)
    ? value
    : "locked_to_system";
  return CLONE_POLICY_LABELS[clonePolicy];
}

export function getLibrarySourceClonePolicyDescription(value: string) {
  const clonePolicy = isLibrarySourceClonePolicy(value)
    ? value
    : "locked_to_system";
  return CLONE_POLICY_DESCRIPTIONS[clonePolicy];
}

export function formatLibrarySourcePlayerVisibility(value: string) {
  const visibility = isLibrarySourcePlayerVisibility(value) ? value : "mixed";
  return PLAYER_VISIBILITY_LABELS[visibility];
}

export function getLibrarySourcePlayerVisibilityDescription(value: string) {
  const visibility = isLibrarySourcePlayerVisibility(value) ? value : "mixed";
  return PLAYER_VISIBILITY_DESCRIPTIONS[visibility];
}

export function getDefaultClonePolicyForCategory(value: string) {
  const category = isLibrarySourceCategory(value) ? value : "other";
  return DEFAULT_CLONE_POLICY_BY_CATEGORY[category];
}

export function getDefaultPlayerVisibilityForCategory(value: string) {
  const category = isLibrarySourceCategory(value) ? value : "other";
  return DEFAULT_PLAYER_VISIBILITY_BY_CATEGORY[category];
}
