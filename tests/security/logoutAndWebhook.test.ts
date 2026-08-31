import assert from "node:assert/strict";
import { after, test } from "node:test";

import * as logoutRoute from "~/routes/auth/logout";
import { action as topggAction } from "~/routes/api/webhooks/topgg";
import { redis } from "~/redis.server";

after(() => redis.disconnect());

test("logout has no GET loader and rejects non-POST action requests", async () => {
  assert.equal("loader" in logoutRoute, false);

  const response = await logoutRoute.action({
    request: new Request("http://winter.test/auth/logout"),
  } as never);

  assert.equal(response.status, 405);
});

test("logout rejects cross-origin POST requests", async () => {
  const response = await logoutRoute.action({
    request: new Request("http://winter.test/auth/logout", {
      method: "POST",
      headers: { origin: "https://attacker.example" },
    }),
  } as never);

  assert.equal(response.status, 403);
});

test("Top.gg rejects an oversized body before forwarding", async () => {
  const response = await topggAction({
    request: new Request("http://winter.test/api/webhooks/topgg", {
      method: "POST",
      headers: {
        "content-length": "65537",
        "x-topgg-signature": "test-signature",
      },
      body: new Uint8Array(65_537),
    }),
  } as never);

  assert.equal(response.status, 413);
});

test("Top.gg enforces the limit while streaming without Content-Length", async () => {
  const response = await topggAction({
    request: new Request("http://winter.test/api/webhooks/topgg", {
      method: "POST",
      headers: { "x-topgg-signature": "test-signature" },
      body: new Uint8Array(65_537),
    }),
  } as never);

  assert.equal(response.status, 413);
});
