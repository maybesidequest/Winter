import type { HubConnectionResource } from "~/resources/connection";
import { controlConnectionService } from "~/services/control.server";
import { classifyConnectionControlError, connectionControlErrorMessage } from "~/services/connectionError";

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
      version: conn.version,
    }));
  },


  async toggleConnection(userId: string, connectionId: string, hubId: string, enabled: boolean, expectedVersion: number, idempotencyKey: string): Promise<{ success: boolean; error?: string; errorCode?: ReturnType<typeof classifyConnectionControlError> }> {
    try {
      const current = (await controlConnectionService.getConnections({ hubId, actorId: userId }))
        .find((connection) => connection.metadata.id === connectionId);
      if (!current) return { success: false, error: "Connection not found." };
      await controlConnectionService.toggleConnection({
        connectionId,
        enabled,
        expectedVersion,
        actorId: userId,
        idempotencyKey,
      });
      return { success: true };
    } catch (error: unknown) {
      console.error("Failed to toggle connection via control plane", error);
      return { success: false, error: connectionControlErrorMessage(error, "This connection could not be updated."), errorCode: classifyConnectionControlError(error) };
    }
  },

  async disconnectConnection(userId: string, connectionId: string, hubId: string, expectedVersion: number, idempotencyKey: string): Promise<{ success: boolean; error?: string; errorCode?: ReturnType<typeof classifyConnectionControlError> }> {
    try {
      const current = (await controlConnectionService.getConnections({ hubId, actorId: userId }))
        .find((connection) => connection.metadata.id === connectionId);
      if (!current) return { success: false, error: "Connection not found.", errorCode: "NOT_FOUND" };
      await controlConnectionService.disconnectChannel({
        connectionId,
        expectedVersion,
        actorId: userId,
        idempotencyKey,
      });
      return { success: true };
    } catch (error: unknown) {
      console.error("Failed to disconnect connection via control plane", error);
      return { success: false, error: connectionControlErrorMessage(error, "This connection could not be disconnected."), errorCode: classifyConnectionControlError(error) };
    }
  },

  async createConnection(
    userId: string,
    hubId: string,
    channelId: string,
    serverId: string,
    idempotencyKey: string,
    inviteCode?: string,
    customName?: string
  ): Promise<{ success: boolean; hubId?: string; error?: string; errorCode?: ReturnType<typeof classifyConnectionControlError> }> {
    try {
      await controlConnectionService.connectChannel({
        actorId: userId,
        hubId,
        channelId,
        serverId,
        inviteCode,
        customName,
        idempotencyKey,
      });
      return { success: true, hubId };
    } catch (error: unknown) {
      console.error("Failed to create connection via control plane", error);
      return { success: false, error: connectionControlErrorMessage(error, "This connection could not be created."), errorCode: classifyConnectionControlError(error) };
    }
  },
};
