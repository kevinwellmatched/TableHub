export type SettingsLibraryFormFieldErrors = {
  name?: string;
  description?: string;
  visibility?: string;
  genre?: string;
  tone?: string;
  sourceType?: string;
  gameSystemId?: string;
  sourceCategory?: string;
  sourceSubtype?: string;
  clonePolicy?: string;
  defaultPlayerVisibility?: string;
  sourceUrl?: string;
  sourceNotes?: string;
  version?: string;
};

export type SettingsLibraryFormState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors?: SettingsLibraryFormFieldErrors;
};

export const initialSettingsLibraryFormState: SettingsLibraryFormState = {
  status: "idle",
  message: "",
};
