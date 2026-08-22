import { db } from "../db.server";
import {
  user,
  userStats,
  hub,
  lobby,
  lobbyConnection,
} from "../../drizzle/schema";
import { eq, count, desc, and, ne } from "drizzle-orm";
import { redis } from "../redis.server";
import { permissionService } from "./permission.server";
import type {
  UserResource,
  UserCallRecord,
  SupportedLocale,
} from "../resources/user";
import type {
  PatchUserPreferencesInput,
  PatchDashboardPreferencesInput,
  UserCallHistoryQueryInput,
} from "../schemas/user";

export const SUPPORTED_LOCALES: SupportedLocale[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "tr", name: "Turkish", flag: "🇹🇷" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "zh-CN", name: "Chinese (Simplified)", flag: "🇨🇳" },
  { code: "zh-TW", name: "Chinese (Traditional)", flag: "🇹🇼" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "nl", name: "Dutch", flag: "🇳🇱" },
  { code: "pl", name: "Polish", flag: "🇵🇱" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "sv", name: "Swedish", flag: "🇸🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "th", name: "Thai", flag: "🇹🇭" },
  { code: "vi", name: "Vietnamese", flag: "🇻🇳" },
  { code: "id", name: "Indonesian", flag: "🇮🇩" },
  { code: "ml", name: "Malayalam", flag: "🇮🇳" },
  { code: "uk", name: "Ukrainian", flag: "🇺🇦" },
];

