import type { Connection__Output } from "~/generated/control/v1/interchat/control/v1/Connection";
import type { ConnectionsResponse__Output } from "~/generated/control/v1/interchat/control/v1/ConnectionsResponse";
import type { GetConnectionsRequest } from "~/generated/control/v1/interchat/control/v1/GetConnectionsRequest";
import type { ConnectChannelRequest } from "~/generated/control/v1/interchat/control/v1/ConnectChannelRequest";
import type { DisconnectChannelRequest } from "~/generated/control/v1/interchat/control/v1/DisconnectChannelRequest";
import type { ToggleConnectionRequest } from "~/generated/control/v1/interchat/control/v1/ToggleConnectionRequest";
import type { RepairConnectionWebhooksRequest } from "~/generated/control/v1/interchat/control/v1/RepairConnectionWebhooksRequest";
import type { EmptyResponse__Output } from "~/generated/control/v1/interchat/control/v1/EmptyResponse";
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

function toResource(connection: Connection__Output): ConnectionResource {
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
    const res = await invokeUnary<GetConnectionsRequest, ConnectionsResponse__Output>(
      clients.connectionClient.GetConnections.bind(clients.connectionClient),
      {
        context: makeRequestContext(params.actorId),
        hubId: params.hubId,
        serverId: params.serverId,
      }
    );
    return (res as ConnectionsResponse__Output).connections.map(toResource);
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
    const response = await invokeUnary<ConnectChannelRequest, Connection__Output>(
      clients.connectionClient.ConnectChannel.bind(clients.connectionClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      serverId: input.serverId,
      channelId: input.channelId,
      hubId: input.hubId,
      inviteCode: input.inviteCode,
      customName: input.customName,
      });
    return toResource(response);
  },

  async disconnectChannel(input: {
    connectionId: string;
    actorId: string;
    idempotencyKey: string;
  }): Promise<void> {
    const clients = getServiceClients();
    await invokeUnary<DisconnectChannelRequest, EmptyResponse__Output>(clients.connectionClient.DisconnectChannel.bind(clients.connectionClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      connectionId: input.connectionId,
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
    const response = await invokeUnary<ToggleConnectionRequest, Connection__Output>(
      clients.connectionClient.ToggleConnection.bind(clients.connectionClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      connectionId: input.connectionId,
      enabled: input.enabled,
      expectedVersion: input.expectedVersion,
      });
    return toResource(response);
  },

  async repairConnectionWebhooks(input: {
    connectionId: string;
    actorId: string;
    idempotencyKey: string;
  }): Promise<ConnectionResource> {
    const clients = getServiceClients();
    const response = await invokeUnary<RepairConnectionWebhooksRequest, Connection__Output>(
      clients.connectionClient.RepairConnectionWebhooks.bind(clients.connectionClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      connectionId: input.connectionId,
      });
    return toResource(response);
  },
};
