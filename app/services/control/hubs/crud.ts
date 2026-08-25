import type { HubResource, HubSpec } from "~/resources/hub";
import { getServiceClients, invokeRpc, makeRequestContext } from "../transport";

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
    return invokeRpc(clients.hubClient, "GetHub", {
      context: makeRequestContext(actorId),
      hubId,
    });
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
    spec: Partial<HubSpec>;
    updateMask: string[];
    expectedVersion: number;
    actorId: string;
    idempotencyKey: string;
  }): Promise<HubResource> {
    const clients = getServiceClients();
    return invokeRpc(clients.hubClient, "PatchHub", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      spec: input.spec,
      updateMask: { paths: input.updateMask },
      expectedVersion: input.expectedVersion,
    });
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
