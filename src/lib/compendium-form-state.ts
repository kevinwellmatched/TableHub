export type CompendiumFormFieldErrors = {
  name?: string;
  description?: string;
  gameSystemId?: string;
  visibility?: string;
  licenseName?: string;
  licenseUrl?: string;
  sourceType?: string;
  sourceCategory?: string;
  sourceSubtype?: string;
  clonePolicy?: string;
  defaultPlayerVisibility?: string;
  sourceUrl?: string;
  sourceNotes?: string;
  version?: string;
};

export type CompendiumFormState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors?: CompendiumFormFieldErrors;
};

export const initialCompendiumFormState: CompendiumFormState = {
  status: "idle",
  message: "",
};
