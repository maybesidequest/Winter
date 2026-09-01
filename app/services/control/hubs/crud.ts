import type { CreateHubRequest } from "~/generated/control/v1/static";
import type { DeleteHubRequest } from "~/generated/control/v1/static";
import type { EmptyResponse } from "~/generated/control/v1/static";
import type { GetHubRequest } from "~/generated/control/v1/static";
import type { GetPopularTagsRequest } from "~/generated/control/v1/static";
import type { GetPopularTagsResponse } from "~/generated/control/v1/static";
import type { Hub as ProtoHub } from "~/generated/control/v1/static";
import { HubSearchSort } from "~/generated/control/v1/static";
import type { HubSpec as ProtoHubSpecMessage } from "~/generated/control/v1/static";
import type { ListMyHubsRequest } from "~/generated/control/v1/static";
import type { ListMyHubsResponse } from "~/generated/control/v1/static";
import type { ListUserHubsRequest } from "~/generated/control/v1/static";
import type { ListUserHubsResponse } from "~/generated/control/v1/static";
import type { LockdownHubRequest } from "~/generated/control/v1/static";
import { NsfwFilter } from "~/generated/control/v1/static";
import type { PatchHubRequest } from "~/generated/control/v1/static";
import type { SearchHubsRequest } from "~/generated/control/v1/static";
import type { SearchHubsResponse } from "~/generated/control/v1/static";
import type { TransferHubOwnershipRequest } from "~/generated/control/v1/static";
import type { UpvoteHubRequest } from "~/generated/control/v1/static";
import type { UpvoteHubResponse } from "~/generated/control/v1/static";
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
  return {
    name: spec.name ?? "",
    shortDescription: spec.shortDescription ?? "",
    description: spec.description ?? "",
    iconUrl: spec.iconUrl ?? "",
    bannerUrl: spec.bannerUrl ?? "",
    welcomeMessage: spec.welcomeMessage ?? "",
    language: spec.language ?? "",
    region: spec.region ?? "",
    visibility: spec.visibility
      ? (`HUB_VISIBILITY_${spec.visibility}` as ProtoHubSpecMessage["visibility"])
      : ("HUB_VISIBILITY_UNSPECIFIED" as ProtoHubSpecMessage["visibility"]),
    locked: spec.locked ?? false,
    nsfw: spec.nsfw ?? false,
    rules: spec.rules ?? [],
    appealCooldownHours: spec.appealCooldownHours ?? 0,
    settings: spec.settings ?? 0,
  };
}

type SearchSortInput = HubSearchSort |
  "HUB_SEARCH_SORT_TRENDING" |
  "HUB_SEARCH_SORT_POPULAR" |
  "HUB_SEARCH_SORT_UPVOTES" |
  "HUB_SEARCH_SORT_RATING" |
  "HUB_SEARCH_SORT_ACTIVE" |
  "HUB_SEARCH_SORT_NEWEST";
type NsfwFilterInput = NsfwFilter | "NSFW_FILTER_SFW_ONLY" | "NSFW_FILTER_NSFW_ONLY" | "NSFW_FILTER_ALL";

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
    const response = await invokeUnary<CreateHubRequest, ProtoHub>(clients.hubClient.createHub.bind(clients.hubClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      spec: toProtoSpec({
        name: input.name,
        description: input.description,
        shortDescription: input.shortDescription || undefined,
        visibility: input.visibility,
        iconUrl: input.iconUrl || undefined,
        bannerUrl: input.bannerUrl || undefined,
        welcomeMessage: input.welcomeMessage || undefined,
        language: input.language || "en",
        region: input.region || "us",
      }),
      operationId: input.idempotencyKey,
    });
    return toResource(response);
  },

  async getHub(hubId: string, actorId: string): Promise<HubResource> {
    const clients = getServiceClients();
    const request: GetHubRequest = {
      context: makeRequestContext(actorId),
      hubId,
    };
    const response = await invokeUnary<GetHubRequest, ProtoHub>(clients.hubClient.getHub.bind(clients.hubClient), request);
    return toResource(response);
  },

  async listUserHubs(hubIds: string[], actorId: string): Promise<HubResource[]> {
    const clients = getServiceClients();
    const res = await invokeUnary<ListUserHubsRequest, ListUserHubsResponse>(clients.hubClient.listUserHubs.bind(clients.hubClient), {
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
      cursor: cursor ?? "",
    };
    const res = await invokeUnary<ListMyHubsRequest, ListMyHubsResponse>(clients.hubClient.listMyHubs.bind(clients.hubClient), request);
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
    sort?: SearchSortInput;
    tags?: string[];
    language?: string;
    region?: string;
    nsfwFilter?: NsfwFilterInput;
    limit?: number;
    cursor?: string;
    actorId?: string;
  }): Promise<SearchHubsResponse> {
    const clients = getServiceClients();
    const request: SearchHubsRequest = {
      context: makeRequestContext(input.actorId || "anonymous"),
      query: input.query || "",
      sort: (input.sort || HubSearchSort.HUB_SEARCH_SORT_TRENDING) as HubSearchSort,
      tags: input.tags || [],
      language: input.language ?? "",
      region: input.region ?? "",
      nsfwFilter: (input.nsfwFilter || NsfwFilter.NSFW_FILTER_SFW_ONLY) as NsfwFilter,
      limit: input.limit || 24,
      cursor: input.cursor ?? "",
    };
    return invokeUnary<SearchHubsRequest, SearchHubsResponse>(
      clients.hubClient.searchHubs.bind(clients.hubClient),
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
      clients.hubClient.getPopularTags.bind(clients.hubClient),
      request,
    );
  },

  async upvoteHub(hubId: string, actorId: string, idempotencyKey: string): Promise<{ totalUpvotes: number; upvoted: boolean }> {
    if (!idempotencyKey) throw new Error("idempotencyKey is required for HubService.UpvoteHub");
    const clients = getServiceClients();
    const response = await invokeUnary<UpvoteHubRequest, UpvoteHubResponse>(clients.hubClient.upvoteHub.bind(clients.hubClient), {
      context: makeRequestContext(actorId, true, idempotencyKey),
      hubId,
      operationId: idempotencyKey,
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
      updateMask: input.updateMask,
      expectedVersion: input.expectedVersion,
      operationId: input.idempotencyKey,
    };
    const response = await invokeUnary<PatchHubRequest, ProtoHub>(clients.hubClient.patchHub.bind(clients.hubClient), request);
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
    const response = await invokeUnary<LockdownHubRequest, ProtoHub>(clients.hubClient.lockdownHub.bind(clients.hubClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      locked: input.locked,
      reason: input.reason,
      expectedVersion: input.expectedVersion,
      operationId: input.idempotencyKey,
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
    const response = await invokeUnary<TransferHubOwnershipRequest, ProtoHub>(clients.hubClient.transferOwnership.bind(clients.hubClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      newOwnerId: input.newOwnerId,
      expectedVersion: input.expectedVersion,
      operationId: input.idempotencyKey,
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
    await invokeUnary<DeleteHubRequest, EmptyResponse>(clients.hubClient.deleteHub.bind(clients.hubClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      hubId: input.hubId,
      confirmationName: input.confirmationName,
      expectedVersion: input.expectedVersion,
      operationId: input.idempotencyKey,
    });
  },
};
