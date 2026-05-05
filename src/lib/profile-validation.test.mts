import assert from "node:assert/strict";
import test from "node:test";

import { validateProfileInput } from "./profile-validation.ts";

test("accepts a valid username and display name", () => {
  const result = validateProfileInput({
    username: "archivist_12",
    displayName: "Kev the Keeper",
  });

  assert.deepEqual(result, {
    ok: true,
    values: {
      username: "archivist_12",
      displayName: "Kev the Keeper",
    },
  });
});

test("rejects usernames outside the allowed format", () => {
  const result = validateProfileInput({
    username: "ke",
    displayName: "Kev",
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.fieldErrors.username, "Username must be 3-32 characters.");
  }
});

test("trims display names and rejects empty values", () => {
  const result = validateProfileInput({
    username: "table_keeper",
    displayName: "   ",
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.fieldErrors.displayName, "Display name is required.");
  }
});
