import { redis } from "~/redis.server";
import { permissionService } from "~/services/permission.server";
import { controlUserService, type UserProfile, type UserPreferences, type UserActivity, type UserLeaderboard } from "~/services/control.server";
import type {
  UserResource,
  SupportedLocale,
} from "~/resources/user";
import type {
  PatchUserPreferencesInput,
  PatchDashboardPreferencesInput,
} from "~/schemas/user";
import { boundedDashboardPreferenceSchema, type DashboardPreference } from "~/schemas/dashboardPreferences";

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
  async getActivity(userId: string, options?: { year?: number; month?: number; limit?: number }): Promise<UserActivity> {
    return controlUserService.getUserActivity(userId, userId, options);
  },

  async getLeaderboard(
    userId: string,
    kind: "LEADERBOARD_KIND_MESSAGES" | "LEADERBOARD_KIND_CALLS" | "LEADERBOARD_KIND_VOTES" | "LEADERBOARD_KIND_STREAKS" | "LEADERBOARD_KIND_SERVERS",
    limit = 20,
    offset = 0,
  ): Promise<UserLeaderboard> {
    return controlUserService.getLeaderboard({ actorId: userId, kind, limit, offset });
  },

  async submitFeedback(userId: string, category: string, message: string, idempotencyKey: string) {
    return controlUserService.submitFeedback({ actorId: userId, category, message, idempotencyKey });
  },

  async getInbox(userId: string) {
    return controlUserService.getUserInbox(userId);
  },

  async getProfile(userId: string) {
    return controlUserService.getUserProfile(userId, userId);
  },

  async acknowledgeInbox(userId: string, itemId: string, idempotencyKey: string) {
    return controlUserService.acknowledgeInboxItem({ actorId: userId, itemId, idempotencyKey });
  },
  async getDashboardPreference(userId: string): Promise<Record<string, any> | null> {
    try {
      const val = await redis.get(`user:dashboard_preference:${userId}`);
      if (val) return JSON.parse(val);
    } catch (err) {
      console.warn("Failed to get dashboard preference from redis", err);
    }
    return null;
  },

  async updateDashboardPreference(userId: string, preference: DashboardPreference): Promise<{ success: boolean }> {
    try {
      const existing = (await this.getDashboardPreference(userId)) || {};
      const updated = boundedDashboardPreferenceSchema.parse({ ...existing, ...preference });
      await redis.set(`user:dashboard_preference:${userId}`, JSON.stringify(updated));
      return { success: true };
    } catch (error) {
      console.error("Failed to update dashboard preference", error);
      return { success: false };
    }
  },

  async getUserResource(userId: string): Promise<UserResource> {
    const [profile, prefs, activity] = await Promise.all([
      controlUserService.getUserProfile(userId, userId),
      controlUserService.getUserPreferences(userId),
      controlUserService.getUserActivity(userId, userId),
    ]);

    // An Iris outage is not an authorization denial. Let the failure reach
    // the route so the UI can render an unavailable state instead of silently
    // treating a staff member as an ordinary user.
    const isStaff = await permissionService.checkIsStaff(userId);
    const dashboardPrefs = (await this.getDashboardPreference(userId)) || {};

    return {
      metadata: {
        id: userId,
        name: profile?.displayName || profile?.username || null,
        image: profile?.avatarUrl || null,
        email: null,
        createdAt: profile.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      spec: {
        locale: prefs?.language || "en",
        showBadges: prefs?.badgeVisibility ?? true,
        mentionOnReply: prefs?.replyMention ?? true,
        showNsfwHubs: false,
        voteRemindersEnabled: prefs?.voteReminders ?? true,
        streaksEnabled: prefs?.streaksEnabled ?? true,
        activityLevel: null,
        theme: dashboardPrefs.theme ?? "system",
        compactMode: dashboardPrefs.compactMode ?? false,
        reducedMotion: dashboardPrefs.reducedMotion ?? false,
        soundAlerts: dashboardPrefs.soundAlerts ?? true,
      },
      status: {
        isStaff,
        messageCount: activity.lifetimeMessages,
        callCount: activity.completedCalls,
        hubJoinCount: activity.activeHubCount,
        currentStreak: activity.currentStreak,
        longestStreak: activity.longestStreak,
        streakFreezes: activity.streakFreezes,
        lastStreakDate: null,
        hubsCount: activity.activeHubCount,
        customerId: null,
      },
    };
  },

  async patchUserPreferences(
    userId: string,
    input: PatchUserPreferencesInput
  ): Promise<{ success: boolean }> {
    try {
      // The protobuf preference fields are scalar values, so an omitted field
      // is indistinguishable from `false` once it reaches the Python service.
      // Read the canonical record first and send a complete snapshot to keep a
      // single-toggle dashboard edit from resetting the other preferences.
      const current = await controlUserService.getUserPreferences(userId);
      await controlUserService.patchUserPreferences({
        actorId: userId,
        preferences: {
          language: input.locale ?? current.language,
          badgeVisibility: input.showBadges ?? current.badgeVisibility,
          replyMention: input.mentionOnReply ?? current.replyMention,
          streakReminders: current.streakReminders,
          voteReminders: input.voteRemindersEnabled ?? current.voteReminders,
          streaksEnabled: input.streaksEnabled ?? current.streaksEnabled,
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
      streaksEnabled: res.spec.streaksEnabled,
      showBadges: res.spec.showBadges,
      dashboardPreference: {
        theme: res.spec.theme,
        compactMode: res.spec.compactMode,
        reducedMotion: res.spec.reducedMotion,
        soundAlerts: res.spec.soundAlerts,
      },
    };
  },

  async updateUserPreferences(
    userId: string,
    input: PatchUserPreferencesInput & { dashboardPreference?: DashboardPreference }
  ) {
    const patchRes = await this.patchUserPreferences(userId, {
      locale: input.locale,
      showBadges: input.showBadges,
      mentionOnReply: input.mentionOnReply,
      showNsfwHubs: input.showNsfwHubs,
      voteRemindersEnabled: input.voteRemindersEnabled,
      streaksEnabled: input.streaksEnabled,
    });
    if (input.dashboardPreference) {
      await this.updateDashboardPreference(userId, input.dashboardPreference);
    }
    return patchRes;
  },
};
