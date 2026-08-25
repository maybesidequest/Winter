import type { HubConnectionResource } from "~/resources/connection";
import { controlConnectionService } from "~/services/control.server";

export const connectionService = {
  async getHubConnections(hubId: string, userId: string): Promise<HubConnectionResource[]> {
    const connections = await controlConnectionService.getConnections({
      hubId,
      actorId: userId,
    });

    return connections.map((conn) => ({
      metadata: {
        id: conn.metadata.id,
        name: `Connection-${conn.metadata.id}`,
        createdAt: conn.metadata.createdAt || new Date().toISOString(),
        updatedAt: conn.metadata.updatedAt || new Date().toISOString(),
      },
      spec: {
        channelId: conn.metadata.channelId || "",
        serverId: conn.metadata.serverId || "",
        connected: conn.spec.connected,
        pausedByBot: !conn.status.healthy,
      },
      status: {
        serverName: conn.spec.customName || `Server ${conn.metadata.serverId}`,
        channelName: `#${conn.metadata.channelId}`,
        lastActive: conn.status.lastRelayedAt || conn.metadata.updatedAt || conn.metadata.createdAt || new Date().toISOString(),
      },
    }));
  },


  async toggleConnection(userId: string, connectionId: string, hubId: string, enabled: boolean, idempotencyKey?: string): Promise<{ success: boolean; error?: string }> {
    try {
      await controlConnectionService.toggleConnection({
        connectionId,
        enabled,
        expectedVersion: 1,
        actorId: userId,
        idempotencyKey: idempotencyKey || crypto.randomUUID(),
      });
      return { success: true };
    } catch (error: unknown) {
      console.error("Failed to toggle connection via control plane", error);
      const msg = error instanceof Error ? error.message : "Failed to toggle connection.";
      return { success: false, error: msg };
    }
  },

  async disconnectConnection(userId: string, connectionId: string, hubId: string, idempotencyKey?: string): Promise<{ success: boolean; error?: string }> {
    try {
      await controlConnectionService.disconnectChannel({
        connectionId,
        actorId: userId,
        idempotencyKey: idempotencyKey || crypto.randomUUID(),
      });
      return { success: true };
    } catch (error: unknown) {
      console.error("Failed to disconnect connection via control plane", error);
      const msg = error instanceof Error ? error.message : "Failed to disconnect connection.";
      return { success: false, error: msg };
    }
  },

  async createConnection(
    userId: string,
    hubId: string,
    channelId: string,
    serverId: string,
    inviteCode?: string,
    customName?: string,
    idempotencyKey?: string
  ): Promise<{ success: boolean; hubId?: string; error?: string }> {
    try {
      await controlConnectionService.connectChannel({
        actorId: userId,
        hubId,
        channelId,
        serverId,
        inviteCode,
        customName,
        idempotencyKey: idempotencyKey || crypto.randomUUID(),
      });
      return { success: true, hubId };
    } catch (error: unknown) {
      console.error("Failed to create connection via control plane", error);
      const msg = error instanceof Error ? error.message : "Failed to create connection.";
      return { success: false, error: msg };
    }
  },
};
