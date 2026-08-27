import type { CreateHubRequest } from "~/generated/control/v1/interchat/control/v1/CreateHubRequest";
import type { DeleteHubRequest } from "~/generated/control/v1/interchat/control/v1/DeleteHubRequest";
import type { EmptyResponse__Output } from "~/generated/control/v1/interchat/control/v1/EmptyResponse";
import type { GetHubRequest } from "~/generated/control/v1/interchat/control/v1/GetHubRequest";
import type { GetPopularTagsRequest } from "~/generated/control/v1/interchat/control/v1/GetPopularTagsRequest";
import type { GetPopularTagsResponse } from "~/generated/control/v1/interchat/control/v1/GetPopularTagsResponse";
import type { Hub__Output as ProtoHub } from "~/generated/control/v1/interchat/control/v1/Hub";
import type { HubSearchSort } from "~/generated/control/v1/interchat/control/v1/HubSearchSort";
import type { HubSpec as ProtoHubSpecMessage } from "~/generated/control/v1/interchat/control/v1/HubSpec";
import type { ListMyHubsRequest } from "~/generated/control/v1/interchat/control/v1/ListMyHubsRequest";
import type { ListMyHubsResponse, ListMyHubsResponse__Output } from "~/generated/control/v1/interchat/control/v1/ListMyHubsResponse";
import type { ListUserHubsRequest } from "~/generated/control/v1/interchat/control/v1/ListUserHubsRequest";
import type { ListUserHubsResponse__Output } from "~/generated/control/v1/interchat/control/v1/ListUserHubsResponse";
import type { LockdownHubRequest } from "~/generated/control/v1/interchat/control/v1/LockdownHubRequest";
import type { NsfwFilter } from "~/generated/control/v1/interchat/control/v1/NsfwFilter";
import type { PatchHubRequest } from "~/generated/control/v1/interchat/control/v1/PatchHubRequest";
import type { SearchHubsRequest } from "~/generated/control/v1/interchat/control/v1/SearchHubsRequest";
import type { SearchHubsResponse } from "~/generated/control/v1/interchat/control/v1/SearchHubsResponse";
import type { TransferHubOwnershipRequest } from "~/generated/control/v1/interchat/control/v1/TransferHubOwnershipRequest";
import type { UpvoteHubRequest } from "~/generated/control/v1/interchat/control/v1/UpvoteHubRequest";
import type { UpvoteHubResponse__Output } from "~/generated/control/v1/interchat/control/v1/UpvoteHubResponse";
import type { HubResource, HubSpec } from "~/resources/hub";
import { getServiceClients, invokeUnary, makeRequestContext } from "../transport";

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

