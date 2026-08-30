import { redis } from "~/redis.server";
import {
  createManageableGuildLoader,
  DiscordGuildRateLimitError,
  type DiscordGuild,
} from "~/services/discordGuilds.server";
import type {
  DiscordChannelResource,
  ServerBlockResource,
  ServerBridgeResource,
  ServerResource,
} from "~/resources/server";
import type { AddBlockInput, PatchCallConfigInput, PatchPrefixInput, RemoveBlockInput } from "~/schemas/server";
import { controlConnectionService, controlHubService, controlServerService } from "~/services/control.server";
import { getDiscordAccessToken } from "~/services/oauthToken.server";

const MANAGE_GUILD = 1n << 5n;
const ADMINISTRATOR = 1n << 3n;

function isControlNotFound(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const code = (error as { code?: unknown }).code;
  return code === 5 || code === "NOT_FOUND";
}

function isControlPermissionDenied(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const code = (error as { code?: unknown }).code;
  return code === 7 || code === "PERMISSION_DENIED";
}

function normalizeServerSpec(spec: Partial<ServerResource["spec"]> & {
  callChannelId?: string;
  callPing?: boolean;
  callRequeue?: boolean;
  callNsfwFilter?: boolean;
}): ServerResource["spec"] {
  return {
    prefix: spec.prefix ?? null,
    hideServerName: spec.hideServerName ?? false,
    pingOnMatch: spec.pingOnMatch ?? spec.callPing ?? false,
    autoRequeueOnSkip: spec.autoRequeueOnSkip ?? spec.callRequeue ?? false,
    autoRequeueOnHangup: spec.autoRequeueOnHangup ?? false,
    filterNsfw: spec.filterNsfw ?? spec.callNsfwFilter ?? true,
    lobbyChannelIds: spec.lobbyChannelIds ?? (spec.callChannelId ? [spec.callChannelId] : []),
  };
}

async function discordFetch(path: string, authorization: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Number(process.env.DISCORD_API_TIMEOUT_MS || 4000));
  try {
    return await fetch(`https://discord.com/api/v10${path}`, {
      headers: {
        Authorization: authorization,
        "User-Agent": "InterChat-Winter/1.0 (https://interchat.app)",
      },
      signal: controller.signal,
    });
  } catch {
    throw new Error("Discord is temporarily unavailable.");
  } finally {
    clearTimeout(timeout);
  }
}

const manageableGuilds = createManageableGuildLoader({
  cache: {
    async get(userId: string): Promise<DiscordGuild[] | undefined> {
      try {
        const cached = await redis.get(`discord:guilds:${userId}`);
        if (!cached) return undefined;
        const parsed: unknown = JSON.parse(cached);
        return Array.isArray(parsed) ? parsed as DiscordGuild[] : undefined;
      } catch {
        return undefined;
      }
    },
    async set(userId: string, guilds: DiscordGuild[], ttlSeconds: number): Promise<void> {
      try {
        await redis.set(`discord:guilds:${userId}`, JSON.stringify(guilds), "EX", ttlSeconds);
      } catch {
        // Authorization caching is an optimization; Redis availability must
        // never decide whether a Discord request is allowed to proceed.
      }
    },
  },
  cacheTtlSeconds: Math.max(15, Number(process.env.DISCORD_GUILD_CACHE_TTL_SECONDS || 60) || 60),
  fetchGuilds: async (userId: string): Promise<DiscordGuild[]> => {
    const token = await getDiscordAccessToken(userId);
    const response = await discordFetch("/users/@me/guilds", `Bearer ${token}`);
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Discord authorization expired. Sign in again.");
      }
      if (response.status === 429) {
        const retryAfter = Number(response.headers.get("retry-after"));
        throw new DiscordGuildRateLimitError(Number.isFinite(retryAfter) ? retryAfter : undefined);
      }
      throw new Error("Discord servers could not be loaded.");
    }
    const guilds = (await response.json()) as DiscordGuild[];
    const manageable = guilds.filter(
      (guild) => guild.owner || (BigInt(guild.permissions) & (MANAGE_GUILD | ADMINISTRATOR)) !== 0n
    );

    return manageable;
  },
});

