import { describe, expect, it } from "bun:test";
import { invokeUnary, type UnaryMethod } from "~/services/control/transport";

describe("Winter Server Control Service", () => {
  it("serializes PatchServerConfigRequest correctly at wire boundary", async () => {
    let wireRequest: Record<string, unknown> | undefined;
    const method: UnaryMethod<Record<string, unknown>, Record<string, unknown>> = async (request) => {
      wireRequest = request;
      return {
        server: {
          metadata: { id: "guild-123", name: "Test Guild", iconUrl: "https://icon.png" },
          spec: {
            prefix: "!",
            callPing: true,
            callRequeue: false,
            callNsfwFilter: true,
            callChannelId: "channel-1",
          },
          status: {
            botInstalled: true,
            botPermissions: 8,
          },
          version: 2,
        },
      };
    };

    const response = await invokeUnary(method, {
      context: {
        requestId: "req-1",
        actorId: "user-1",
        actorType: "ACTOR_TYPE_HUMAN",
        servicePrincipal: "winter",
        traceId: "trace-1",
        source: "WINTER",
      },
      serverId: "guild-123",
      spec: {
        prefix: "!",
        callPing: true,
        callRequeue: false,
        callNsfwFilter: true,
        callChannelId: "channel-1",
      },
      expectedVersion: 1,
    });

    expect(wireRequest).toBeDefined();
    expect(wireRequest?.serverId).toBe("guild-123");
    expect(wireRequest?.expectedVersion).toBe(1);
    expect(wireRequest?.spec).toMatchObject({
      prefix: "!",
      callPing: true,
      callRequeue: false,
      callNsfwFilter: true,
      callChannelId: "channel-1",
    });

    expect(response).toMatchObject({
      server: {
        metadata: { id: "guild-123", name: "Test Guild" },
        spec: { prefix: "!", callPing: true, callChannelId: "channel-1" },
        status: { botInstalled: true, botPermissions: 8 },
        version: 2,
      },
    });
  });

  it("serializes AddBlockRequest and RemoveBlockRequest with target types", async () => {
    let addWireReq: Record<string, unknown> | undefined;
    const addMethod: UnaryMethod<Record<string, unknown>, Record<string, unknown>> = async (request) => {
      addWireReq = request;
      return {
        block: {
          id: "block-1",
          serverId: "guild-123",
          targetId: "target-user-1",
          targetType: "BLOCK_TARGET_TYPE_USER",
          reason: "Spam",
        },
      };
    };

    const addRes = await invokeUnary(addMethod, {
      context: {
        requestId: "req-2",
        actorId: "admin-1",
        actorType: "ACTOR_TYPE_HUMAN",
        servicePrincipal: "winter",
        traceId: "trace-2",
        source: "WINTER",
      },
      serverId: "guild-123",
      targetId: "target-user-1",
      targetType: "BLOCK_TARGET_TYPE_USER",
      reason: "Spam",
    });

    expect(addWireReq?.serverId).toBe("guild-123");
    expect(addWireReq?.targetId).toBe("target-user-1");
    expect(addWireReq?.targetType).toBe("BLOCK_TARGET_TYPE_USER");
    expect(addRes).toMatchObject({
      block: {
        id: "block-1",
        serverId: "guild-123",
        targetId: "target-user-1",
      },
    });
  });
});
