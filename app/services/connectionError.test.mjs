import assert from "node:assert/strict";
import test from "node:test";

import { classifyConnectionControlError } from "./connectionError.ts";

test("connection errors keep stale, denied, and unauthenticated states distinct", () => {
  assert.equal(classifyConnectionControlError({ code: 10 }), "CONFLICT");
  assert.equal(classifyConnectionControlError({ code: 7 }), "FORBIDDEN");
  assert.equal(classifyConnectionControlError({ code: 16 }), "SERVICE_UNAVAILABLE");
  assert.equal(
    classifyConnectionControlError({ message: "wrapper", cause: { code: "PERMISSION_DENIED" } }),
    "FORBIDDEN",
  );
});
