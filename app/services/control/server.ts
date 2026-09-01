import type { ServerResource } from "~/resources/server";
import type { Server as ProtoServer } from "~/generated/control/v1/static";
import type { BatchGetServersResponse } from "~/generated/control/v1/static";
import type { ServerBlock as ProtoServerBlock } from "~/generated/control/v1/static";
import type { BlocklistResponse } from "~/generated/control/v1/static";
import type { ConnectableChannel } from "~/generated/control/v1/static";
import type { GetServerRequest } from "~/generated/control/v1/static";
import type { BatchGetServersRequest } from "~/generated/control/v1/static";
import type { ListConnectableChannelsRequest } from "~/generated/control/v1/static";
import type { ListConnectableChannelsResponse } from "~/generated/control/v1/static";
import type { PatchServerConfigRequest } from "~/generated/control/v1/static";
import type { GetBlocklistRequest } from "~/generated/control/v1/static";
import type { AddBlockRequest } from "~/generated/control/v1/static";
import type { RemoveBlockRequest } from "~/generated/control/v1/static";
import type { EmptyResponse } from "~/generated/control/v1/static";
import { BlockTargetType } from "~/generated/control/v1/static";
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

function toProtoSpec(spec: Partial<ServerSpec>) {
  return {
    prefix: spec.prefix ?? "",
    callChannelId: spec.callChannelId ?? "",
    callDisplayName: spec.callDisplayName ?? "",
    callPing: spec.callPing ?? false,
    callRequeue: spec.callRequeue ?? false,
    callNsfwFilter: spec.callNsfwFilter ?? false,
    settings: spec.settings ?? 0,
  };
}

function timestamp(value: { seconds?: number; nanos?: number } | null | undefined): string | undefined {
  if (!value) return undefined;
  return new Date((value.seconds || 0) * 1000 + (value.nanos || 0) / 1_000_000).toISOString();
}

function toServer(value: ProtoServer): ServerResource {
  if (!value.metadata || !value.spec || !value.status) throw new Error("Control Plane returned an incomplete Server resource.");
  return {
    metadata: {
      id: value.metadata.id,
      name: value.metadata.name,
      iconUrl: value.metadata.iconUrl || null,
      ownerId: value.metadata.ownerId,
    },
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
      manageable: true,
      botPermissions: Number(value.status.botPermissions || 0),
      connectionCount: Number(value.status.connectionCount || 0),
      activeCall: value.status.activeCall,
    },
    version: value.version,
  };
}

function toBlock(value: ProtoServerBlock): ServerBlock {
  const targetType = value.targetType === BlockTargetType.BLOCK_TARGET_TYPE_USER
      ? "BLOCK_TARGET_TYPE_USER"
    : value.targetType === BlockTargetType.BLOCK_TARGET_TYPE_SERVER
      ? "BLOCK_TARGET_TYPE_SERVER"
      : (() => { throw new Error("Control Plane returned an unknown block target type."); })();
  return {
    id: value.id,
    serverId: value.serverId,
    targetId: value.targetId,
    targetType,
    reason: value.reason,
    authorId: value.authorId,
    createdAt: timestamp(value.createdAt),
  };
}

export const serverService = {
  async getServer(serverId: string, actorId: string): Promise<ServerResource> {
    const clients = getServiceClients();
    const response = await invokeUnary<GetServerRequest, ProtoServer>(clients.serverClient.getServer.bind(clients.serverClient), {
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
    const res = await invokeUnary<BatchGetServersRequest, BatchGetServersResponse>(
      clients.serverClient.batchGetServers.bind(clients.serverClient),
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

  async listConnectableChannels(serverId: string, actorId: string): Promise<ConnectableChannel[]> {
    const clients = getServiceClients();
    const response = await invokeUnary<ListConnectableChannelsRequest, ListConnectableChannelsResponse>(
      clients.serverClient.listConnectableChannels.bind(clients.serverClient),
      {
        context: makeRequestContext(actorId),
        serverId,
      },
    );
    return response.channels;
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
    const response = await invokeUnary<PatchServerConfigRequest, ProtoServer>(clients.serverClient.patchServerConfig.bind(clients.serverClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      serverId: input.serverId,
      spec: toProtoSpec(input.spec),
      updateMask: input.updateMask,
      expectedVersion: input.expectedVersion,
      operationId: input.idempotencyKey,
    });
    return toServer(response);
  },

  async getBlocklist(serverId: string, actorId: string): Promise<ServerBlock[]> {
    const clients = getServiceClients();
    const res = await invokeUnary<GetBlocklistRequest, BlocklistResponse>(
      clients.serverClient.getBlocklist.bind(clients.serverClient),
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
    const response = await invokeUnary<AddBlockRequest, ProtoServerBlock>(clients.serverClient.addBlock.bind(clients.serverClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      serverId: input.serverId,
      targetId: input.targetId,
      targetType: input.targetType as BlockTargetType,
      reason: input.reason,
      operationId: input.idempotencyKey,
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
    await invokeUnary<RemoveBlockRequest, EmptyResponse>(clients.serverClient.removeBlock.bind(clients.serverClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      serverId: input.serverId,
      blockId: input.blockId,
      operationId: input.idempotencyKey,
    });
  },
};
