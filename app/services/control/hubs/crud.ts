import type { HubResource, HubSpec } from "~/resources/hub";
import type { Hub__Output as ProtoHub } from "~/generated/control/v1/interchat/control/v1/Hub";
import type { HubSpec as ProtoHubSpecMessage } from "~/generated/control/v1/interchat/control/v1/HubSpec";
import type { GetHubRequest } from "~/generated/control/v1/interchat/control/v1/GetHubRequest";
import type { PatchHubRequest } from "~/generated/control/v1/interchat/control/v1/PatchHubRequest";
import { getServiceClients, invokeRpc, invokeUnary, makeRequestContext } from "../transport";

function timestamp(value: { seconds?: number; nanos?: number } | null | undefined): string {
  if (!value) return new Date(0).toISOString();
  return new Date((value.seconds || 0) * 1000 + (value.nanos || 0) / 1_000_000).toISOString();
}

function visibility(value: string): HubSpec["visibility"] {
  return value.replace("HUB_VISIBILITY_", "") as HubSpec["visibility"];
}

function activity(value: string): HubResource["status"]["activityLevel"] {
  return value.replace("HUB_ACTIVITY_LEVEL_", "") as HubResource["status"]["activityLevel"];
}

function toResource(hub: ProtoHub): HubResource {
  const metadata = hub.metadata;
  const spec = hub.spec;
  const status = hub.status;
  if (!metadata || !spec || !status) throw new Error("Control Plane returned an incomplete Hub resource.");
  return {
    metadata: {
      id: metadata.id,
      name: metadata.name,
      createdAt: timestamp(metadata.createdAt),
      updatedAt: timestamp(metadata.updatedAt),
      effectiveRole: metadata.effectiveRole,
      permissions: metadata.permissions as HubResource["metadata"]["permissions"],
    },
    spec: {
      description: spec.description,
      shortDescription: spec.shortDescription || null,
      visibility: visibility(spec.visibility),
      language: spec.language || null,
      region: spec.region || null,
      welcomeMessage: spec.welcomeMessage || null,
      iconUrl: spec.iconUrl || null,
      bannerUrl: spec.bannerUrl || null,
      locked: spec.locked,
      nsfw: spec.nsfw,
      rules: spec.rules || [],
      appealCooldownHours: spec.appealCooldownHours,
      settings: spec.settings,
    },
    status: {
      activityLevel: activity(status.activityLevel),
      verified: status.verified,
      partnered: status.partnered,
      featured: status.featured,
      weeklyMessageCount: status.weeklyMessageCount,
      averageRating: status.averageRating,
      connectionCount: status.connectionCount,
      upvoteCount: status.upvoteCount,
      reviewCount: status.reviewCount,
    },
    version: hub.version,
  };
}

function toProtoSpec(spec: Partial<HubSpec> & { name?: string }): ProtoHubSpecMessage {
  const result: ProtoHubSpecMessage = {};
  if (spec.name !== undefined) result.name = spec.name;
  if (spec.description !== undefined) result.description = spec.description;
  if (spec.shortDescription !== undefined && spec.shortDescription !== null) result.shortDescription = spec.shortDescription;
  if (spec.visibility !== undefined) result.visibility = `HUB_VISIBILITY_${spec.visibility}` as ProtoHubSpecMessage["visibility"];
  if (spec.iconUrl !== undefined && spec.iconUrl !== null) result.iconUrl = spec.iconUrl;
  if (spec.bannerUrl !== undefined && spec.bannerUrl !== null) result.bannerUrl = spec.bannerUrl;
  if (spec.welcomeMessage !== undefined && spec.welcomeMessage !== null) result.welcomeMessage = spec.welcomeMessage;
  if (spec.language !== undefined && spec.language !== null) result.language = spec.language;
  if (spec.region !== undefined && spec.region !== null) result.region = spec.region;
  if (spec.locked !== undefined) result.locked = spec.locked;
  if (spec.nsfw !== undefined) result.nsfw = spec.nsfw;
  if (spec.appealCooldownHours !== undefined) result.appealCooldownHours = spec.appealCooldownHours;
  if (spec.settings !== undefined) result.settings = spec.settings;
  return result;
}

