export type ProjectFormState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors?: {
    projectName?: string;
    projectDescription?: string;
  };
};

export const initialProjectFormState: ProjectFormState = {
  status: "idle",
  message: "",
};
