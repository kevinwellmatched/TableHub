import assert from "node:assert/strict";
import test from "node:test";

import { formatOverviewCount } from "./master-library-overview-copy.ts";

test("formats Master Library overview counts", () => {
  assert.equal(formatOverviewCount(0, "record"), "0 records");
  assert.equal(formatOverviewCount(1, "record"), "1 record");
  assert.equal(formatOverviewCount(2, "record"), "2 records");
});
