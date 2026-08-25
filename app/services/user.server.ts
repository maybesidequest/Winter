import { redis } from "~/redis.server";
import { permissionService } from "~/services/permission.server";
import { controlUserService, type UserProfile, type UserPreferences } from "~/services/control.server";
import type {
  UserResource,
  UserCallRecord,
  SupportedLocale,
} from "~/resources/user";
import type {
  PatchUserPreferencesInput,
  PatchDashboardPreferencesInput,
  UserCallHistoryQueryInput,
} from "~/schemas/user";

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
    let profile: UserProfile | null = null;
    let prefs: UserPreferences | null = null;
    try {
      [profile, prefs] = await Promise.all([
        controlUserService.getUserProfile(userId, userId).catch(() => null),
        controlUserService.getUserPreferences(userId).catch(() => null),
      ]);
    } catch {
      // fallback to defaults
    }

    const isStaff = await permissionService.checkIsStaff(userId).catch(() => false);
    const dashboardPrefs = (await this.getDashboardPreference(userId)) || {};

    return {
      metadata: {
        id: userId,
        name: profile?.displayName || profile?.username || null,
        image: profile?.avatarUrl || null,
        email: null,
        createdAt: profile?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      spec: {
        locale: (prefs?.language as any) || "en",
        showBadges: prefs?.badgeVisibility ?? true,
        mentionOnReply: prefs?.replyMention ?? true,
        showNsfwHubs: false,
        voteRemindersEnabled: prefs?.voteReminders ?? true,
        activityLevel: null,
        theme: dashboardPrefs.theme ?? "system",
        compactMode: dashboardPrefs.compactMode ?? false,
        reducedMotion: dashboardPrefs.reducedMotion ?? false,
        soundAlerts: dashboardPrefs.soundAlerts ?? true,
      },
      status: {
        isStaff,
        badges: [],
        reputation: 0,
        messageCount: profile?.totalRelayedMessages ?? 0,
        callCount: 0,
        hubJoinCount: 0,
        currentStreak: profile?.streakDays ?? 0,
        longestStreak: profile?.streakDays ?? 0,
        streakFreezes: 0,
        lastStreakDate: null,
        lastVoted: null,
        voteCount: 0,
        hubsCount: 0,
        serversCount: 0,
        customerId: null,
      },
    };
  },

  async patchUserPreferences(
    userId: string,
    input: PatchUserPreferencesInput
  ): Promise<{ success: boolean }> {
    try {
      await controlUserService.patchUserPreferences({
        actorId: userId,
        preferences: {
          language: input.locale,
          badgeVisibility: input.showBadges,
          replyMention: input.mentionOnReply,
          voteReminders: input.voteRemindersEnabled,
        },
        idempotencyKey: crypto.randomUUID(),
      });
      return { success: true };
    } catch (error) {
      console.error("Failed to patch user preferences via control plane", error);
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
    return [];
  },


  getSupportedLocales(): SupportedLocale[] {
    return SUPPORTED_LOCALES;
  },

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
