import { getServiceClients, invokeRpc, makeRequestContext } from "./transport";

export interface ConnectionResource {
  metadata: { id: string; serverId: string; channelId: string; hubId: string; createdAt?: string; updatedAt?: string };
  spec: { connected: boolean; customName?: string };
  status: { healthy: boolean; statusMessage: string; lastRelayedAt?: string; webhookProvisioned: boolean };
  version: number;
}

export const connectionService = {
  async getConnections(params: {
    hubId?: string;
    serverId?: string;
    actorId: string;
  }): Promise<ConnectionResource[]> {
    const clients = getServiceClients();
    const res = await invokeRpc<{ connections?: ConnectionResource[] }>(
      clients.connectionClient,
      "GetConnections",
      {
        context: makeRequestContext(params.actorId),
        hubId: params.hubId,
        serverId: params.serverId,
      }
    );
    return res.connections || [];
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
    return invokeRpc(clients.connectionClient, "ConnectChannel", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      serverId: input.serverId,
      channelId: input.channelId,
      hubId: input.hubId,
      inviteCode: input.inviteCode,
      customName: input.customName,
    });
  },

  async disconnectChannel(input: {
    connectionId: string;
    actorId: string;
    idempotencyKey: string;
  }): Promise<void> {
    const clients = getServiceClients();
    await invokeRpc(clients.connectionClient, "DisconnectChannel", {
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
    return invokeRpc(clients.connectionClient, "ToggleConnection", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      connectionId: input.connectionId,
      enabled: input.enabled,
      expectedVersion: input.expectedVersion,
    });
  },

  async repairConnectionWebhooks(input: {
    connectionId: string;
    actorId: string;
    idempotencyKey: string;
  }): Promise<ConnectionResource> {
    const clients = getServiceClients();
    return invokeRpc(clients.connectionClient, "RepairConnectionWebhooks", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      connectionId: input.connectionId,
    });
  },
};
