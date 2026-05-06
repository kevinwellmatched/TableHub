export type GameSystemFormFieldErrors = {
  name?: string;
  edition?: string;
  publisher?: string;
  description?: string;
  rulesetYear?: string;
  visibility?: string;
  licenseName?: string;
  licenseUrl?: string;
  sourceType?: string;
  sourceUrl?: string;
  sourceNotes?: string;
  version?: string;
};

export type GameSystemFormState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors?: GameSystemFormFieldErrors;
};

export const initialGameSystemFormState: GameSystemFormState = {
  status: "idle",
  message: "",
};