async function assertManageable(userId: string, serverId: string, forceRefresh = false) {
  const guild = (await manageableGuilds(userId, forceRefresh)).find((item) => item.id === serverId);
  if (!guild) throw new Error("You need Manage Server permission in Discord.");
  return guild;
}

export const serverService = {
  async list(userId: string, forceRefresh = false): Promise<ServerResource[]> {
    const guilds = await manageableGuilds(userId, forceRefresh);
    if (guilds.length === 0) return [];

    const guildIds = guilds.map((g) => g.id);
    const installedServersMap = new Map<string, ServerResource>();

    try {
      const batchRes = await controlServerService.batchGetServers(guildIds, userId);
      for (const s of batchRes.servers) {
        installedServersMap.set(s.metadata.id, s);
      }
    } catch (err) {
      console.warn(`[serverService.list] Failed to batch get servers for user ${userId}:`, err);
      throw new Error("Server configuration is temporarily unavailable. Please try again shortly.", { cause: err });
    }

    const result: ServerResource[] = guilds.map((guild) => {
      const server = installedServersMap.get(guild.id);
      if (server) {
        return {
          metadata: {
            id: guild.id,
            name: guild.name,
            iconUrl: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=128` : null,
          },
          spec: normalizeServerSpec(server.spec),
          status: {
            ...server.status,
            botInstalled: server.status.botInstalled,
            manageable: true,
          },
          version: server.version,
        };
      }

      return {
        metadata: {
          id: guild.id,
          name: guild.name,
          iconUrl: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=128` : null,
        },
        spec: {
          prefix: null,
          hideServerName: false,
          pingOnMatch: false,
          autoRequeueOnSkip: false,
          autoRequeueOnHangup: false,
          filterNsfw: true,
          lobbyChannelIds: [],
        },
        status: {
          botInstalled: false,
          manageable: true,
        },
      };
    });

    return result;
  },


  async get(userId: string, serverId: string): Promise<ServerResource> {
    const guild = await assertManageable(userId, serverId, false);
    try {
      const res = await controlServerService.getServer(serverId, userId);
      const server: ServerResource = {
        metadata: {
          id: guild.id,
          name: guild.name,
          iconUrl: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=128` : null,
        },
        spec: normalizeServerSpec(res.spec),
        status: {
          ...res.status,
          manageable: true,
        },
        version: res.version,
      };
      return server;
    } catch (error) {
      if (!isControlNotFound(error)) {
        console.warn(`[serverService.get] Control Plane failed for server ${serverId}:`, error);
        throw new Error("Server configuration is temporarily unavailable. Please try again shortly.", { cause: error });
      }
      return {
        metadata: {
          id: guild.id,
          name: guild.name,
          iconUrl: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=128` : null,
        },
        spec: {
          prefix: null,
          hideServerName: false,
          pingOnMatch: false,
          autoRequeueOnSkip: false,
          autoRequeueOnHangup: false,
          filterNsfw: true,
          lobbyChannelIds: [],
        },
        status: {
          botInstalled: false,
          manageable: true,
        },
      };
    }
  },

  async channels(userId: string, serverId: string): Promise<DiscordChannelResource[]> {
    await assertManageable(userId, serverId, false);
    const channels = await controlServerService.listConnectableChannels(serverId, userId);
    const result = channels.map((channel) => ({
      id: channel.channelId,
      name: channel.name,
      type: channel.type,
      actorPermissions: Number(channel.actorPermissions || 0),
      botPermissions: Number(channel.botPermissions || 0),
      connectable: channel.connectable,
      rejectionReason: channel.rejectionReason || null,
    }));

    return result;
  },

  async updateCallConfig(userId: string, input: PatchCallConfigInput) {
    const guild = await assertManageable(userId, input.serverId, true);
    const current = await controlServerService.getServer(input.serverId, userId);
    const updateMask: string[] = ["call_ping", "call_requeue", "call_nsfw_filter"];
    const callChannelId = input.lobbyChannelIds[0] || "";
    updateMask.push("call_channel_id");
    const updated = await controlServerService.patchServer({
      serverId: input.serverId,
      spec: {
        callChannelId,
        callPing: input.pingOnMatch,
        callRequeue: input.autoRequeueOnSkip,
        callNsfwFilter: input.filterNsfw,
      },
      updateMask,
      expectedVersion: input.expectedVersion || current.version || 1,
      actorId: userId,
      idempotencyKey: input.idempotencyKey,
    });
    await Promise.all([
      redis.del(`winter:server:${userId}:${input.serverId}`),
      redis.del(`winter:servers:${userId}`),
      redis.incr(`server:settings:version:${input.serverId}`),
      redis.del(`server:settings:${input.serverId}`),
    ]).catch(() => { });
    return { success: true, serverName: guild.name, server: updated };
  },

  async updatePrefix(userId: string, input: PatchPrefixInput) {
    const guild = await assertManageable(userId, input.serverId, true);
    const updated = await controlServerService.patchServer({
      serverId: input.serverId,
      spec: { prefix: input.prefix },
      updateMask: ["prefix"],
      expectedVersion: input.expectedVersion,
      actorId: userId,
      idempotencyKey: input.idempotencyKey,
    });
    const prefixVal = input.prefix ? JSON.stringify(input.prefix) : "false";
    await Promise.all([
      redis.del(`winter:server:${userId}:${input.serverId}`),
      redis.del(`winter:servers:${userId}`),
      redis.set(`server:prefix:${input.serverId}`, prefixVal, "EX", 3600),
      redis.incr(`server:prefix:version:${input.serverId}`),
    ]).catch(() => { });
    return { success: true, serverName: guild.name, server: updated };
  },

  async bridges(userId: string, serverId: string): Promise<ServerBridgeResource[]> {
    await assertManageable(userId, serverId, false);
    try {
      const [connections, channels] = await Promise.all([
        controlConnectionService.getConnections({
          serverId,
          actorId: userId,
        }),
        serverService.channels(userId, serverId),
      ]);

      const channelMap = new Map(channels.map((c) => [c.id, c.name]));

      const hubPromises = new Map<string, Promise<Awaited<ReturnType<typeof controlHubService.getHub>> | undefined>>();
      const getHubMemoized = (hubId: string) => {
        let p = hubPromises.get(hubId);
        if (!p) {
          p = controlHubService.getHub(hubId, userId).catch((error) => {
            // A deleted/private Hub may be redacted from a bridge row, but a
            // Control Plane outage must make the whole projection unavailable.
            if (isControlNotFound(error) || isControlPermissionDenied(error)) return undefined;
            throw error;
          });
          hubPromises.set(hubId, p);
        }
        return p;
      };

      const result = await Promise.all(connections.map(async (conn) => {
        let hub: Awaited<ReturnType<typeof controlHubService.getHub>> | undefined;
        if (conn.metadata.hubId) {
          hub = await getHubMemoized(conn.metadata.hubId);
        }
        const channelId = conn.metadata.channelId || "";
        return {
          id: conn.metadata.id,
          channelId,
          channelName: channelId ? channelMap.get(channelId) || null : null,
          // Do not expose a Hub identifier when the authoritative Hub lookup
          // was denied or the Hub was deleted. The bridge remains visible, but
          // callers cannot use a leaked ID to probe private resources.
          hubId: hub ? conn.metadata.hubId || "" : "",
          hubName: hub?.metadata.name || conn.spec.customName || "Unavailable Hub",
          hubIconUrl: hub?.spec.iconUrl || null,
          connected: conn.spec.connected,
          pausedByBot: !conn.status.healthy,
          pauseReason: conn.status.statusMessage || null,
          createdAt: conn.metadata.createdAt || null,
          version: conn.version,
          webhookProvisioned: conn.status.webhookProvisioned,
        };
      }));

      return result;
    } catch (err) {
      console.warn(`[serverService.bridges] Could not fetch connections for server ${serverId}:`, err);
      throw new Error("Server bridges are temporarily unavailable. Please try again shortly.", { cause: err });
    }
  },

  async toggleBridge(userId: string, input: { serverId: string; connectionId: string; enabled: boolean; expectedVersion: number; idempotencyKey: string }) {
    await assertManageable(userId, input.serverId, true);
    const current = (await controlConnectionService.getConnections({ serverId: input.serverId, actorId: userId }))
      .find((connection) => connection.metadata.id === input.connectionId);
    if (!current) throw new Error("Connection not found on this server.");
    const connection = await controlConnectionService.toggleConnection({
      connectionId: input.connectionId,
      enabled: input.enabled,
      expectedVersion: input.expectedVersion,
      actorId: userId,
      idempotencyKey: input.idempotencyKey,
    });
    await redis.del(`winter:bridges:${userId}:${input.serverId}`).catch(() => { });
    return { success: true, connection };
  },

  async repairBridge(userId: string, input: { serverId: string; connectionId: string; expectedVersion: number; idempotencyKey: string }) {
    await assertManageable(userId, input.serverId, true);
    const current = (await controlConnectionService.getConnections({ serverId: input.serverId, actorId: userId }))
      .find((connection) => connection.metadata.id === input.connectionId);
    if (!current) throw new Error("Connection not found on this server.");
    const connection = await controlConnectionService.repairConnectionWebhooks({
      connectionId: input.connectionId,
      expectedVersion: input.expectedVersion,
      actorId: userId,
      idempotencyKey: input.idempotencyKey,
    });
    await redis.del(`winter:bridges:${userId}:${input.serverId}`).catch(() => { });
    return { success: true, connection };
  },

  async disconnectBridge(userId: string, input: { serverId: string; connectionId: string; expectedVersion: number; idempotencyKey: string }) {
    await assertManageable(userId, input.serverId, true);
    const current = (await controlConnectionService.getConnections({ serverId: input.serverId, actorId: userId }))
      .find((connection) => connection.metadata.id === input.connectionId);
    if (!current) throw new Error("Connection not found on this server.");
    await controlConnectionService.disconnectChannel({
      connectionId: input.connectionId,
      expectedVersion: input.expectedVersion,
      actorId: userId,
      idempotencyKey: input.idempotencyKey,
    });
    await redis.del(`winter:bridges:${userId}:${input.serverId}`).catch(() => { });
    return { success: true };
  },


  async blocklist(userId: string, serverId: string): Promise<ServerBlockResource[]> {
    await assertManageable(userId, serverId, false);
    try {
      const blocks = await controlServerService.getBlocklist(serverId, userId);

      const result: ServerBlockResource[] = blocks.map((b) => ({
        id: b.id,
        targetType: b.targetType === "BLOCK_TARGET_TYPE_USER" ? "user" : b.targetType === "BLOCK_TARGET_TYPE_SERVER" ? "server" : (() => { throw new Error("Control Plane returned an unknown block target type."); })(),
        targetId: b.targetId,
        reason: b.reason,
        authorId: b.authorId,
        createdAt: b.createdAt || null,
      }));
      return result;
    } catch (err) {
      console.warn(`[serverService.blocklist] Could not fetch blocklist for server ${serverId}:`, err);
      throw new Error("Server blocklist is temporarily unavailable. Please try again shortly.", { cause: err });
    }
  },

  async addBlock(userId: string, input: AddBlockInput) {
    await assertManageable(userId, input.serverId, true);
    const targetType = input.targetType === "user" ? "BLOCK_TARGET_TYPE_USER" : "BLOCK_TARGET_TYPE_SERVER";
    const res = await controlServerService.addBlock({
      serverId: input.serverId,
      targetId: input.targetId,
      targetType,
      reason: input.reason || "",
      actorId: userId,
      idempotencyKey: input.idempotencyKey,
    });
    await redis.del(`winter:blocklist:${userId}:${input.serverId}`).catch(() => { });
    return { success: true, id: res.id };
  },

  async removeBlock(userId: string, input: RemoveBlockInput) {
    await assertManageable(userId, input.serverId, true);
    await controlServerService.removeBlock({
      serverId: input.serverId,
      blockId: input.blockId,
      actorId: userId,
      idempotencyKey: input.idempotencyKey,
    });
    await redis.del(`winter:blocklist:${userId}:${input.serverId}`).catch(() => { });
    return { success: true };
  },
};
