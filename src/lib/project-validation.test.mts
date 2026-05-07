import assert from "node:assert/strict";
import test from "node:test";

import { validateProjectInput } from "./project-validation.ts";

test("accepts project details with an optional primary game system", () => {
  const result = validateProjectInput({
    projectName: "The Ember Vault",
    projectDescription: "A project library for one table.",
    primaryGameSystemId: "11111111-1111-4111-8111-111111111111",
  });

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.deepEqual(result.values, {
      projectName: "The Ember Vault",
      projectDescription: "A project library for one table.",
      primaryGameSystemId: "11111111-1111-4111-8111-111111111111",
    });
  }
});

test("allows project primary game system to stay unset", () => {
  const result = validateProjectInput({
    projectName: "No System Yet",
    projectDescription: "",
    primaryGameSystemId: "",
  });

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.values.primaryGameSystemId, "");
  }
});
