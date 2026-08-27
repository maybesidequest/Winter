import type { ServerResource } from "~/resources/server";
import type { Server__Output } from "~/generated/control/v1/interchat/control/v1/Server";
import type { BatchGetServersResponse__Output } from "~/generated/control/v1/interchat/control/v1/BatchGetServersResponse";
import type { ServerBlock__Output } from "~/generated/control/v1/interchat/control/v1/ServerBlock";
import type { BlocklistResponse__Output } from "~/generated/control/v1/interchat/control/v1/BlocklistResponse";
import type { GetServerRequest } from "~/generated/control/v1/interchat/control/v1/GetServerRequest";
import type { BatchGetServersRequest } from "~/generated/control/v1/interchat/control/v1/BatchGetServersRequest";
import type { PatchServerConfigRequest } from "~/generated/control/v1/interchat/control/v1/PatchServerConfigRequest";
import type { GetBlocklistRequest } from "~/generated/control/v1/interchat/control/v1/GetBlocklistRequest";
import type { AddBlockRequest } from "~/generated/control/v1/interchat/control/v1/AddBlockRequest";
import type { RemoveBlockRequest } from "~/generated/control/v1/interchat/control/v1/RemoveBlockRequest";
import type { EmptyResponse__Output } from "~/generated/control/v1/interchat/control/v1/EmptyResponse";
import { getServiceClients, invokeUnary, makeRequestContext } from "./transport";

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

function timestamp(value: { seconds?: number; nanos?: number } | null | undefined): string | undefined {
  if (!value) return undefined;
  return new Date((value.seconds || 0) * 1000 + (value.nanos || 0) / 1_000_000).toISOString();
}

function toServer(value: Server__Output): ServerResource {
  if (!value.metadata || !value.spec || !value.status) throw new Error("Control Plane returned an incomplete Server resource.");
  return {
    metadata: { id: value.metadata.id, name: value.metadata.name, iconUrl: value.metadata.iconUrl || null },
    spec: {
      prefix: value.spec.prefix || null,
      hideServerName: false,
      pingOnMatch: value.spec.callPing,
      autoRequeueOnSkip: value.spec.callRequeue,
      autoRequeueOnHangup: false,
      filterNsfw: value.spec.callNsfwFilter,
      lobbyChannelIds: value.spec.callChannelId ? [value.spec.callChannelId] : [],
    },
    status: {
      botInstalled: value.status.botInstalled,
      manageable: value.status.botInstalled,
      botPermissions: Number(value.status.botPermissions || 0),
      connectionCount: Number(value.status.connectionCount || 0),
    },
    version: value.version,
  };
}

function toBlock(value: ServerBlock__Output): ServerBlock {
  return {
    id: value.id,
    serverId: value.serverId,
    targetId: value.targetId,
    targetType: value.targetType as ServerBlock["targetType"],
    reason: value.reason,
    authorId: value.authorId,
    createdAt: timestamp(value.createdAt),
  };
}

export const serverService = {
  async getServer(serverId: string, actorId: string): Promise<ServerResource> {
    const clients = getServiceClients();
    const response = await invokeUnary<GetServerRequest, Server__Output>(clients.serverClient.GetServer.bind(clients.serverClient), {
      context: makeRequestContext(actorId),
      serverId,
    });
    return toServer(response);
  },

  async batchGetServers(
    serverIds: string[],
    actorId: string
  ): Promise<{ servers: ServerResource[]; missingServerIds: string[] }> {
    const clients = getServiceClients();
    const res = await invokeUnary<BatchGetServersRequest, BatchGetServersResponse__Output>(
      clients.serverClient.BatchGetServers.bind(clients.serverClient),
      {
        context: makeRequestContext(actorId),
        serverIds,
      }
    );
    return {
      servers: res.servers.map(toServer),
      missingServerIds: res.missingServerIds,
    };
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
    const response = await invokeUnary<PatchServerConfigRequest, Server__Output>(clients.serverClient.PatchServerConfig.bind(clients.serverClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      serverId: input.serverId,
      spec: input.spec,
      updateMask: { paths: input.updateMask },
      expectedVersion: input.expectedVersion,
    });
    return toServer(response);
  },

  async getBlocklist(serverId: string, actorId: string): Promise<ServerBlock[]> {
    const clients = getServiceClients();
    const res = await invokeUnary<GetBlocklistRequest, BlocklistResponse__Output>(
      clients.serverClient.GetBlocklist.bind(clients.serverClient),
      {
        context: makeRequestContext(actorId),
        serverId,
      }
    );
    return res.blocks.map(toBlock);
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
    const response = await invokeUnary<AddBlockRequest, ServerBlock__Output>(clients.serverClient.AddBlock.bind(clients.serverClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      serverId: input.serverId,
      targetId: input.targetId,
      targetType: input.targetType,
      reason: input.reason,
    });
    return toBlock(response);
  },

  async removeBlock(input: {
    serverId: string;
    blockId: string;
    actorId: string;
    idempotencyKey: string;
  }): Promise<void> {
    const clients = getServiceClients();
    await invokeUnary<RemoveBlockRequest, EmptyResponse__Output>(clients.serverClient.RemoveBlock.bind(clients.serverClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      serverId: input.serverId,
      blockId: input.blockId,
    });
  },
};
