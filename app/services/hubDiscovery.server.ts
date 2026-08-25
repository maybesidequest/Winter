import type {
  HubDiscoveryQueryInput,
  QuickConnectInput,
} from "~/schemas/hubDiscovery";
import type {
  HubPublicResource,
  HubSearchResult,
  HubTagResource,
} from "~/resources/hubDiscovery";
import type { HubDirectoryItem } from "~/generated/control/v1/interchat/control/v1/HubDirectoryItem";
import type { HubTag } from "~/generated/control/v1/interchat/control/v1/HubTag";
import type { HubSearchSort } from "~/generated/control/v1/interchat/control/v1/HubSearchSort";
import type { NsfwFilter } from "~/generated/control/v1/interchat/control/v1/NsfwFilter";
import { controlConnectionService, controlHubService } from "~/services/control.server";

function activityLevel(value: HubDirectoryItem["activityLevel"]): HubPublicResource["status"]["activityLevel"] {
  switch (value) {
    case "HUB_ACTIVITY_LEVEL_HIGH":
      return "HIGH";
    case "HUB_ACTIVITY_LEVEL_MEDIUM":
      return "MEDIUM";
    default:
      return "LOW";
  }
}

function directoryHubToResource(hub: HubDirectoryItem): HubPublicResource {
  const name = hub.name || "Unnamed Hub";
  return {
    metadata: { id: hub.id || "", name },
    spec: {
      shortDescription: hub.shortDescription || null,
      description: null,
      visibility: "PUBLIC",
      language: hub.language || null,
      region: hub.region || null,
      iconUrl: hub.iconUrl || null,
      bannerUrl: hub.bannerUrl || null,
      nsfw: hub.nsfw === true,
    },
    status: {
      verified: hub.verified === true,
      partnered: hub.partnered === true,
      featured: hub.featured === true,
      connectionCount: hub.connectionCount,
      averageRating: hub.averageRating === undefined ? null : Number(hub.averageRating),
      upvoteCount: hub.upvoteCount,
      activityLevel: activityLevel(hub.activityLevel),
    },
    tags: (hub.tags || []).map((name) => ({ id: name, name })),
  };
}

function tagToResource(tag: HubTag): HubTagResource {
  return {
    id: tag.id || tag.name || "",
    name: tag.name || "",
    category: tag.category || null,
    color: tag.color || null,
    usageCount: tag.usageCount,
  };
}

export const hubDiscoveryService = {
  /**
   * Search, filter, and rank public hubs via Control Plane.
   */
  async searchPublicHubs(
    input: HubDiscoveryQueryInput,
    userId?: string
  ): Promise<HubSearchResult> {
    const {
      search,
      sort = "trending",
      tags = [],
      language,
      region,
      nsfw = false,
      page = 1,
      limit = 24,
    } = input;

    const sortMap: Record<string, HubSearchSort> = {
      trending: "HUB_SEARCH_SORT_TRENDING",
      popular: "HUB_SEARCH_SORT_POPULAR",
      upvotes: "HUB_SEARCH_SORT_UPVOTES",
      rating: "HUB_SEARCH_SORT_RATING",
      active: "HUB_SEARCH_SORT_ACTIVE",
      newest: "HUB_SEARCH_SORT_NEWEST",
    };

    const res = await controlHubService.searchHubs({
      query: search,
      sort: sortMap[sort] || "HUB_SEARCH_SORT_TRENDING",
      tags,
      language: language !== "ALL" ? language : undefined,
      region: region !== "ALL" ? region : undefined,
      nsfwFilter: (nsfw ? "NSFW_FILTER_ALL" : "NSFW_FILTER_SFW_ONLY") as NsfwFilter,
      limit,
      actorId: userId,
    });

    const items = (res.hubs || []).map(directoryHubToResource);

    const totalItems = res.totalCount || items.length;

    return {
      items,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit) || 1,
      },
    };
  },

  /**
   * Get featured hubs via Control Plane.
   */
  async getFeaturedHubs(): Promise<HubPublicResource[]> {
    const res = await controlHubService.searchHubs({
      sort: "HUB_SEARCH_SORT_POPULAR",
      limit: 6,
    });
    return (res.hubs || []).map(directoryHubToResource);
  },

  /**
   * Get popular category and community tags for search filters via Control Plane.
   */
  async getPopularTags(limit = 25): Promise<HubTagResource[]> {
    const res = await controlHubService.getPopularTags(limit);
    return (res.tags || []).map(tagToResource);
  },

  /**
   * Cast an upvote for a hub via Control Plane.
   */
  async upvoteHub(
    userId: string,
    hubId: string
  ): Promise<{ success: boolean; error?: string; upvoteCount?: number; nextVoteAvailableAt?: string }> {
    try {
      const res = await controlHubService.upvoteHub(hubId, userId);
      return {
        success: true,
        upvoteCount: res.totalUpvotes,
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to submit upvote.",
      };
    }
  },

  /**
   * Quick-connect a user's manageable Discord server channel to a public Hub.
   */
  async quickConnect(
    userId: string,
    input: QuickConnectInput
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await controlConnectionService.connectChannel({
        actorId: userId,
        hubId: input.hubId,
        serverId: input.serverId,
        channelId: input.channelId,
        inviteCode: input.inviteCode,
        customName: input.customName,
        idempotencyKey: crypto.randomUUID(),
      });
      return { success: true };
    } catch (error: unknown) {
      console.error("Failed to quick connect via control plane", error);
      const msg = error instanceof Error ? error.message : "Failed to connect.";
      return { success: false, error: msg };
    }
  },
};
