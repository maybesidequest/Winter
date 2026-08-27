import type { HubConnectionResource } from "~/resources/connection";
import { controlConnectionService } from "~/services/control.server";

function safeControlError(error: unknown, fallback: string): string {
  const code = typeof error === "object" && error && "code" in error
    ? Number((error as { code: unknown }).code)
    : undefined;
  if (code === 5) return "This connection is no longer available.";
  if (code === 7 || code === 16) return "You do not have permission to manage this connection.";
  if (code === 6 || code === 9 || code === 10) return "This connection changed while you were editing it. Refresh and try again.";
  if (code === 4 || code === 14) return "Connection management is temporarily unavailable. Try again shortly.";
  return fallback;
}

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


  async toggleConnection(userId: string, connectionId: string, hubId: string, enabled: boolean, idempotencyKey: string): Promise<{ success: boolean; error?: string }> {
    try {
      const current = (await controlConnectionService.getConnections({ hubId, actorId: userId }))
        .find((connection) => connection.metadata.id === connectionId);
      if (!current) return { success: false, error: "Connection not found." };
      await controlConnectionService.toggleConnection({
        connectionId,
        enabled,
        expectedVersion: current.version,
        actorId: userId,
        idempotencyKey,
      });
      return { success: true };
    } catch (error: unknown) {
      console.error("Failed to toggle connection via control plane", error);
      return { success: false, error: safeControlError(error, "This connection could not be updated.") };
    }
  },

  async disconnectConnection(userId: string, connectionId: string, hubId: string, idempotencyKey: string): Promise<{ success: boolean; error?: string }> {
    try {
      await controlConnectionService.disconnectChannel({
        connectionId,
        actorId: userId,
        idempotencyKey,
      });
      return { success: true };
    } catch (error: unknown) {
      console.error("Failed to disconnect connection via control plane", error);
      return { success: false, error: safeControlError(error, "This connection could not be disconnected.") };
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
  ): Promise<{ success: boolean; hubId?: string; error?: string }> {
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
      return { success: false, error: safeControlError(error, "This connection could not be created.") };
    }
  },
};
