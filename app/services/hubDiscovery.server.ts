import type {
  HubDiscoveryQueryInput,
  QuickConnectInput,
} from "~/schemas/hubDiscovery";
import type {
  HubPublicResource,
  HubSearchResult,
  HubTagResource,
} from "~/resources/hubDiscovery";
import type { HubDirectoryItem, HubTag } from "~/generated/control/v1/static";
import { HubSearchSort, NsfwFilter } from "~/generated/control/v1/static";
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
      cursor: requestedCursor,
      limit = 24,
    } = input;

    const sortMap: Record<string, HubSearchSort> = {
      trending: HubSearchSort.HUB_SEARCH_SORT_TRENDING,
      popular: HubSearchSort.HUB_SEARCH_SORT_POPULAR,
      upvotes: HubSearchSort.HUB_SEARCH_SORT_UPVOTES,
      rating: HubSearchSort.HUB_SEARCH_SORT_RATING,
      active: HubSearchSort.HUB_SEARCH_SORT_ACTIVE,
      newest: HubSearchSort.HUB_SEARCH_SORT_NEWEST,
    };

    const searchPage = (cursor?: string) => controlHubService.searchHubs({
      query: search,
      sort: sortMap[sort] || HubSearchSort.HUB_SEARCH_SORT_TRENDING,
      tags,
      language: language !== "ALL" ? language : undefined,
      region: region !== "ALL" ? region : undefined,
      nsfwFilter: nsfw ? NsfwFilter.NSFW_FILTER_ALL : NsfwFilter.NSFW_FILTER_SFW_ONLY,
      limit,
      cursor,
      actorId: userId,
    });

    // Page-number links predate the cursor-based Control API. Walk the
    // cursor chain for those links so page 2+ never repeats page 1. New
    // callers can pass the returned nextCursor directly.
    let res = await searchPage(requestedCursor);
    for (let currentPage = 1; currentPage < page && res.nextCursor; currentPage += 1) {
      res = await searchPage(res.nextCursor);
    }

    const items = (res.hubs || []).map(directoryHubToResource);

    const totalItems = res.totalCount || items.length;

    return {
      items,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit) || 1,
        nextCursor: res.nextCursor || undefined,
      },
    };
  },

  /**
   * Get featured hubs via Control Plane.
   */
  async getFeaturedHubs(): Promise<HubPublicResource[]> {
    const res = await controlHubService.searchHubs({
      sort: HubSearchSort.HUB_SEARCH_SORT_POPULAR,
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
    hubId: string,
    idempotencyKey: string,
  ): Promise<{ success: boolean; error?: string; upvoteCount?: number; nextVoteAvailableAt?: string }> {
    try {
      const res = await controlHubService.upvoteHub(hubId, userId, idempotencyKey);
      return {
        success: true,
        upvoteCount: res.totalUpvotes,
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: "This Hub could not be upvoted right now. Please try again shortly.",
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
        idempotencyKey: input.idempotencyKey,
      });
      return { success: true };
    } catch (error: unknown) {
      console.error("Failed to quick connect via control plane", error);
      // Control errors may contain internal IDs or dependency details. Keep
      // those in server logs only; the browser gets a stable, actionable
      // message and can retry without exposing implementation details.
      return {
        success: false,
        error: "This connection could not be created right now. Please check your server and try again.",
      };
    }
  },
};
