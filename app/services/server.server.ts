import { and, desc, eq, inArray } from "drizzle-orm";
import { connection, hub, serverBlocklist, serverData, user } from "../../drizzle/schema";
import { db } from "../db.server";
import { redis } from "../redis.server";
import type {
  DiscordChannelResource,
  ServerBlockResource,
  ServerBridgeResource,
  ServerResource,
} from "../resources/server";
import { getDiscordAccessToken } from "./oauthToken.server";
import type { AddBlockInput, PatchCallConfigInput, RemoveBlockInput } from "../schemas/server";

const MANAGE_GUILD = 1n << 5n;
const ADMINISTRATOR = 1n << 3n;

type DiscordGuild = { id: string; name: string; icon: string | null; owner?: boolean; permissions: string };

async function discordFetch(path: string, authorization: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Number(process.env.DISCORD_API_TIMEOUT_MS || 4000));
  try {
    return await fetch(`https://discord.com/api/v10${path}`, {
      headers: { Authorization: authorization },
      signal: controller.signal,
    });
  } catch {
    throw new Error("Discord is temporarily unavailable.");
  } finally {
    clearTimeout(timeout);
  }
}

async function manageableGuilds(userId: string, forceRefresh = false): Promise<DiscordGuild[]> {
  const cacheKey = `discord:guilds:${userId}`;
  if (!forceRefresh) {
    const cached = await redis.get(cacheKey);
    if (cached) {
      try {
        return JSON.parse(cached) as DiscordGuild[];
      } catch {
        // invalid JSON in cache, continue to fetch
      }
    }
  }

  const token = await getDiscordAccessToken(userId);
  const response = await discordFetch("/users/@me/guilds", `Bearer ${token}`);
  if (!response.ok) throw new Error("Discord servers could not be loaded.");
  const guilds = (await response.json()) as DiscordGuild[];
  const manageable = guilds.filter(
    (guild) => guild.owner || (BigInt(guild.permissions) & (MANAGE_GUILD | ADMINISTRATOR)) !== 0n
  );

  await redis.set(cacheKey, JSON.stringify(manageable), "EX", 120);
  return manageable;
}

async function assertManageable(userId: string, serverId: string, forceRefresh = false) {
  const guild = (await manageableGuilds(userId, forceRefresh)).find((item) => item.id === serverId);
  if (!guild) throw new Error("You need Manage Server permission in Discord.");
  return guild;
}

