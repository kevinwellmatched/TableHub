export type AuthFormState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors?: {
    email?: string;
    password?: string;
    username?: string;
    displayName?: string;
  };
};

export const initialAuthFormState: AuthFormState = {
  status: "idle",
  message: "",
};
