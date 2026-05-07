export type MasterEntryFormFieldErrors = {
  libraryKind?: string;
  compendiumId?: string;
  settingsLibraryId?: string;
  entryTypeId?: string;
  title?: string;
  aliases?: string;
  summary?: string;
  body?: string;
  bodyFormat?: string;
  properties?: string;
  visibility?: string;
  sortOrder?: string;
  licenseName?: string;
  licenseUrl?: string;
  sourceType?: string;
  sourceUrl?: string;
  sourceNotes?: string;
  version?: string;
};

export type MasterEntryFormState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors?: MasterEntryFormFieldErrors;
};

export const initialMasterEntryFormState: MasterEntryFormState = {
  status: "idle",
  message: "",
};
