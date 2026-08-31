import assert from "node:assert/strict";
import { after, test } from "node:test";

import { redis } from "~/redis.server";
import {
  SESSION_MAX_AGE_SECONDS,
  sessionStorage,
} from "~/services/session.server";

after(() => redis.disconnect());

test("session cookies carry the configured absolute lifetime", async () => {
  const session = await sessionStorage.getSession();
  const cookie = await sessionStorage.commitSession(session);

  assert.match(cookie, new RegExp(`Max-Age=${SESSION_MAX_AGE_SECONDS}(?:;|$)`));
});
