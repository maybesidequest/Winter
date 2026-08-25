import { db } from "~/db.server";
import { connection, serverData } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import type { HubConnectionResource } from "~/resources/connection";
import { discordService } from "~/services/discord.server";
import { permissionService } from "~/services/permission.server";
import { controlConnectionService } from "~/services/control.server";

export const connectionService = {
  async getHubConnections(hubId: string, userId: string): Promise<HubConnectionResource[]> {
    await permissionService.assertCanPerform(userId, hubId, "MANAGE_CONNECTIONS");
    const results = await db
      .select({
        connection,
        serverName: serverData.name,
      })
      .from(connection)
      .leftJoin(serverData, eq(connection.serverId, serverData.id))
      .where(eq(connection.hubId, hubId));

    const connectionsWithChannels = await Promise.all(
      results.map(async ({ connection: conn, serverName }) => {
        let channelName = null;
        if (conn.channelId) {
          channelName = await discordService.getChannelName(conn.channelId);
        }

        return {
          metadata: {
            id: conn.id,
            name: serverName || `Connection-${conn.id}`,
            createdAt: conn.createdAt,
            updatedAt: conn.lastActive || conn.createdAt,
          },
          spec: {
            channelId: conn.channelId || "",
            serverId: conn.serverId,
            connected: conn.connected,
            pausedByBot: conn.pausedByBot,
          },
          status: {
            serverName: serverName || "Unknown Server",
            channelName: channelName || `#${conn.channelId}`,
            lastActive: conn.lastActive || conn.createdAt,
          },
        };
      })
    );

    return connectionsWithChannels;
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