export const hubCrudService = {
  async createHub(input: {
    name: string;
    description: string;
    shortDescription?: string | null;
    visibility?: "PUBLIC" | "PRIVATE" | "UNLISTED";
    iconUrl?: string | null;
    bannerUrl?: string | null;
    welcomeMessage?: string | null;
    language?: string | null;
    region?: string | null;
    actorId: string;
    idempotencyKey: string;
  }): Promise<HubResource> {
    const clients = getServiceClients();
    return invokeRpc(clients.hubClient, "CreateHub", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      spec: {
        name: input.name,
        description: input.description,
        shortDescription: input.shortDescription || null,
        visibility: input.visibility || "PUBLIC",
        iconUrl: input.iconUrl || null,
        bannerUrl: input.bannerUrl || null,
        welcomeMessage: input.welcomeMessage || null,
        language: input.language || "en",
        region: input.region || "us",
      },
    });
  },

  async getHub(hubId: string, actorId: string): Promise<HubResource> {
    const clients = getServiceClients();
    const request: GetHubRequest = {
      context: makeRequestContext(actorId),
      hubId,
    };
    const response = await invokeUnary<GetHubRequest, ProtoHub>(clients.hubClient.GetHub.bind(clients.hubClient), request);
    return toResource(response);
  },

  async listUserHubs(hubIds: string[], actorId: string): Promise<HubResource[]> {
    const clients = getServiceClients();
    const res = await invokeRpc<{ hubs?: HubResource[] }>(clients.hubClient, "ListUserHubs", {
      context: makeRequestContext(actorId),
      hubIds,
    });
    return res.hubs || [];
  },

  async listMyHubs(actorId: string, limit: number = 50, cursor?: string): Promise<{ hubs: any[]; nextCursor?: string; totalCount: number }> {
    const clients = getServiceClients();
    const res = await invokeRpc<{ hubs?: any[]; nextCursor?: string; totalCount?: number }>(clients.hubClient, "ListMyHubs", {
      context: makeRequestContext(actorId),
      limit,
      cursor,
    });
    return {
      hubs: res.hubs || [],
      nextCursor: res.nextCursor,
      totalCount: res.totalCount || 0,
    };
  },

  async searchHubs(input: {
    query?: string;
    sort?: string;
    tags?: string[];
    language?: string;
    region?: string;
    nsfwFilter?: string;
    limit?: number;
    cursor?: string;
    actorId?: string;
  }): Promise<{ hubs: any[]; nextCursor?: string; totalCount: number }> {
    const clients = getServiceClients();
    const res = await invokeRpc<{ hubs?: any[]; nextCursor?: string; totalCount?: number }>(clients.hubClient, "SearchHubs", {
      context: makeRequestContext(input.actorId || "anonymous"),
      query: input.query || "",
      sort: input.sort || "HUB_SEARCH_SORT_TRENDING",
      tags: input.tags || [],
      language: input.language,
      region: input.region,
      nsfwFilter: input.nsfwFilter || "NSFW_FILTER_SFW_ONLY",
      limit: input.limit || 24,
      cursor: input.cursor,
    });
    return {
      hubs: res.hubs || [],
      nextCursor: res.nextCursor,
      totalCount: res.totalCount || 0,
    };
  },

  async getPopularTags(limit: number = 50): Promise<{ tags: any[] }> {
    const clients = getServiceClients();
    const res = await invokeRpc<{ tags?: any[] }>(clients.hubClient, "GetPopularTags", {
      limit,
    });
    return { tags: res.tags || [] };
  },

  async upvoteHub(hubId: string, actorId: string): Promise<{ totalUpvotes: number; upvoted: boolean }> {
    const clients = getServiceClients();
    return invokeRpc(clients.hubClient, "UpvoteHub", {
      context: makeRequestContext(actorId),
      hubId,
    });
  },



  async patchHub(input: {
    hubId: string;
    spec: Partial<HubSpec> & { name?: string };
    updateMask: string[];
    expectedVersion: number;
    actorId: string;
    idempotencyKey: string;
  }): Promise<HubResource> {
    const clients = getServiceClients();
    const request: PatchHubRequest = {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      spec: toProtoSpec(input.spec),
      updateMask: { paths: input.updateMask },
      expectedVersion: input.expectedVersion,
    };
    const response = await invokeUnary<PatchHubRequest, ProtoHub>(clients.hubClient.PatchHub.bind(clients.hubClient), request);
    return toResource(response);
  },

  async lockdownHub(input: {
    hubId: string;
    locked: boolean;
    reason: string;
    expectedVersion: number;
    actorId: string;
    idempotencyKey: string;
  }): Promise<HubResource> {
    const clients = getServiceClients();
    return invokeRpc(clients.hubClient, "LockdownHub", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      locked: input.locked,
      reason: input.reason,
      expectedVersion: input.expectedVersion,
    });
  },

  async transferOwnership(input: {
    hubId: string;
    newOwnerId: string;
    expectedVersion: number;
    actorId: string;
    idempotencyKey: string;
  }): Promise<HubResource> {
    const clients = getServiceClients();
    return invokeRpc(clients.hubClient, "TransferOwnership", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      newOwnerId: input.newOwnerId,
      expectedVersion: input.expectedVersion,
    });
  },

  async deleteHub(input: {
    hubId: string;
    confirmationName: string;
    expectedVersion: number;
    actorId: string;
    idempotencyKey: string;
  }): Promise<void> {
    const clients = getServiceClients();
    await invokeRpc(clients.hubClient, "DeleteHub", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      confirmationName: input.confirmationName,
      expectedVersion: input.expectedVersion,
    });
  },
};