export const userService = {
  async getDashboardPreference(userId: string): Promise<Record<string, any> | null> {
    try {
      const val = await redis.get(`user:dashboard_preference:${userId}`);
      if (val) return JSON.parse(val);
    } catch (err) {
      console.warn("Failed to get dashboard preference from redis", err);
    }
    return null;
  },

  async updateDashboardPreference(userId: string, preference: Record<string, any>): Promise<{ success: boolean }> {
    try {
      const existing = (await this.getDashboardPreference(userId)) || {};
      const updated = { ...existing, ...preference };
      await redis.set(`user:dashboard_preference:${userId}`, JSON.stringify(updated));
      return { success: true };
    } catch (error) {
      console.error("Failed to update dashboard preference", error);
      return { success: false };
    }
  },

  async getUserResource(userId: string): Promise<UserResource> {
    // 1. Fetch user record
    const userRecords = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    const userRecord = userRecords[0];

    // 2. Fetch stats
    const statsRecords = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, userId))
      .limit(1);
    const statsRecord = statsRecords[0];

    // 3. Count owned hubs
    const hubCountRes = await db
      .select({ count: count(hub.id) })
      .from(hub)
      .where(eq(hub.ownerId, userId));
    const hubsCount = hubCountRes[0]?.count ?? 0;

    // 4. Check staff status
    const isStaff = await permissionService.checkIsStaff(userId).catch(() => false);

    // 5. Fetch dashboard preferences from redis
    const dashboardPrefs = (await this.getDashboardPreference(userId)) || {};

    // 6. Count servers linked / managed (via lobby connections or discord)
    const serverCountRes = await db
      .select({ count: count(lobbyConnection.id) })
      .from(lobbyConnection)
      .where(eq(lobbyConnection.invokerUserId, userId));
    const serversCount = serverCountRes[0]?.count ?? 0;

    return {
      metadata: {
        id: userId,
        name: userRecord?.name ?? null,
        image: userRecord?.image ?? null,
        email: userRecord?.email ?? null,
        createdAt: userRecord?.createdAt ?? new Date().toISOString(),
        updatedAt: userRecord?.updatedAt ?? new Date().toISOString(),
      },
      spec: {
        locale: userRecord?.locale ?? "en",
        showBadges: userRecord?.showBadges ?? true,
        mentionOnReply: userRecord?.mentionOnReply ?? true,
        showNsfwHubs: userRecord?.showNsfwHubs ?? false,
        voteRemindersEnabled: userRecord?.voteRemindersEnabled ?? true,
        activityLevel: (userRecord?.activityLevel as any) ?? null,
        theme: dashboardPrefs.theme ?? "system",
        compactMode: dashboardPrefs.compactMode ?? false,
        reducedMotion: dashboardPrefs.reducedMotion ?? false,
        soundAlerts: dashboardPrefs.soundAlerts ?? true,
      },
      status: {
        isStaff,
        badges: (userRecord?.badges as string[]) ?? [],
        reputation: statsRecord?.reputation ?? 0,
        messageCount: statsRecord?.messageCount ?? 0,
        callCount: statsRecord?.callCount ?? 0,
        hubJoinCount: statsRecord?.hubJoinCount ?? 0,
        currentStreak: statsRecord?.currentStreak ?? 0,
        longestStreak: statsRecord?.longestStreak ?? 0,
        streakFreezes: statsRecord?.streakFreezes ?? 0,
        lastStreakDate: statsRecord?.lastStreakDate ?? null,
        lastVoted: userRecord?.lastVoted ?? null,
        voteCount: statsRecord?.voteCount ?? 0,
        hubsCount,
        serversCount,
        customerId: userRecord?.customerId ?? null,
      },
    };
  },

  async patchUserPreferences(
    userId: string,
    input: PatchUserPreferencesInput
  ): Promise<{ success: boolean }> {
    try {
      const dbUpdates: Record<string, any> = {};
      if (input.locale !== undefined) dbUpdates.locale = input.locale;
      if (input.showBadges !== undefined) dbUpdates.showBadges = input.showBadges;
      if (input.mentionOnReply !== undefined) dbUpdates.mentionOnReply = input.mentionOnReply;
      if (input.showNsfwHubs !== undefined) dbUpdates.showNsfwHubs = input.showNsfwHubs;
      if (input.voteRemindersEnabled !== undefined) dbUpdates.voteRemindersEnabled = input.voteRemindersEnabled;
      if (input.activityLevel !== undefined) dbUpdates.activityLevel = input.activityLevel;

      if (Object.keys(dbUpdates).length > 0) {
        dbUpdates.updatedAt = new Date().toISOString();
        await db.update(user).set(dbUpdates).where(eq(user.id, userId));
      }

      return { success: true };
    } catch (error) {
      console.error("Failed to patch user preferences", error);
      return { success: false };
    }
  },

  async patchDashboardPreferences(
    userId: string,
    input: PatchDashboardPreferencesInput
  ): Promise<{ success: boolean }> {
    return this.updateDashboardPreference(userId, input);
  },

  async getCallHistory(
    userId: string,
    options: UserCallHistoryQueryInput
  ): Promise<UserCallRecord[]> {
    try {
      // Find connections invoked by this user
      const userConns = await db
        .select({
          connectionId: lobbyConnection.id,
          lobbyId: lobbyConnection.lobbyId,
          channelId: lobbyConnection.channelId,
          joinedAt: lobbyConnection.joinedAt,
          leftAt: lobbyConnection.leftAt,
          invokerServerName: lobbyConnection.invokerServerName,
          lobbyStatus: lobby.status,
          lobbyMessageCount: lobby.messageCount,
          lobbyCreatedAt: lobby.createdAt,
          lobbyClosedAt: lobby.closedAt,
          lobbyDurationSeconds: lobby.durationSeconds,
        })
        .from(lobbyConnection)
        .innerJoin(lobby, eq(lobbyConnection.lobbyId, lobby.id))
        .where(eq(lobbyConnection.invokerUserId, userId))
        .orderBy(desc(lobby.createdAt))
        .limit(options.limit)
        .offset(options.offset);

      if (userConns.length === 0) return [];

      const records: UserCallRecord[] = [];

      for (const item of userConns) {
        // Query other party connection in the same lobby
        const otherConns = await db
          .select({
            invokerServerName: lobbyConnection.invokerServerName,
            invokerUserId: lobbyConnection.invokerUserId,
            userName: user.name,
          })
          .from(lobbyConnection)
          .leftJoin(user, eq(lobbyConnection.invokerUserId, user.id))
          .where(
            and(
              eq(lobbyConnection.lobbyId, item.lobbyId),
              ne(lobbyConnection.id, item.connectionId)
            )
          )
          .limit(1);

        const other = otherConns[0];
        records.push({
          id: item.lobbyId,
          status: (item.lobbyStatus?.toLowerCase() as any) === "open" ? "open" : "closed",
          messageCount: item.lobbyMessageCount ?? 0,
          durationSeconds: item.lobbyDurationSeconds ?? null,
          createdAt: item.lobbyCreatedAt,
          closedAt: item.lobbyClosedAt,
          otherPartyName: other?.userName || "Anonymous Caller",
          otherPartyServer: other?.invokerServerName || "Connected Server",
          channelId: item.channelId,
        });
      }

      return records;
    } catch (err) {
      console.error("Failed to query user call history", err);
      return [];
    }
  },

  getSupportedLocales(): SupportedLocale[] {
    return SUPPORTED_LOCALES;
  },

  // Retain legacy method for backward compatibility
  async getUserPreferences(userId: string) {
    const res = await this.getUserResource(userId);
    return {
      locale: res.spec.locale,
      mentionOnReply: res.spec.mentionOnReply,
      showNsfwHubs: res.spec.showNsfwHubs,
      voteRemindersEnabled: res.spec.voteRemindersEnabled,
      showBadges: res.spec.showBadges,
      dashboardPreference: {
        theme: res.spec.theme,
        compactMode: res.spec.compactMode,
        reducedMotion: res.spec.reducedMotion,
        soundAlerts: res.spec.soundAlerts,
      },
    };
  },

  async updateUserPreferences(userId: string, input: any) {
    const patchRes = await this.patchUserPreferences(userId, {
      locale: input.locale,
      showBadges: input.showBadges,
      mentionOnReply: input.mentionOnReply,
      showNsfwHubs: input.showNsfwHubs,
      voteRemindersEnabled: input.voteRemindersEnabled,
    });
    if (input.dashboardPreference) {
      await this.patchDashboardPreferences(userId, input.dashboardPreference);
    }
    return patchRes;
  },
};
