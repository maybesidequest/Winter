import type { ServerResource } from "~/resources/server";
import { getServiceClients, invokeRpc, makeRequestContext } from "./transport";

export interface ServerSpec {
  prefix?: string;
  callChannelId?: string;
  callDisplayName?: string;
  callPing?: boolean;
  callRequeue?: boolean;
  callNsfwFilter?: boolean;
  settings?: number;
}

export interface ServerBlock {
  id: string;
  serverId: string;
  targetId: string;
  targetType: "BLOCK_TARGET_TYPE_USER" | "BLOCK_TARGET_TYPE_SERVER";
  reason: string;
  authorId: string;
  createdAt?: string;
}

export const serverService = {
  async getServer(serverId: string, actorId: string): Promise<ServerResource> {
    const clients = getServiceClients();
    return invokeRpc(clients.serverClient, "GetServer", {
      context: makeRequestContext(actorId),
      serverId,
    });
  },

  async patchServer(input: {
    serverId: string;
    spec: Partial<ServerSpec>;
    updateMask: string[];
    expectedVersion: number;
    actorId: string;
    idempotencyKey: string;
  }): Promise<ServerResource> {
    const clients = getServiceClients();
    return invokeRpc(clients.serverClient, "PatchServerConfig", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      serverId: input.serverId,
      spec: input.spec,
      updateMask: { paths: input.updateMask },
      expectedVersion: input.expectedVersion,
    });
  },

  async getBlocklist(serverId: string, actorId: string): Promise<ServerBlock[]> {
    const clients = getServiceClients();
    const res = await invokeRpc<{ blocks?: ServerBlock[] }>(
      clients.serverClient,
      "GetBlocklist",
      {
        context: makeRequestContext(actorId),
        serverId,
      }
    );
    return res.blocks || [];
  },

  async addBlock(input: {
    serverId: string;
    targetId: string;
    targetType: "BLOCK_TARGET_TYPE_USER" | "BLOCK_TARGET_TYPE_SERVER";
    reason: string;
    actorId: string;
    idempotencyKey: string;
  }): Promise<ServerBlock> {
    const clients = getServiceClients();
    return invokeRpc(clients.serverClient, "AddBlock", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      serverId: input.serverId,
      targetId: input.targetId,
      targetType: input.targetType,
      reason: input.reason,
    });
  },

  async removeBlock(input: {
    serverId: string;
    blockId: string;
    actorId: string;
    idempotencyKey: string;
  }): Promise<void> {
    const clients = getServiceClients();
    await invokeRpc(clients.serverClient, "RemoveBlock", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      serverId: input.serverId,
      blockId: input.blockId,
    });
  },
};
