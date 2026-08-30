import { describe, expect, it } from "bun:test";
import type { HubResource } from "~/resources/hub";
import {
  deleteHubSchema,
  lockdownHubSchema,
  transferHubOwnershipSchema,
} from "~/schemas/hub";
import { createHubLifecycleService } from "~/services/hub.server";
import {
  classifyLifecycleError,
  idempotencyAttemptFor,
  isExactHubNameConfirmation,
} from "~/services/lifecycleIntent";

const returnedHub = {} as HubResource;

describe("Winter Hub lifecycle", () => {
  it("passes destructive caller inputs to the Control Plane unchanged", async () => {
    const calls: Array<Record<string, unknown>> = [];
    const service = createHubLifecycleService({
      deleteHub: async (input) => { calls.push(input); },
      transferOwnership: async (input) => { calls.push(input); return returnedHub; },
      lockdownHub: async (input) => { calls.push(input); return returnedHub; },
    });

    await service.deleteHub("actor-1", {
      hubId: "hub-1",
      confirmationName: "Exact Hub Name",
      expectedVersion: 37,
      idempotencyKey: "delete-key",
    });
    await service.transferOwnership("actor-1", {
      hubId: "hub-1",
      newOwnerId: "owner-2",
      expectedVersion: 38,
      idempotencyKey: "transfer-key",
    });
    await service.lockdownHub("actor-1", {
      hubId: "hub-1",
      locked: true,
      reason: "Incident response",
      expectedVersion: 39,
      idempotencyKey: "lockdown-key",
    });

    expect(calls).toEqual([
      {
        actorId: "actor-1",
        hubId: "hub-1",
        confirmationName: "Exact Hub Name",
        expectedVersion: 37,
        idempotencyKey: "delete-key",
      },
      {
        actorId: "actor-1",
        hubId: "hub-1",
        newOwnerId: "owner-2",
        expectedVersion: 38,
        idempotencyKey: "transfer-key",
      },
      {
        actorId: "actor-1",
        hubId: "hub-1",
        locked: true,
        reason: "Incident response",
        expectedVersion: 39,
        idempotencyKey: "lockdown-key",
      },
    ]);
  });

  it("requires caller-provided lifecycle versions", () => {
    const common = { hubId: "hub-1", idempotencyKey: "retry-key" };
    expect(deleteHubSchema.safeParse({ ...common, confirmationName: "Hub" }).success).toBe(false);
    expect(transferHubOwnershipSchema.safeParse({ ...common, newOwnerId: "owner-2" }).success).toBe(false);
    expect(lockdownHubSchema.safeParse({ ...common, locked: true }).success).toBe(false);
  });

  it("requires exact, case-sensitive deletion confirmation", () => {
    expect(isExactHubNameConfirmation("Winter Hub", "Winter Hub")).toBe(true);
    expect(isExactHubNameConfirmation("winter hub", "Winter Hub")).toBe(false);
    expect(isExactHubNameConfirmation("Winter Hub ", "Winter Hub")).toBe(false);
  });

  it("keeps one retry key until success or a material input change", () => {
    let sequence = 0;
    const createKey = () => `key-${++sequence}`;
    const first = idempotencyAttemptFor(null, "hub-1:version-4:locked", createKey);
    const retry = idempotencyAttemptFor(first, "hub-1:version-4:locked", createKey);
    const changed = idempotencyAttemptFor(retry, "hub-1:version-5:unlocked", createKey);
    const afterSuccess = idempotencyAttemptFor(null, "hub-1:version-5:unlocked", createKey);

    expect(retry.key).toBe("key-1");
    expect(changed.key).toBe("key-2");
    expect(afterSuccess.key).toBe("key-3");
  });

  it("classifies lifecycle recovery states distinctly", () => {
    expect(classifyLifecycleError({ code: "ABORTED" })).toBe("STALE");
    expect(classifyLifecycleError({ cause: { code: "PERMISSION_DENIED" } })).toBe("DENIED");
    expect(classifyLifecycleError({ code: "DEADLINE_EXCEEDED" })).toBe("UNAVAILABLE");
    expect(classifyLifecycleError({ code: "NOT_FOUND" })).toBe("NOT_FOUND");
  });
});
