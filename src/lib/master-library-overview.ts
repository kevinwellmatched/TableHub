import "server-only";

import { getCompendiums } from "@/lib/compendiums";
import { getEntryTypes } from "@/lib/entry-types";
import { getGameSystemsForCurrentUser } from "@/lib/game-systems";
import { getMasterEntries } from "@/lib/master-entries";
import { getSettingsLibraries } from "@/lib/settings-libraries";

export async function getMasterLibraryOverview() {
  const [
    gameSystems,
    compendiums,
    settingsLibraries,
    entryTypes,
    masterEntries,
  ] = await Promise.all([
    getGameSystemsForCurrentUser(),
    getCompendiums(),
    getSettingsLibraries(),
    getEntryTypes(),
    getMasterEntries(),
  ]);

  return {
    gameSystems,
    compendiums,
    settingsLibraries,
    entryTypes,
    masterEntries,
    totalCount:
      gameSystems.length +
      compendiums.length +
      settingsLibraries.length +
      entryTypes.length +
      masterEntries.length,
  };
}
