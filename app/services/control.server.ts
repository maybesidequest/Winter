import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { readFileSync } from "node:fs";
import { CONTROL_DESCRIPTOR_BASE64 } from "~/generated/control/v1/controlDescriptor";
import type { HubResource, HubSpec } from "~/resources/hub";

type UnaryClient = Record<
  string,
  (
    request: unknown,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: (error: grpc.ServiceError | null, response?: any) => void
  ) => void
>;

type ClientRegistry = {
  hubClient?: UnaryClient;
  serverClient?: UnaryClient;
  connectionClient?: UnaryClient;
  userClient?: UnaryClient;
  moderationClient?: UnaryClient;
};

const registry: ClientRegistry = {};

function credentials() {
  const caPath = process.env.CONTROL_PLANE_TLS_CA;
  const certPath = process.env.CONTROL_PLANE_TLS_CERT;
  const keyPath = process.env.CONTROL_PLANE_TLS_KEY;
  if (caPath && certPath && keyPath) {
    return grpc.credentials.createSsl(
      readFileSync(caPath),
      readFileSync(keyPath),
      readFileSync(certPath)
    );
  }
  if (
    process.env.CONTROL_PLANE_ALLOW_INSECURE === "true" ||
    process.env.NODE_ENV !== "production"
  ) {
    return grpc.credentials.createInsecure();
  }
  throw new Error("Control Plane mTLS credentials are not configured.");
}

function loadPackageDefinition() {
  const definition = protoLoader.loadFileDescriptorSetFromBuffer(
    Buffer.from(CONTROL_DESCRIPTOR_BASE64, "base64"),
    {
      keepCase: false,
      longs: Number,
      enums: String,
      defaults: true,
      oneofs: true,
    }
  );
  return (grpc.loadPackageDefinition(definition) as any).interchat.control.v1;
}

function getServiceClients() {
  if (registry.hubClient) return registry as Required<ClientRegistry>;

  const pkg = loadPackageDefinition();
  const address = process.env.CONTROL_PLANE_GRPC_ADDRESS || "localhost:50052";
  const creds = credentials();
  const options = {
    "grpc.ssl_target_name_override": process.env.CONTROL_PLANE_TLS_DOMAIN,
    "grpc.default_authority": process.env.CONTROL_PLANE_TLS_DOMAIN,
  };

  registry.hubClient = new pkg.HubService(address, creds, options) as UnaryClient;
  registry.serverClient = new pkg.ServerService(address, creds, options) as UnaryClient;
  registry.connectionClient = new pkg.ConnectionService(address, creds, options) as UnaryClient;
  registry.userClient = new pkg.UserService(address, creds, options) as UnaryClient;
  registry.moderationClient = new pkg.ModerationService(address, creds, options) as UnaryClient;

  return registry as Required<ClientRegistry>;
}

function invokeRpc<T>(client: UnaryClient, method: string, request: unknown): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutMs = Number(process.env.CONTROL_PLANE_TIMEOUT_MS || 5000);
    const deadline = new Date(Date.now() + timeoutMs);
    const rpc = client[method];
    if (!rpc) {
      return reject(new Error(`Control Plane method ${method} is unavailable.`));
    }
    rpc.call(
      client,
      request,
      new grpc.Metadata(),
      { deadline },
      (error, response) => (error ? reject(error) : resolve(response as T))
    );
  });
}

function requestContext(actorId: string, mutation = false) {
  return {
    requestId: crypto.randomUUID(),
    actorId,
    actorType: "ACTOR_TYPE_HUMAN",
    servicePrincipal: process.env.CONTROL_PLANE_SERVICE_PRINCIPAL || "interchat-winter",
    idempotencyKey: mutation ? crypto.randomUUID() : "",
    traceId: "",
  };
}

