import { redis } from "~/redis.server";
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

type DiscordGuild = { id: string; name: string; icon: string | null; owner?: boolean; permissions: string };

function isControlNotFound(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const code = (error as { code?: unknown }).code;
  return code === 5 || code === "NOT_FOUND";
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
        // invalid JSON in cache
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

  await redis.set(cacheKey, JSON.stringify(manageable), "EX", 600);
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

    const guildIds = guilds.map((g) => g.id);
    const installedServersMap = new Map<string, ServerResource>();

    try {
      const batchRes = await controlServerService.batchGetServers(guildIds, userId);
      for (const s of batchRes.servers) {
        installedServersMap.set(s.metadata.id, s);
      }
    } catch (err) {
      // An unavailable Control Plane must not be rendered as a fleet of
      // uninstalled servers. Preserve the failure so the UI can show an
      // unavailable state instead of inventing configuration.
      throw err;
    }

    return guilds.map((guild) => {
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
            botInstalled: true,
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
  },


  async get(userId: string, serverId: string): Promise<ServerResource> {
    const guild = await assertManageable(userId, serverId, true);
    try {
      const res = await controlServerService.getServer(serverId, userId);
      return {
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
    } catch (error) {
      if (!isControlNotFound(error)) throw error;
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
    await assertManageable(userId, serverId, true);
    const token = await getDiscordAccessToken(userId);
    const response = await discordFetch(`/guilds/${serverId}/channels`, `Bearer ${token}`);
    if (!response.ok) return [];
    const channels = (await response.json()) as Array<{ id: string; name: string; type: number }>;
    return channels
      .filter((channel) => channel.type === 0 || channel.type === 5)
      // Discord's channel listing does not include the bot's effective
      // webhook permission. Let the Control Plane perform the authoritative
      // check instead of advertising a fabricated capability.
      .map((channel) => ({ ...channel, canCreateWebhook: false }));
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
    return { success: true, serverName: guild.name, server: updated };
  },

  async bridges(userId: string, serverId: string): Promise<ServerBridgeResource[]> {
    await assertManageable(userId, serverId, true);
    const connections = await controlConnectionService.getConnections({
      serverId,
      actorId: userId,
    });

    return Promise.all(connections.map(async (conn) => {
      let hub: Awaited<ReturnType<typeof controlHubService.getHub>> | undefined;
      if (conn.metadata.hubId) {
        try {
          hub = await controlHubService.getHub(conn.metadata.hubId, userId);
        } catch {
          // A private or deleted Hub should not leak its internal ID.
        }
      }
      return {
        id: conn.metadata.id,
        channelId: conn.metadata.channelId || "",
        channelName: null,
        // Do not expose a Hub identifier when the authoritative Hub lookup
        // was denied or the Hub was deleted. The bridge remains visible, but
        // callers cannot use a leaked ID to probe private resources.
        hubId: hub ? conn.metadata.hubId || "" : "",
        hubName: hub?.metadata.name || conn.spec.customName || "Unavailable Hub",
        hubIconUrl: hub?.spec.iconUrl || null,
        connected: conn.spec.connected,
        pausedByBot: !conn.status.healthy,
        pauseReason: conn.status.statusMessage || null,
        createdAt: conn.metadata.createdAt || new Date().toISOString(),
        version: conn.version,
        webhookProvisioned: conn.status.webhookProvisioned,
      };
    }));
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
    return { success: true, connection };
  },

  async repairBridge(userId: string, input: { serverId: string; connectionId: string; idempotencyKey: string }) {
    await assertManageable(userId, input.serverId, true);
    const current = (await controlConnectionService.getConnections({ serverId: input.serverId, actorId: userId }))
      .find((connection) => connection.metadata.id === input.connectionId);
    if (!current) throw new Error("Connection not found on this server.");
    const connection = await controlConnectionService.repairConnectionWebhooks({
      connectionId: input.connectionId,
      actorId: userId,
      idempotencyKey: input.idempotencyKey,
    });
    return { success: true, connection };
  },

  async disconnectBridge(userId: string, input: { serverId: string; connectionId: string; idempotencyKey: string }) {
    await assertManageable(userId, input.serverId, true);
    const current = (await controlConnectionService.getConnections({ serverId: input.serverId, actorId: userId }))
      .find((connection) => connection.metadata.id === input.connectionId);
    if (!current) throw new Error("Connection not found on this server.");
    await controlConnectionService.disconnectChannel({
      connectionId: input.connectionId,
      actorId: userId,
      idempotencyKey: input.idempotencyKey,
    });
    return { success: true };
  },


  async blocklist(userId: string, serverId: string): Promise<ServerBlockResource[]> {
    await assertManageable(userId, serverId, true);
    const blocks = await controlServerService.getBlocklist(serverId, userId);

    return blocks.map((b) => ({
      id: b.id,
      targetType: b.targetType === "BLOCK_TARGET_TYPE_USER" ? "user" : "server",
      targetId: b.targetId,
      createdAt: b.createdAt || new Date().toISOString(),
    }));
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
    return { success: true };
  },
};
