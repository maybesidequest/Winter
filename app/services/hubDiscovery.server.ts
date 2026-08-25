import { db } from "~/db.server";
import {
  hub,
  hubActivityMetrics,
  hubUpvote,
  hubToTag,
  tag,
  connection,
  userStats,
  serverData,
} from "../../drizzle/schema";
import {
  eq,
  and,
  or,
  ilike,
  inArray,
  sql,
  desc,
  asc,
  type SQL,
} from "drizzle-orm";
import type {
  HubDiscoveryQueryInput,
  QuickConnectInput,
} from "~/schemas/hubDiscovery";
import type {
  HubPublicResource,
  HubSearchResult,
  HubTagResource,
} from "~/resources/hubDiscovery";
import { serverService } from "~/services/server.server";
import { controlConnectionService } from "~/services/control.server";

export const hubDiscoveryService = {
  /**
   * Search, filter, and rank public hubs with Top.gg-style algorithms.
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

    const offset = (page - 1) * limit;

    // 1. Base safety and visibility boundary
    const conditions: SQL[] = [
      eq(hub.visibility, "PUBLIC"),
      eq(hub.locked, false),
    ];

    if (!nsfw) {
      conditions.push(eq(hub.nsfw, false));
    }

    if (language && language !== "ALL") {
      conditions.push(eq(hub.language, language));
    }

    if (region && region !== "ALL") {
      conditions.push(eq(hub.region, region));
    }

    // 2. Full-text search (Name, Description, Short Description)
    if (search && search.trim().length > 0) {
      const term = `%${search.trim()}%`;
      conditions.push(
        or(
          ilike(hub.name, term),
          ilike(hub.shortDescription, term),
          ilike(hub.description, term)
        )!
      );
    }

    // 3. Multi-tag filtering via _HubToTag join
    if (tags.length > 0) {
      const tagMatchSubquery = db
        .select({ hubId: hubToTag.a })
        .from(hubToTag)
        .innerJoin(tag, eq(hubToTag.b, tag.id))
        .where(inArray(tag.name, tags))
        .groupBy(hubToTag.a)
        .having(sql`COUNT(DISTINCT ${tag.name}) >= 1`);

      conditions.push(inArray(hub.id, tagMatchSubquery));
    }

    // 4. Monthly Upvotes Subquery for Top.gg leaderboard view
    const monthlyVotesSubquery = db
      .select({
        hubId: hubUpvote.hubId,
        monthlyVoteCount: sql<number>`COUNT(${hubUpvote.id})`.as("monthlyVoteCount"),
      })
      .from(hubUpvote)
      .where(sql`${hubUpvote.createdAt} >= date_trunc('month', NOW())`)
      .groupBy(hubUpvote.hubId)
      .as("monthly_upvotes");

    // 5. Dynamic ORDER BY selection
    let orderByClauses: SQL[];
    const isMetricsFresh = sql`${hubActivityMetrics.lastUpdated} >= NOW() - INTERVAL '2 hours'`;

    switch (sort) {
      case "upvotes":
        orderByClauses = [
          desc(sql`COALESCE(${monthlyVotesSubquery.monthlyVoteCount}, 0)`),
          desc(hub.upvoteCount),
          desc(hub.connectionCount),
          desc(hub.lastActive),
          asc(hub.id),
        ];
        break;

      case "rating":
        // Bayesian Weighted Rating: (v * R + m * C) / (v + m)
        // v = reviewCount, R = averageRating, m = 5, C = 3.5 (global prior mean)
        orderByClauses = [
          desc(sql`
            CASE 
              WHEN ${hub.reviewCount} > 0 THEN
                ((${hub.reviewCount}::float * ${hub.averageRating}::float) + (5.0 * 3.5)) 
                / (${hub.reviewCount}::float + 5.0)
              ELSE 0.0
            END
          `),
          desc(hub.reviewCount),
          desc(hub.weeklyMessageCount),
          desc(hub.lastActive),
          asc(hub.id),
        ];
        break;

      case "active":
        // 24h chatterbox throughput
        orderByClauses = [
          desc(sql`
            CASE
              WHEN ${isMetricsFresh} THEN
                (${hubActivityMetrics.messagesLast24h}::float * 0.7) + (${hubActivityMetrics.activeUsersLast24h}::float * 3.0)
              ELSE (${hub.weeklyMessageCount}::float / 7.0)
            END
          `),
          desc(sql`CASE WHEN ${isMetricsFresh} THEN ${hubActivityMetrics.messagesLast24h} ELSE 0 END`),
          desc(hub.lastActive),
          asc(hub.id),
        ];
        break;

      case "growing":
        // 7d rising stars connection growth
        orderByClauses = [
          desc(sql`
            CASE
              WHEN ${isMetricsFresh} THEN
                (COALESCE(${hubActivityMetrics.memberGrowthRate}, 0.0) * 0.4) + (${hubActivityMetrics.newConnectionsLast7d}::float * 10.0)
              ELSE 0.0
            END
          `),
          desc(sql`CASE WHEN ${isMetricsFresh} THEN ${hubActivityMetrics.newConnectionsLast7d} ELSE 0 END`),
          desc(hub.connectionCount),
          desc(hub.lastActive),
          asc(hub.id),
        ];
        break;

      case "popular":
        orderByClauses = [
          desc(hub.connectionCount),
          desc(hub.weeklyMessageCount),
          desc(hub.lastActive),
          asc(hub.id),
        ];
        break;

      case "newest":
        orderByClauses = [
          desc(hub.createdAt),
          desc(hub.id),
        ];
        break;

      case "trending":
      default:
        // Velocity score combining trending metrics with logarithmic fallback
        orderByClauses = [
          desc(sql`
            CASE 
              WHEN ${isMetricsFresh} 
              THEN COALESCE(${hubActivityMetrics.trendingScore}, 0.0)
              ELSE (${hub.weeklyMessageCount}::float / 7.0) * LN(1.0 + GREATEST(${hub.connectionCount}, 1)::float)
            END
          `),
          desc(sql`CASE WHEN ${isMetricsFresh} THEN ${hubActivityMetrics.messagesLast7d} ELSE ${hub.weeklyMessageCount} END`),
          desc(hub.connectionCount),
          desc(hub.lastActive),
          asc(hub.id),
        ];
        break;
    }

    // 6. Base query assembly
    const baseQuery = db
      .select({
        hub: hub,
        metrics: hubActivityMetrics,
        monthlyVotes: sort === "upvotes" ? monthlyVotesSubquery.monthlyVoteCount : sql<number>`0`,
      })
      .from(hub)
      .leftJoin(hubActivityMetrics, eq(hub.id, hubActivityMetrics.hubId))
      .where(and(...conditions));

    if (sort === "upvotes") {
      baseQuery.leftJoin(monthlyVotesSubquery, eq(hub.id, monthlyVotesSubquery.hubId));
    }

    const [results, [{ totalCount }]] = await Promise.all([
      baseQuery
        .orderBy(...orderByClauses)
        .limit(limit)
        .offset(offset),
      db
        .select({ totalCount: sql<number>`COUNT(${hub.id})` })
        .from(hub)
        .where(and(...conditions)),
    ]);

    // 7. Batch-load tags for fetched Hubs
    const hubIds = results.map((r) => r.hub.id);
    const tagsByHubId = new Map<string, HubTagResource[]>();

    if (hubIds.length > 0) {
      const tagRows = await db
        .select({
          hubId: hubToTag.a,
          tagId: tag.id,
          name: tag.name,
          category: tag.category,
          color: tag.color,
        })
        .from(hubToTag)
        .innerJoin(tag, eq(hubToTag.b, tag.id))
        .where(inArray(hubToTag.a, hubIds));

      for (const row of tagRows) {
        if (!tagsByHubId.has(row.hubId)) {
          tagsByHubId.set(row.hubId, []);
        }
        tagsByHubId.get(row.hubId)!.push({
          id: row.tagId,
          name: row.name,
          category: row.category,
          color: row.color,
        });
      }
    }

    // 8. User vote status check (if logged in)
    const userVotedHubIds = new Set<string>();
    if (userId && hubIds.length > 0) {
      const votes = await db
        .select({ hubId: hubUpvote.hubId })
        .from(hubUpvote)
        .where(
          and(
            eq(hubUpvote.userId, userId),
            inArray(hubUpvote.hubId, hubIds),
            sql`${hubUpvote.createdAt} >= NOW() - INTERVAL '12 hours'`
          )
        );
      for (const v of votes) {
        userVotedHubIds.add(v.hubId);
      }
    }

    // 9. DTO mapping
    const items: HubPublicResource[] = results.map(({ hub: h, metrics, monthlyVotes }) => ({
      metadata: {
        id: h.id,
        name: h.name,
        createdAt: h.createdAt,
        updatedAt: h.updatedAt,
      },
      spec: {
        description: h.description,
        shortDescription: h.shortDescription,
        visibility: h.visibility,
        language: h.language,
        region: h.region,
        iconUrl: h.iconUrl,
        bannerUrl: h.bannerUrl,
        nsfw: h.nsfw,
        rules: h.rules,
      },
      status: {
        verified: h.verified,
        partnered: h.partnered,
        featured: h.featured,
        connectionCount: h.connectionCount,
        weeklyMessageCount: h.weeklyMessageCount,
        averageRating: h.averageRating,
        reviewCount: h.reviewCount,
        upvoteCount: h.upvoteCount,
        monthlyUpvotes: Number(monthlyVotes ?? 0),
        activityLevel: h.activityLevel,
        trendingScore: metrics?.trendingScore ?? 0,
        messagesLast24h: metrics?.messagesLast24h ?? 0,
        activeUsersLast24h: metrics?.activeUsersLast24h ?? 0,
        newConnectionsLast7d: metrics?.newConnectionsLast7d ?? 0,
        memberGrowthRate: metrics?.memberGrowthRate ?? 0,
        hasVotedToday: userVotedHubIds.has(h.id),
      },
      tags: tagsByHubId.get(h.id) ?? [],
    }));

    return {
      items,
      pagination: {
        page,
        limit,
        totalItems: Number(totalCount ?? 0),
        totalPages: Math.ceil(Number(totalCount ?? 0) / limit),
      },
    };
  },

  /**
   * Get featured & spotlight hubs for the hero section.
   */
  async getFeaturedHubs(): Promise<HubPublicResource[]> {
    const rows = await db
      .select({
        hub: hub,
        metrics: hubActivityMetrics,
      })
      .from(hub)
      .leftJoin(hubActivityMetrics, eq(hub.id, hubActivityMetrics.hubId))
      .where(
        and(
          eq(hub.visibility, "PUBLIC"),
          eq(hub.locked, false),
          eq(hub.nsfw, false),
          or(eq(hub.featured, true), eq(hub.verified, true))
        )
      )
      .orderBy(desc(hub.featured), desc(hub.upvoteCount), desc(hub.connectionCount))
      .limit(4);

    const hubIds = rows.map((r) => r.hub.id);
    const tagsByHubId = new Map<string, HubTagResource[]>();

    if (hubIds.length > 0) {
      const tagRows = await db
        .select({
          hubId: hubToTag.a,
          tagId: tag.id,
          name: tag.name,
          category: tag.category,
          color: tag.color,
        })
        .from(hubToTag)
        .innerJoin(tag, eq(hubToTag.b, tag.id))
        .where(inArray(hubToTag.a, hubIds));

      for (const row of tagRows) {
        if (!tagsByHubId.has(row.hubId)) {
          tagsByHubId.set(row.hubId, []);
        }
        tagsByHubId.get(row.hubId)!.push({
          id: row.tagId,
          name: row.name,
          category: row.category,
          color: row.color,
        });
      }
    }

    return rows.map(({ hub: h, metrics }) => ({
      metadata: {
        id: h.id,
        name: h.name,
        createdAt: h.createdAt,
        updatedAt: h.updatedAt,
      },
      spec: {
        description: h.description,
        shortDescription: h.shortDescription,
        visibility: h.visibility,
        language: h.language,
        region: h.region,
        iconUrl: h.iconUrl,
        bannerUrl: h.bannerUrl,
        nsfw: h.nsfw,
        rules: h.rules,
      },
      status: {
        verified: h.verified,
        partnered: h.partnered,
        featured: h.featured,
        connectionCount: h.connectionCount,
        weeklyMessageCount: h.weeklyMessageCount,
        averageRating: h.averageRating,
        reviewCount: h.reviewCount,
        upvoteCount: h.upvoteCount,
        monthlyUpvotes: 0,
        activityLevel: h.activityLevel,
        trendingScore: metrics?.trendingScore ?? 0,
        messagesLast24h: metrics?.messagesLast24h ?? 0,
        activeUsersLast24h: metrics?.activeUsersLast24h ?? 0,
        newConnectionsLast7d: metrics?.newConnectionsLast7d ?? 0,
        memberGrowthRate: metrics?.memberGrowthRate ?? 0,
      },
      tags: tagsByHubId.get(h.id) ?? [],
    }));
  },

  /**
   * Get popular category and community tags for search filters.
   */
  async getPopularTags(limit = 25): Promise<HubTagResource[]> {
    const rows = await db
      .select({
        id: tag.id,
        name: tag.name,
        category: tag.category,
        color: tag.color,
        usageCount: tag.usageCount,
      })
      .from(tag)
      .orderBy(desc(tag.isOfficial), desc(tag.usageCount), asc(tag.name))
      .limit(limit);

    return rows;
  },

  /**
   * Cast an upvote for a hub (12-hour rate limited per user per hub).
   */
  async upvoteHub(
    userId: string,
    hubId: string
  ): Promise<{ success: boolean; error?: string; upvoteCount?: number; nextVoteAvailableAt?: string }> {
    try {
      // 1. Check if user already voted within 12 hours
      const [recentVote] = await db
        .select()
        .from(hubUpvote)
        .where(
          and(
            eq(hubUpvote.userId, userId),
            eq(hubUpvote.hubId, hubId),
            sql`${hubUpvote.createdAt} >= NOW() - INTERVAL '12 hours'`
          )
        )
        .orderBy(desc(hubUpvote.createdAt))
        .limit(1);

      if (recentVote) {
        const nextVoteDate = new Date(new Date(recentVote.createdAt).getTime() + 12 * 60 * 60 * 1000);
        return {
          success: false,
          error: "You can only upvote this hub once every 12 hours.",
          nextVoteAvailableAt: nextVoteDate.toISOString(),
        };
      }

      // 2. Insert vote and update counters
      const voteId = crypto.randomUUID();
      await db.insert(hubUpvote).values({
        id: voteId,
        hubId,
        userId,
      });

      // 3. Increment hub upvoteCount
      const [updatedHub] = await db
        .update(hub)
        .set({
          upvoteCount: sql`${hub.upvoteCount} + 1`,
        })
        .where(eq(hub.id, hubId))
        .returning({ upvoteCount: hub.upvoteCount });

      // 4. Update userStats vote count & streak
      await db
        .insert(userStats)
        .values({
          userId,
          voteCount: 1,
          reputation: 0,
          messageCount: 0,
          callCount: 0,
          hubJoinCount: 0,
          currentStreak: 1,
          longestStreak: 1,
          streakFreezes: 0,
        })
        .onConflictDoUpdate({
          target: userStats.userId,
          set: {
            voteCount: sql`${userStats.voteCount} + 1`,
            updatedAt: sql`NOW()`,
          },
        });

      return {
        success: true,
        upvoteCount: updatedHub?.upvoteCount ?? 0,
      };
    } catch (error) {
      console.error("Failed to upvote hub", error);
      return { success: false, error: "Failed to submit upvote." };
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