function mapProtoToHubResource(protoHub: any): HubResource {
  const meta = protoHub.metadata || {};
  const spec = protoHub.spec || {};
  const status = protoHub.status || {};

  let visibility: "PUBLIC" | "PRIVATE" | "UNLISTED" = "PUBLIC";
  if (spec.visibility === "HUB_VISIBILITY_PRIVATE" || spec.visibility === "PRIVATE") {
    visibility = "PRIVATE";
  } else if (spec.visibility === "HUB_VISIBILITY_UNLISTED" || spec.visibility === "UNLISTED") {
    visibility = "UNLISTED";
  }

  let activityLevel: "LOW" | "MEDIUM" | "HIGH" = "LOW";
  if (status.activityLevel === "HUB_ACTIVITY_LEVEL_MEDIUM" || status.activityLevel === "MEDIUM") {
    activityLevel = "MEDIUM";
  } else if (status.activityLevel === "HUB_ACTIVITY_LEVEL_HIGH" || status.activityLevel === "HIGH") {
    activityLevel = "HIGH";
  }

  return {
    metadata: {
      id: meta.id || "",
      name: meta.name || spec.name || "",
      createdAt: meta.createdAt ? new Date(Number(meta.createdAt.seconds || 0) * 1000).toISOString() : new Date().toISOString(),
      updatedAt: meta.updatedAt ? new Date(Number(meta.updatedAt.seconds || 0) * 1000).toISOString() : null,
      effectiveRole: meta.effectiveRole || "NONE",
      permissions: meta.permissions || {},
    },
    spec: {
      description: spec.description || "",
      shortDescription: spec.shortDescription || null,
      visibility,
      language: spec.language || null,
      region: spec.region || null,
      welcomeMessage: spec.welcomeMessage || null,
      iconUrl: spec.iconUrl || null,
      bannerUrl: spec.bannerUrl || null,
      locked: Boolean(spec.locked),
      nsfw: Boolean(spec.nsfw),
      rules: Array.isArray(spec.rules) ? spec.rules : [],
      appealCooldownHours: Number(spec.appealCooldownHours || 168),
      settings: Number(spec.settings || 0),
    },
    status: {
      activityLevel,
      verified: Boolean(status.verified),
      partnered: Boolean(status.partnered),
      featured: Boolean(status.featured),
      weeklyMessageCount: Number(status.weeklyMessageCount || 0),
      averageRating: status.averageRating != null ? Number(status.averageRating) : null,
      connectionCount: Number(status.connectionCount || 0),
      upvoteCount: Number(status.upvoteCount || 0),
      reviewCount: Number(status.reviewCount || 0),
    },
    version: Number(protoHub.version || 1),
  };
}

