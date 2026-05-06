export type EntryTypeFormFieldErrors = {
  name?: string;
  description?: string;
  libraryKind?: string;
  visibility?: string;
  sortOrder?: string;
};

export type EntryTypeFormState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors?: EntryTypeFormFieldErrors;
};

export const initialEntryTypeFormState: EntryTypeFormState = {
  status: "idle",
  message: "",
};