export const serverService = {
  async list(userId: string, forceRefresh = false): Promise<ServerResource[]> {
    const guilds = await manageableGuilds(userId, forceRefresh);
    if (guilds.length === 0) return [];
    const rows = await db.select().from(serverData).where(inArray(serverData.id, guilds.map((guild) => guild.id)));
    const byId = new Map(rows.map((row) => [row.id, row]));
    return guilds.map((guild) => {
      const row = byId.get(guild.id);
      return {
        metadata: {
          id: guild.id,
          name: guild.name,
          iconUrl: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=128` : null,
        },
        spec: {
          hideServerName: row?.hideServerName ?? false,
          pingOnMatch: row?.pingOnMatch ?? false,
          autoRequeueOnSkip: row?.autoRequeueOnSkip ?? false,
          autoRequeueOnHangup: row?.autoRequeueOnHangup ?? false,
          filterNsfw: row?.filterNsfw ?? true,
          lobbyChannelIds: row?.lobbyChannelIds ?? [],
        },
        status: {
          botInstalled: !!row,
          manageable: true,
          callCount: row?.callCount ?? 0,
          messageCount: row?.messageCount ?? 0,
        },
      };
    });
  },

  async get(userId: string, serverId: string): Promise<ServerResource> {
    const guild = await assertManageable(userId, serverId);
    const [row] = await db.select().from(serverData).where(eq(serverData.id, serverId)).limit(1);
    return {
      metadata: {
        id: guild.id,
        name: guild.name,
        iconUrl: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=128` : null,
      },
      spec: {
        hideServerName: row?.hideServerName ?? false,
        pingOnMatch: row?.pingOnMatch ?? false,
        autoRequeueOnSkip: row?.autoRequeueOnSkip ?? false,
        autoRequeueOnHangup: row?.autoRequeueOnHangup ?? false,
        filterNsfw: row?.filterNsfw ?? true,
        lobbyChannelIds: row?.lobbyChannelIds ?? [],
      },
      status: {
        botInstalled: !!row,
        manageable: true,
        callCount: row?.callCount ?? 0,
        messageCount: row?.messageCount ?? 0,
      },
    };
  },

  async channels(userId: string, serverId: string): Promise<DiscordChannelResource[]> {
    await assertManageable(userId, serverId);
    const botToken = process.env.DISCORD_TOKEN;
    if (!botToken) throw new Error("Discord bot credentials are unavailable.");
    const response = await discordFetch(`/guilds/${serverId}/channels`, `Bot ${botToken}`);
    if (!response.ok) return [];
    const channels = (await response.json()) as Array<{ id: string; name: string; type: number }>;
    return channels
      .filter((channel) => channel.type === 0 || channel.type === 5)
      .map((channel) => ({ ...channel, canCreateWebhook: true }));
  },

  async updateCallConfig(userId: string, input: PatchCallConfigInput) {
    const guild = await assertManageable(userId, input.serverId, true);
    const [existing] = await db.select().from(serverData).where(eq(serverData.id, input.serverId)).limit(1);
    if (!existing) throw new Error("Install InterChat in this server before changing Call settings.");

    // Validate that provided lobbyChannelIds legitimately belong to this server
    let validatedChannelIds = input.lobbyChannelIds;
    if (validatedChannelIds.length > 0) {
      const validChannels = await serverService.channels(userId, input.serverId);
      const validChannelSet = new Set(validChannels.map((c) => c.id));
      validatedChannelIds = validatedChannelIds.filter((id) => validChannelSet.has(id));
    }

    const { serverId, lobbyChannelIds, ...settings } = input;
    await db
      .update(serverData)
      .set({
        ...settings,
        lobbyChannelIds: validatedChannelIds,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(serverData.id, serverId));
    await redis.del(`server:settings:${serverId}`);
    await redis.incr(`server:settings:version:${serverId}`);
    return { success: true, serverName: guild.name };
  },

  async bridges(userId: string, serverId: string): Promise<ServerBridgeResource[]> {
    await assertManageable(userId, serverId);
    const rows = await db
      .select({
        id: connection.id,
        channelId: connection.channelId,
        hubId: connection.hubId,
        hubName: hub.name,
        hubIconUrl: hub.iconUrl,
        connected: connection.connected,
        pausedByBot: connection.pausedByBot,
        pauseReason: connection.pauseReason,
        createdAt: connection.createdAt,
      })
      .from(connection)
      .leftJoin(hub, eq(connection.hubId, hub.id))
      .where(eq(connection.serverId, serverId));

    return rows.map((r) => ({
      id: r.id,
      channelId: r.channelId,
      channelName: null,
      hubId: r.hubId,
      hubName: r.hubName || "Unnamed Hub",
      hubIconUrl: r.hubIconUrl || null,
      connected: r.connected,
      pausedByBot: r.pausedByBot,
      pauseReason: r.pauseReason,
      createdAt: r.createdAt,
    }));
  },

  async blocklist(userId: string, serverId: string): Promise<ServerBlockResource[]> {
    await assertManageable(userId, serverId);
    const rows = await db
      .select()
      .from(serverBlocklist)
      .where(eq(serverBlocklist.serverId, serverId))
      .orderBy(desc(serverBlocklist.createdAt));

    return rows.map((r) => ({
      id: r.id,
      targetType: r.blockedUserId ? "user" : "server",
      targetId: r.blockedUserId || r.blockedServerId || "",
      createdAt: r.createdAt,
    }));
  },

  async addBlock(userId: string, input: AddBlockInput) {
    await assertManageable(userId, input.serverId, true);
    const [existingServer] = await db.select().from(serverData).where(eq(serverData.id, input.serverId)).limit(1);
    if (!existingServer) throw new Error("Server not found.");

    if (input.targetType === "server" && input.targetId === input.serverId) {
      throw new Error("You cannot block your own server.");
    }
    if (input.targetType === "user" && input.targetId === userId) {
      throw new Error("You cannot block yourself.");
    }

    if (input.targetType === "user") {
      await db
        .insert(user)
        .values({ id: input.targetId, name: `User ${input.targetId}` })
        .onConflictDoNothing();
    } else {
      await db
        .insert(serverData)
        .values({ id: input.targetId, name: `Server ${input.targetId}` })
        .onConflictDoNothing();
    }

    const id = crypto.randomUUID();
    await db.insert(serverBlocklist).values({
      id,
      serverId: input.serverId,
      blockedUserId: input.targetType === "user" ? input.targetId : null,
      blockedServerId: input.targetType === "server" ? input.targetId : null,
      reason: input.reason || null,
    });

    return { success: true, id };
  },

  async removeBlock(userId: string, input: RemoveBlockInput) {
    await assertManageable(userId, input.serverId, true);
    await db
      .delete(serverBlocklist)
      .where(and(eq(serverBlocklist.id, input.blockId), eq(serverBlocklist.serverId, input.serverId)));
    return { success: true };
  },
};