export const controlClient = {
  // =========================================================================
  // Hub Service
  // =========================================================================

  async getHub(actorId: string, hubId: string): Promise<HubResource> {
    const clients = getServiceClients();
    const resp = await invokeRpc<any>(clients.hubClient, "getHub", {
      context: requestContext(actorId),
      hubId,
    });
    return mapProtoToHubResource(resp);
  },

  async patchHub(
    actorId: string,
    hubId: string,
    spec: Partial<HubSpec> & { name?: string },
    updateMask: string[],
    expectedVersion: number
  ): Promise<HubResource> {
    const clients = getServiceClients();
    let protoVisibility = "HUB_VISIBILITY_PUBLIC";
    if (spec.visibility === "PRIVATE") protoVisibility = "HUB_VISIBILITY_PRIVATE";
    if (spec.visibility === "UNLISTED") protoVisibility = "HUB_VISIBILITY_UNLISTED";

    const protoSpec: any = {
      name: spec.name || "",
      shortDescription: spec.shortDescription || "",
      description: spec.description || "",
      iconUrl: spec.iconUrl || "",
      bannerUrl: spec.bannerUrl || "",
      welcomeMessage: spec.welcomeMessage || "",
      language: spec.language || "",
      region: spec.region || "",
      visibility: protoVisibility,
      locked: Boolean(spec.locked),
      nsfw: Boolean(spec.nsfw),
      rules: spec.rules || [],
      appealCooldownHours: spec.appealCooldownHours ?? 168,
      settings: spec.settings ?? 0,
    };

    const resp = await invokeRpc<any>(clients.hubClient, "patchHub", {
      context: requestContext(actorId, true),
      hubId,
      spec: protoSpec,
      updateMask: { paths: updateMask },
      expectedVersion,
    });
    return mapProtoToHubResource(resp);
  },

  async listHubRules(actorId: string, hubId: string) {
    const clients = getServiceClients();
    return invokeRpc<any>(clients.hubClient, "listRules", {
      context: requestContext(actorId),
      hubId,
    });
  },

  async createHubRule(actorId: string, hubId: string, title: string, description: string, expectedVersion: number) {
    const clients = getServiceClients();
    return invokeRpc<any>(clients.hubClient, "createRule", {
      context: requestContext(actorId, true),
      hubId,
      title,
      description,
      expectedVersion,
    });
  },

  async deleteHubRule(actorId: string, hubId: string, ruleId: string, expectedVersion: number) {
    const clients = getServiceClients();
    return invokeRpc<any>(clients.hubClient, "deleteRule", {
      context: requestContext(actorId, true),
      hubId,
      ruleId,
      expectedVersion,
    });
  },

  async listHubInvites(actorId: string, hubId: string) {
    const clients = getServiceClients();
    return invokeRpc<any>(clients.hubClient, "listInvites", {
      context: requestContext(actorId),
      hubId,
    });
  },

  async createHubInvite(actorId: string, hubId: string, maxUses: number, durationSeconds: number) {
    const clients = getServiceClients();
    return invokeRpc<any>(clients.hubClient, "createInvite", {
      context: requestContext(actorId, true),
      hubId,
      maxUses,
      durationSeconds,
    });
  },

  async revokeHubInvite(actorId: string, hubId: string, inviteCode: string) {
    const clients = getServiceClients();
    return invokeRpc<any>(clients.hubClient, "revokeInvite", {
      context: requestContext(actorId, true),
      hubId,
      inviteCode,
    });
  },

  async patchHubBadges(
    actorId: string,
    hubId: string,
    badges: { ownerBadge?: string; managerBadge?: string; moderatorBadge?: string },
    expectedVersion: number
  ) {
    const clients = getServiceClients();
    return invokeRpc<any>(clients.hubClient, "patchBadges", {
      context: requestContext(actorId, true),
      hubId,
      ownerBadge: badges.ownerBadge || "",
      managerBadge: badges.managerBadge || "",
      moderatorBadge: badges.moderatorBadge || "",
      expectedVersion,
    });
  },

  async patchHubLogConfig(
    actorId: string,
    hubId: string,
    config: { channelId?: string; eventFlags?: number; notificationRoleId?: string },
    expectedVersion: number
  ) {
    const clients = getServiceClients();
    return invokeRpc<any>(clients.hubClient, "patchLogConfig", {
      context: requestContext(actorId, true),
      hubId,
      channelId: config.channelId || "",
      eventFlags: config.eventFlags ?? 0,
      notificationRoleId: config.notificationRoleId || "",
      expectedVersion,
    });
  },

  async listHubAnnouncements(actorId: string, hubId: string) {
    const clients = getServiceClients();
    return invokeRpc<any>(clients.hubClient, "listAnnouncements", {
      context: requestContext(actorId),
      hubId,
    });
  },

  async createHubAnnouncement(actorId: string, hubId: string, content: string) {
    const clients = getServiceClients();
    return invokeRpc<any>(clients.hubClient, "createAnnouncement", {
      context: requestContext(actorId, true),
      hubId,
      content,
    });
  },

  async listHubStaff(actorId: string, hubId: string) {
    const clients = getServiceClients();
    return invokeRpc<any>(clients.hubClient, "listStaff", {
      context: requestContext(actorId),
      hubId,
    });
  },

  async assignHubStaffRole(
    actorId: string,
    hubId: string,
    userId: string,
    role: string,
    permissionsBitmask: number
  ) {
    const clients = getServiceClients();
    return invokeRpc<any>(clients.hubClient, "assignStaffRole", {
      context: requestContext(actorId, true),
      hubId,
      userId,
      role,
      permissionsBitmask,
    });
  },

  async removeHubStaffRole(actorId: string, hubId: string, userId: string) {
    const clients = getServiceClients();
    return invokeRpc<any>(clients.hubClient, "removeStaffRole", {
      context: requestContext(actorId, true),
      hubId,
      userId,
    });
  },

  async lockdownHub(actorId: string, hubId: string, locked: boolean, reason: string, expectedVersion: number) {
    const clients = getServiceClients();
    const resp = await invokeRpc<any>(clients.hubClient, "lockdownHub", {
      context: requestContext(actorId, true),
      hubId,
      locked,
      reason,
      expectedVersion,
    });
    return mapProtoToHubResource(resp);
  },

  async transferHubOwnership(actorId: string, hubId: string, newOwnerId: string, expectedVersion: number) {
    const clients = getServiceClients();
    const resp = await invokeRpc<any>(clients.hubClient, "transferOwnership", {
      context: requestContext(actorId, true),
      hubId,
      newOwnerId,
      expectedVersion,
    });
    return mapProtoToHubResource(resp);
  },

  async deleteHub(actorId: string, hubId: string, confirmationName: string, expectedVersion: number) {
    const clients = getServiceClients();
    return invokeRpc<any>(clients.hubClient, "deleteHub", {
      context: requestContext(actorId, true),
      hubId,
      confirmationName,
      expectedVersion,
    });
  },

  // =========================================================================
  // Server Service
  // =========================================================================

  async getServer(serverId: string) {
    const clients = getServiceClients();
    return invokeRpc<any>(clients.serverClient, "getServer", { serverId });
  },

  async patchServerConfig(
    actorId: string,
    serverId: string,
    spec: any,
    updateMask: string[],
    expectedVersion: number
  ) {
    const clients = getServiceClients();
    return invokeRpc<any>(clients.serverClient, "patchServerConfig", {
      context: requestContext(actorId, true),
      serverId,
      spec,
      updateMask: { paths: updateMask },
      expectedVersion,
    });
  },

  async getServerBlocklist(serverId: string) {
    const clients = getServiceClients();
    return invokeRpc<any>(clients.serverClient, "getBlocklist", { serverId });
  },

  async addServerBlock(
    actorId: string,
    serverId: string,
    targetId: string,
    targetType: "BLOCK_TARGET_TYPE_USER" | "BLOCK_TARGET_TYPE_SERVER",
    reason: string
  ) {
    const clients = getServiceClients();
    return invokeRpc<any>(clients.serverClient, "addBlock", {
      context: requestContext(actorId, true),
      serverId,
      targetId,
      targetType,
      reason,
    });
  },

  async removeServerBlock(actorId: string, serverId: string, blockId: string) {
    const clients = getServiceClients();
    return invokeRpc<any>(clients.serverClient, "removeBlock", {
      context: requestContext(actorId, true),
      serverId,
      blockId,
    });
  },

  // =========================================================================
  // Connection Service
  // =========================================================================

  async getConnections(hubId = "", serverId = "") {
    const clients = getServiceClients();
    return invokeRpc<any>(clients.connectionClient, "getConnections", {
      hubId,
      serverId,
    });
  },

  async connectChannel(
    actorId: string,
    serverId: string,
    channelId: string,
    hubId: string,
    inviteCode = "",
    customName = ""
  ) {
    const clients = getServiceClients();
    return invokeRpc<any>(clients.connectionClient, "connectChannel", {
      context: requestContext(actorId, true),
      serverId,
      channelId,
      hubId,
      inviteCode,
      customName,
    });
  },

  async disconnectChannel(actorId: string, connectionId: string, expectedVersion: number) {
    const clients = getServiceClients();
    return invokeRpc<any>(clients.connectionClient, "disconnectChannel", {
      context: requestContext(actorId, true),
      connectionId,
      expectedVersion,
    });
  },

  async toggleConnection(actorId: string, connectionId: string, enabled: boolean, expectedVersion: number) {
    const clients = getServiceClients();
    return invokeRpc<any>(clients.connectionClient, "toggleConnection", {
      context: requestContext(actorId, true),
      connectionId,
      enabled,
      expectedVersion,
    });
  },

  async repairConnectionWebhooks(actorId: string, connectionId: string) {
    const clients = getServiceClients();
    return invokeRpc<any>(clients.connectionClient, "repairConnectionWebhooks", {
      context: requestContext(actorId, true),
      connectionId,
    });
  },

  // =========================================================================
  // User Service
  // =========================================================================

  async getUserProfile(userId: string) {
    const clients = getServiceClients();
    return invokeRpc<any>(clients.userClient, "getUserProfile", { userId });
  },

  async getUserPreferences(actorId: string) {
    const clients = getServiceClients();
    return invokeRpc<any>(clients.userClient, "getUserPreferences", requestContext(actorId));
  },

  async patchUserPreferences(actorId: string, preferences: any) {
    const clients = getServiceClients();
    return invokeRpc<any>(clients.userClient, "patchUserPreferences", {
      context: requestContext(actorId, true),
      preferences,
    });
  },

  async getUserInbox(actorId: string) {
    const clients = getServiceClients();
    return invokeRpc<any>(clients.userClient, "getUserInbox", {
      context: requestContext(actorId),
    });
  },

  async acknowledgeInboxItem(actorId: string, itemId: string) {
    const clients = getServiceClients();
    return invokeRpc<any>(clients.userClient, "acknowledgeInboxItem", {
      context: requestContext(actorId, true),
      itemId,
    });
  },

  // =========================================================================
  // Moderation Service
  // =========================================================================

  async applySanction(
    actorId: string,
    hubId: string,
    userId: string,
    type: "SANCTION_TYPE_WARN" | "SANCTION_TYPE_MUTE" | "SANCTION_TYPE_BAN",
    reason: string,
    durationSeconds = 0
  ) {
    const clients = getServiceClients();
    return invokeRpc<any>(clients.moderationClient, "applySanction", {
      context: requestContext(actorId, true),
      hubId,
      userId,
      type,
      reason,
      durationSeconds,
    });
  },

  async revokeSanction(actorId: string, hubId: string, infractionId: string, reason: string) {
    const clients = getServiceClients();
    return invokeRpc<any>(clients.moderationClient, "revokeSanction", {
      context: requestContext(actorId, true),
      hubId,
      infractionId,
      reason,
    });
  },

  async getInfractions(actorId: string, hubId: string, userId = "") {
    const clients = getServiceClients();
    return invokeRpc<any>(clients.moderationClient, "getInfractions", {
      context: requestContext(actorId),
      hubId,
      userId,
    });
  },

  async submitAppeal(actorId: string, hubId: string, infractionId: string, reason: string) {
    const clients = getServiceClients();
    return invokeRpc<any>(clients.moderationClient, "submitAppeal", {
      context: requestContext(actorId, true),
      hubId,
      infractionId,
      reason,
    });
  },
};