function toPermissionsRecord(raw: unknown): Record<string, boolean> {
  if (!raw) return {};
  if (Array.isArray(raw)) {
    return Object.fromEntries(
      raw
        .filter((entry): entry is { key: string; value: boolean } => entry && typeof entry === "object" && "key" in entry)
        .map((entry) => [entry.key, Boolean(entry.value)])
    );
  }
  if (typeof raw === "object") {
    return raw as Record<string, boolean>;
  }
  return {};
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
      permissions: toPermissionsRecord(metadata.permissions) as HubResource["metadata"]["permissions"],
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
    const response = await invokeUnary<CreateHubRequest, ProtoHub>(clients.hubClient.CreateHub.bind(clients.hubClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      spec: {
        name: input.name,
        description: input.description,
        shortDescription: input.shortDescription || undefined,
        visibility: `HUB_VISIBILITY_${input.visibility || "PUBLIC"}` as ProtoHubSpecMessage["visibility"],
        iconUrl: input.iconUrl || undefined,
        bannerUrl: input.bannerUrl || undefined,
        welcomeMessage: input.welcomeMessage || undefined,
        language: input.language || "en",
        region: input.region || "us",
      },
    });
    return toResource(response);
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
    const res = await invokeUnary<ListUserHubsRequest, ListUserHubsResponse__Output>(clients.hubClient.ListUserHubs.bind(clients.hubClient), {
      context: makeRequestContext(actorId),
      hubIds,
    });
    return res.hubs.map(toResource);
  },

  async listMyHubs(actorId: string, limit: number = 50, cursor?: string): Promise<ListMyHubsResponse> {
    const clients = getServiceClients();
    const request: ListMyHubsRequest = {
      context: makeRequestContext(actorId),
      limit,
      cursor,
    };
    const res = await invokeUnary<ListMyHubsRequest, ListMyHubsResponse__Output>(clients.hubClient.ListMyHubs.bind(clients.hubClient), request);
    if (res.hubs) {
      for (const h of res.hubs) {
        if (h.permissions) {
          h.permissions = toPermissionsRecord(h.permissions);
        }
      }
    }
    return res as ListMyHubsResponse;
  },

  async searchHubs(input: {
    query?: string;
    sort?: HubSearchSort;
    tags?: string[];
    language?: string;
    region?: string;
    nsfwFilter?: NsfwFilter;
    limit?: number;
    cursor?: string;
    actorId?: string;
  }): Promise<SearchHubsResponse> {
    const clients = getServiceClients();
    const request: SearchHubsRequest = {
      context: makeRequestContext(input.actorId || "anonymous"),
      query: input.query || "",
      sort: input.sort || "HUB_SEARCH_SORT_TRENDING",
      tags: input.tags || [],
      language: input.language,
      region: input.region,
      nsfwFilter: input.nsfwFilter || "NSFW_FILTER_SFW_ONLY",
      limit: input.limit || 24,
      cursor: input.cursor,
    };
    return invokeUnary<SearchHubsRequest, SearchHubsResponse>(
      clients.hubClient.SearchHubs.bind(clients.hubClient),
      request,
    );
  },

  async getPopularTags(limit: number = 50): Promise<GetPopularTagsResponse> {
    const clients = getServiceClients();
    const request: GetPopularTagsRequest = {
      context: makeRequestContext("anonymous"),
      limit,
    };
    return invokeUnary<GetPopularTagsRequest, GetPopularTagsResponse>(
      clients.hubClient.GetPopularTags.bind(clients.hubClient),
      request,
    );
  },

  async upvoteHub(hubId: string, actorId: string, idempotencyKey: string): Promise<{ totalUpvotes: number; upvoted: boolean }> {
    if (!idempotencyKey) throw new Error("idempotencyKey is required for HubService.UpvoteHub");
    const clients = getServiceClients();
    const response = await invokeUnary<UpvoteHubRequest, UpvoteHubResponse__Output>(clients.hubClient.UpvoteHub.bind(clients.hubClient), {
      context: makeRequestContext(actorId, true, idempotencyKey),
      hubId,
    });
    return { totalUpvotes: response.totalUpvotes, upvoted: response.upvoted };
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
    const response = await invokeUnary<LockdownHubRequest, ProtoHub>(clients.hubClient.LockdownHub.bind(clients.hubClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      locked: input.locked,
      reason: input.reason,
      expectedVersion: input.expectedVersion,
    });
    return toResource(response);
  },

  async transferOwnership(input: {
    hubId: string;
    newOwnerId: string;
    expectedVersion: number;
    actorId: string;
    idempotencyKey: string;
  }): Promise<HubResource> {
    const clients = getServiceClients();
    const response = await invokeUnary<TransferHubOwnershipRequest, ProtoHub>(clients.hubClient.TransferOwnership.bind(clients.hubClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      newOwnerId: input.newOwnerId,
      expectedVersion: input.expectedVersion,
    });
    return toResource(response);
  },

  async deleteHub(input: {
    hubId: string;
    confirmationName: string;
    expectedVersion: number;
    actorId: string;
    idempotencyKey: string;
  }): Promise<void> {
    const clients = getServiceClients();
    await invokeUnary<DeleteHubRequest, EmptyResponse__Output>(clients.hubClient.DeleteHub.bind(clients.hubClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      confirmationName: input.confirmationName,
      expectedVersion: input.expectedVersion,
    });
  },
};
