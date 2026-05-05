export type ProfileInput = {
  username: string;
  displayName: string;
};

export type ProfileValidationResult =
  | {
      ok: true;
      values: ProfileInput;
    }
  | {
      ok: false;
      fieldErrors: Partial<Record<keyof ProfileInput, string>>;
    };

const USERNAME_PATTERN = /^[A-Za-z0-9_]+$/;

export function validateProfileInput(input: ProfileInput): ProfileValidationResult {
  const username = input.username.trim();
  const displayName = input.displayName.trim();
  const fieldErrors: Partial<Record<keyof ProfileInput, string>> = {};

  if (username.length < 3 || username.length > 32) {
    fieldErrors.username = "Username must be 3-32 characters.";
  } else if (!USERNAME_PATTERN.test(username)) {
    fieldErrors.username = "Username may only use letters, numbers, and underscores.";
  }

  if (displayName.length === 0) {
    fieldErrors.displayName = "Display name is required.";
  } else if (displayName.length > 80) {
    fieldErrors.displayName = "Display name must be 80 characters or fewer.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      fieldErrors,
    };
  }

  return {
    ok: true,
    values: {
      username,
      displayName,
    },
  };
}
