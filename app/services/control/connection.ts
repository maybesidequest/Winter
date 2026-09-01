import type { Connection as ProtoConnection } from "~/generated/control/v1/static";
import type { ConnectionsResponse } from "~/generated/control/v1/static";
import type { GetConnectionsRequest } from "~/generated/control/v1/static";
import type { ConnectChannelRequest } from "~/generated/control/v1/static";
import type { DisconnectChannelRequest } from "~/generated/control/v1/static";
import type { ToggleConnectionRequest } from "~/generated/control/v1/static";
import type { RepairConnectionWebhooksRequest } from "~/generated/control/v1/static";
import type { EmptyResponse } from "~/generated/control/v1/static";
import { getServiceClients, invokeUnary, makeRequestContext } from "./transport";

export interface ConnectionResource {
  metadata: { id: string; serverId: string; channelId: string; hubId: string; createdAt?: string; updatedAt?: string };
  spec: { connected: boolean; customName?: string };
  status: { healthy: boolean; statusMessage: string; lastRelayedAt?: string; webhookProvisioned: boolean };
  version: number;
}

function timestamp(value: { seconds?: number; nanos?: number } | null | undefined): string | undefined {
  if (!value) return undefined;
  return new Date((value.seconds || 0) * 1000 + (value.nanos || 0) / 1_000_000).toISOString();
}

function toResource(connection: ProtoConnection): ConnectionResource {
  if (!connection.metadata || !connection.spec || !connection.status) {
    throw new Error("Control Plane returned an incomplete Connection resource.");
  }
  return {
    metadata: {
      id: connection.metadata.id,
      serverId: connection.metadata.serverId,
      channelId: connection.metadata.channelId,
      hubId: connection.metadata.hubId,
      createdAt: timestamp(connection.metadata.createdAt),
      updatedAt: timestamp(connection.metadata.updatedAt),
    },
    spec: { connected: connection.spec.connected, customName: connection.spec.customName },
    status: {
      healthy: connection.status.healthy,
      statusMessage: connection.status.statusMessage,
      lastRelayedAt: timestamp(connection.status.lastRelayedAt),
      webhookProvisioned: connection.status.webhookProvisioned,
    },
    version: connection.version,
  };
}

export const connectionService = {
  async getConnections(params: {
    hubId?: string;
    serverId?: string;
    actorId: string;
  }): Promise<ConnectionResource[]> {
    const clients = getServiceClients();
    const res = await invokeUnary<GetConnectionsRequest, ConnectionsResponse>(
      clients.connectionClient.getConnections.bind(clients.connectionClient),
      {
        context: makeRequestContext(params.actorId),
        hubId: params.hubId,
        serverId: params.serverId,
      }
    );
    return (res as ConnectionsResponse).connections.map(toResource);
  },

  async connectChannel(input: {
    serverId: string;
    channelId: string;
    hubId: string;
    inviteCode?: string;
    customName?: string;
    actorId: string;
    idempotencyKey: string;
  }): Promise<ConnectionResource> {
    const clients = getServiceClients();
    const response = await invokeUnary<ConnectChannelRequest, ProtoConnection>(
      clients.connectionClient.connectChannel.bind(clients.connectionClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      serverId: input.serverId,
      channelId: input.channelId,
      hubId: input.hubId,
      inviteCode: input.inviteCode ?? "",
      customName: input.customName ?? "",
      operationId: input.idempotencyKey,
      });
    return toResource(response);
  },

  async disconnectChannel(input: {
    connectionId: string;
    expectedVersion: number;
    actorId: string;
    idempotencyKey: string;
  }): Promise<void> {
    const clients = getServiceClients();
    await invokeUnary<DisconnectChannelRequest, EmptyResponse>(clients.connectionClient.disconnectChannel.bind(clients.connectionClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      connectionId: input.connectionId,
      expectedVersion: input.expectedVersion,
      operationId: input.idempotencyKey,
    });
  },

  async toggleConnection(input: {
    connectionId: string;
    enabled: boolean;
    expectedVersion: number;
    actorId: string;
    idempotencyKey: string;
  }): Promise<ConnectionResource> {
    const clients = getServiceClients();
    const response = await invokeUnary<ToggleConnectionRequest, ProtoConnection>(
      clients.connectionClient.toggleConnection.bind(clients.connectionClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      connectionId: input.connectionId,
      enabled: input.enabled,
      expectedVersion: input.expectedVersion,
      operationId: input.idempotencyKey,
      });
    return toResource(response);
  },

  async repairConnectionWebhooks(input: {
    connectionId: string;
    expectedVersion: number;
    actorId: string;
    idempotencyKey: string;
  }): Promise<ConnectionResource> {
    const clients = getServiceClients();
    const response = await invokeUnary<RepairConnectionWebhooksRequest, ProtoConnection>(
      clients.connectionClient.repairConnectionWebhooks.bind(clients.connectionClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      connectionId: input.connectionId,
      expectedVersion: input.expectedVersion,
      operationId: input.idempotencyKey,
      });
    return toResource(response);
  },
};
