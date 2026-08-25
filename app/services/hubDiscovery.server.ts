import type {
  HubDiscoveryQueryInput,
  QuickConnectInput,
} from "~/schemas/hubDiscovery";
import type {
  HubPublicResource,
  HubSearchResult,
  HubTagResource,
} from "~/resources/hubDiscovery";
import { controlConnectionService, controlHubService } from "~/services/control.server";

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

    const sortMap: Record<string, string> = {
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
      nsfwFilter: nsfw ? "NSFW_FILTER_ALL" : "NSFW_FILTER_SFW_ONLY",
      limit,
      actorId: userId,
    });

    const items: HubPublicResource[] = res.hubs.map((h: any) => ({
      metadata: {
        id: h.id,
        name: h.name,
        createdAt: h.createdAt || new Date().toISOString(),
        updatedAt: h.updatedAt || null,
      },
      spec: {
        name: h.name,
        shortDescription: h.shortDescription || null,
        description: h.shortDescription || h.name,
        visibility: "PUBLIC",
        language: h.language || "en",
        region: h.region || "us",
        iconUrl: h.iconUrl || null,
        bannerUrl: h.bannerUrl || null,
        nsfw: h.nsfw ?? false,
        rules: [],
      },
      status: {
        verified: h.verified ?? false,
        partnered: h.partnered ?? false,
        featured: h.featured ?? false,
        connectionCount: h.connectionCount || 0,
        weeklyMessageCount: 0,
        averageRating: h.averageRating || 0,
        reviewCount: 0,
        upvoteCount: h.upvoteCount || 0,
        monthlyUpvotes: 0,
        activityLevel: (h.activityLevel as any) || "LOW",
        trendingScore: 0,
        messagesLast24h: 0,
        activeUsersLast24h: 0,
        newConnectionsLast7d: 0,
        memberGrowthRate: 0,
      },
      tags: (h.tags || []).map((t: any) => ({
        id: t.id || t.name,
        name: t.name,
        category: t.category || "General",
        color: t.color || "#8175ee",
        usageCount: t.usageCount || 0,
      })),
    }));

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
    return res.hubs.map((h: any) => ({
      metadata: {
        id: h.id,
        name: h.name,
        createdAt: h.createdAt || new Date().toISOString(),
        updatedAt: h.updatedAt || null,
      },
      spec: {
        name: h.name,
        shortDescription: h.shortDescription || null,
        description: h.shortDescription || h.name,
        visibility: "PUBLIC",
        language: h.language || "en",
        region: h.region || "us",
        iconUrl: h.iconUrl || null,
        bannerUrl: h.bannerUrl || null,
        nsfw: h.nsfw ?? false,
        rules: [],
      },
      status: {
        verified: h.verified ?? false,
        partnered: h.partnered ?? false,
        featured: true,
        connectionCount: h.connectionCount || 0,
        weeklyMessageCount: 0,
        averageRating: h.averageRating || 0,
        reviewCount: 0,
        upvoteCount: h.upvoteCount || 0,
        monthlyUpvotes: 0,
        activityLevel: (h.activityLevel as any) || "LOW",
        trendingScore: 0,
        messagesLast24h: 0,
        activeUsersLast24h: 0,
        newConnectionsLast7d: 0,
        memberGrowthRate: 0,
      },
      tags: [],
    }));
  },

  /**
   * Get popular category and community tags for search filters via Control Plane.
   */
  async getPopularTags(limit = 25): Promise<HubTagResource[]> {
    const res = await controlHubService.getPopularTags(limit);
    return res.tags.map((t: any) => ({
      id: t.id,
      name: t.name,
      category: t.category,
      color: t.color,
      usageCount: t.usageCount,
    }));
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
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to submit upvote.",
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
