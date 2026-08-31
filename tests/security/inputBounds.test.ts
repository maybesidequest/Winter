import assert from "node:assert/strict";
import test from "node:test";

import { boundedDashboardPreferenceSchema } from "~/schemas/dashboardPreferences";
import {
  hubDiscoveryQuerySchema,
  quickConnectInputSchema,
} from "~/schemas/hubDiscovery";
import { createHubSchema } from "~/schemas/hub";

test("discovery bounds page, tags, and cursor", () => {
  assert.equal(hubDiscoveryQuerySchema.safeParse({ page: 21 }).success, false);
  assert.equal(
    hubDiscoveryQuerySchema.safeParse({ tags: Array(11).fill("tag") }).success,
    false,
  );
  assert.equal(
    hubDiscoveryQuerySchema.safeParse({ cursor: "x".repeat(1_025) }).success,
    false,
  );
});

test("discovery join bounds custom names and idempotency keys", () => {
  const base = {
    hubId: "hub",
    serverId: "server",
    channelId: "channel",
    idempotencyKey: "request-1",
  };

  assert.equal(
    quickConnectInputSchema.safeParse({ ...base, customName: "x".repeat(65) })
      .success,
    false,
  );
  assert.equal(
    quickConnectInputSchema.safeParse({
      ...base,
      idempotencyKey: "x".repeat(129),
    }).success,
    false,
  );
});

test("hub creation bounds URLs and messages", () => {
  const base = {
    name: "Example hub",
    shortDescription: "Description",
    visibility: "PUBLIC" as const,
    language: "English",
    region: "Global",
    idempotencyKey: "request-1",
  };

  assert.equal(
    createHubSchema.safeParse({ ...base, iconUrl: "javascript:alert(1)" })
      .success,
    false,
  );
  assert.equal(
    createHubSchema.safeParse({ ...base, welcomeMessage: "x".repeat(2_001) })
      .success,
    false,
  );
});

test("dashboard preferences reject excessive recursion and total size", () => {
  const recursive = { value: true } as Record<string, unknown>;
  let current = recursive;
  for (let index = 0; index < 6; index += 1) {
    current.next = { value: true };
    current = current.next as Record<string, unknown>;
  }

  assert.equal(boundedDashboardPreferenceSchema.safeParse(recursive).success, false);
  assert.equal(
    boundedDashboardPreferenceSchema.safeParse({ value: "x".repeat(8_193) })
      .success,
    false,
  );
});
