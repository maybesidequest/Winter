import assert from "node:assert/strict";
import { after, test } from "node:test";

import { redis } from "~/redis.server";
import { handleRequest } from "~/routes/api/v1/$";

after(() => redis.disconnect());

test("safe query procedures remain available over GET", async () => {
  const response = await handleRequest(
    new Request("http://winter.test/api/v1/user/locales"),
  );

  assert.equal(response.status, 200);
});

test("mutation procedures reject GET and HEAD", async () => {
  for (const method of ["GET", "HEAD"]) {
    const response = await handleRequest(
      new Request("http://winter.test/api/v1/hub/createHub", { method }),
    );

    assert.equal(response.status, 405);
  }
});

test("queries with refresh side effects require a same-origin POST", async () => {
  const response = await handleRequest(
    new Request("http://winter.test/api/v1/server/list?data=%7B%22forceRefresh%22%3Atrue%7D"),
  );

  assert.equal(response.status, 405);
});

test("mutation POST requires a same-origin browser signal", async () => {
  const response = await handleRequest(
    new Request("http://winter.test/api/v1/hub/createHub", { method: "POST" }),
  );

  assert.equal(response.status, 403);
});

test("mutation POST rejects cross-origin Origin and Fetch Metadata", async () => {
  const requests = [
    new Request("http://winter.test/api/v1/hub/createHub", {
      method: "POST",
      headers: { origin: "https://attacker.example" },
    }),
    new Request("http://winter.test/api/v1/hub/createHub", {
      method: "POST",
      headers: { "sec-fetch-site": "cross-site" },
    }),
  ];

  for (const request of requests) {
    const response = await handleRequest(request);
    assert.equal(response.status, 403);
  }
});

test("same-origin mutation POST reaches authentication", async () => {
  const originalError = console.error;
  console.error = () => undefined;

  try {
    const response = await handleRequest(
      new Request("http://winter.test/api/v1/hub/createHub", {
        method: "POST",
        headers: { origin: "http://winter.test" },
      }),
    );

    assert.equal(response.status, 401);
  } finally {
    console.error = originalError;
  }
});
