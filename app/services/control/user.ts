import type { UserProfile as ProtoUserProfile } from "~/generated/control/v1/static";
import type { UserActivity as ProtoUserActivity } from "~/generated/control/v1/static";
import type { UserPreferences as ProtoUserPreferences } from "~/generated/control/v1/static";
import type { UserInboxItem as ProtoUserInboxItem } from "~/generated/control/v1/static";
import type { UserInboxResponse } from "~/generated/control/v1/static";
import type { RecordVoteResponse } from "~/generated/control/v1/static";
import type { UserLeaderboard as ProtoUserLeaderboard } from "~/generated/control/v1/static";
import type { FeedbackReceipt } from "~/generated/control/v1/static";
import type { LeaderboardKind } from "~/generated/control/v1/static";
import { ActorType, VoteProvider } from "~/generated/control/v1/static";
import type { GetUserProfileRequest } from "~/generated/control/v1/static";
import type { GetUserActivityRequest } from "~/generated/control/v1/static";
import type { GetUserInboxRequest } from "~/generated/control/v1/static";
import type { PatchUserPreferencesRequest } from "~/generated/control/v1/static";
import type { AcknowledgeInboxItemRequest } from "~/generated/control/v1/static";
import type { SyncDiscordIdentityRequest } from "~/generated/control/v1/static";
import type { RecordVoteRequest } from "~/generated/control/v1/static";
import type { GetLeaderboardRequest } from "~/generated/control/v1/static";
import type { SubmitFeedbackRequest } from "~/generated/control/v1/static";
import type { RequestContext } from "~/generated/control/v1/static";
import type { EmptyResponse } from "~/generated/control/v1/static";
import { getServiceClients, invokeUnary, makeRequestContext } from "./transport";

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  streakDays: number;
  totalRelayedMessages: number;
  createdAt?: string;
}

export interface UserPreferences {
  userId: string;
  language: string;
  replyMention: boolean;
  badgeVisibility: boolean;
  streakReminders: boolean;
  voteReminders: boolean;
  streaksEnabled: boolean;
}

export interface UserActivityHub {
  hubId: string;
  hubName: string;
  iconUrl?: string;
  messageCount: number;
  sharePercent: number;
}

export interface UserActivity {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  streakFreezes: number;
  lifetimeMessages: number;
  messageRank: number;
  activeHubCount: number;
  totalHubMessages: number;
  topHubs: UserActivityHub[];
  completedCalls: number;
  callRank: number;
  showBadges: boolean;
  streaksEnabled: boolean;
  asOf?: string;
}

export interface UserInboxItem {
  id: string;
  userId: string;
  kind: string;
  title: string;
  body: string;
  actionUrl?: string;
  read: boolean;
  createdAt?: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  value: number;
}

export interface UserLeaderboard {
  kind: LeaderboardKind;
  entries: LeaderboardEntry[];
  totalCount: number;
  asOf?: string;
}

function timestamp(value: { seconds?: number; nanos?: number } | null | undefined): string | undefined {
  if (!value) return undefined;
  return new Date((value.seconds || 0) * 1000 + (value.nanos || 0) / 1_000_000).toISOString();
}

function toProfile(value: ProtoUserProfile): UserProfile {
  return { id: value.id, username: value.username, displayName: value.displayName, avatarUrl: value.avatarUrl, streakDays: value.streakDays, totalRelayedMessages: value.totalRelayedMessages, createdAt: timestamp(value.createdAt) };
}

function toActivity(value: ProtoUserActivity): UserActivity {
  return {
    userId: value.userId,
    currentStreak: value.currentStreak,
    longestStreak: value.longestStreak,
    streakFreezes: value.streakFreezes,
    lifetimeMessages: value.lifetimeMessages,
    messageRank: value.messageRank,
    activeHubCount: value.activeHubCount,
    totalHubMessages: value.totalHubMessages,
    topHubs: value.topHubs.map((hub) => ({
      hubId: hub.hubId,
      hubName: hub.hubName,
      iconUrl: hub.iconUrl,
      messageCount: hub.messageCount,
      sharePercent: hub.sharePercent,
    })),
    completedCalls: value.completedCalls,
    callRank: value.callRank,
    showBadges: value.showBadges,
    streaksEnabled: value.streaksEnabled,
    asOf: timestamp(value.asOf),
  };
}

function toPreferences(value: ProtoUserPreferences): UserPreferences {
  return { userId: value.userId, language: value.language, replyMention: value.replyMention, badgeVisibility: value.badgeVisibility, streakReminders: value.streakReminders, voteReminders: value.voteReminders, streaksEnabled: value.streaksEnabled };
}

function toInboxItem(value: ProtoUserInboxItem): UserInboxItem {
  return { id: value.id, userId: value.userId, kind: value.kind, title: value.title, body: value.body, actionUrl: value.actionUrl, read: value.read, createdAt: timestamp(value.createdAt) };
}

export const userService = {
  async getUserProfile(userId: string, actorId: string): Promise<UserProfile> {
    const clients = getServiceClients();
    const response = await invokeUnary<GetUserProfileRequest, ProtoUserProfile>(clients.userClient.getUserProfile.bind(clients.userClient), {
      context: makeRequestContext(actorId),
      userId,
    });
    return toProfile(response);
  },

  async getUserActivity(
    userId: string,
    actorId: string,
    options: { year?: number; month?: number; limit?: number } = {},
  ): Promise<UserActivity> {
    const clients = getServiceClients();
    const response = await invokeUnary<GetUserActivityRequest, ProtoUserActivity>(
      clients.userClient.getUserActivity.bind(clients.userClient),
      {
        context: makeRequestContext(actorId),
        userId,
        year: options.year || 0,
        month: options.month || 0,
        limit: options.limit || 5,
      },
    );
    return toActivity(response);
  },

  async getLeaderboard(input: {
    actorId: string;
    kind: LeaderboardKind;
    limit?: number;
    offset?: number;
  }): Promise<UserLeaderboard> {
    const clients = getServiceClients();
    const response = await invokeUnary<GetLeaderboardRequest, ProtoUserLeaderboard>(
      clients.userClient.getLeaderboard.bind(clients.userClient),
      {
        context: makeRequestContext(input.actorId),
        kind: input.kind,
        limit: input.limit || 20,
        offset: input.offset || 0,
      },
    );
    return {
      kind: response.kind,
      entries: response.entries.map((entry) => ({
        rank: entry.rank,
        userId: entry.userId,
        displayName: entry.displayName || "InterChat user",
        avatarUrl: entry.avatarUrl || undefined,
        value: entry.value,
      })),
      totalCount: response.totalCount,
      asOf: timestamp(response.asOf),
    };
  },

  async submitFeedback(input: {
    actorId: string;
    category: string;
    message: string;
    idempotencyKey: string;
  }): Promise<{ id: string; category: string; submittedAt?: string }> {
    const clients = getServiceClients();
    const response = await invokeUnary<SubmitFeedbackRequest, FeedbackReceipt>(
      clients.userClient.submitFeedback.bind(clients.userClient),
      {
        context: makeRequestContext(input.actorId, true, input.idempotencyKey),
        category: input.category,
        message: input.message,
        operationId: input.idempotencyKey,
      },
    );
    return { id: response.id, category: response.category, submittedAt: timestamp(response.submittedAt) };
  },

  async getUserPreferences(actorId: string): Promise<UserPreferences> {
    const clients = getServiceClients();
    const response = await invokeUnary<RequestContext, ProtoUserPreferences>(clients.userClient.getUserPreferences.bind(clients.userClient), makeRequestContext(actorId));
    return toPreferences(response);
  },

  async patchUserPreferences(input: {
    actorId: string;
    preferences: Partial<UserPreferences>;
    idempotencyKey: string;
  }): Promise<UserPreferences> {
    const clients = getServiceClients();
    const response = await invokeUnary<PatchUserPreferencesRequest, ProtoUserPreferences>(clients.userClient.patchUserPreferences.bind(clients.userClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      preferences: {
        userId: input.actorId,
        language: input.preferences.language ?? "",
        replyMention: input.preferences.replyMention ?? false,
        badgeVisibility: input.preferences.badgeVisibility ?? false,
        streakReminders: input.preferences.streakReminders ?? false,
        voteReminders: input.preferences.voteReminders ?? false,
        streaksEnabled: input.preferences.streaksEnabled ?? false,
      },
      operationId: input.idempotencyKey,
    });
    return toPreferences(response);
  },

  async getUserInbox(actorId: string): Promise<UserInboxItem[]> {
    const clients = getServiceClients();
    const res = await invokeUnary<GetUserInboxRequest, UserInboxResponse>(
      clients.userClient.getUserInbox.bind(clients.userClient),
      {
        context: makeRequestContext(actorId),
      }
    );
    return res.items.map(toInboxItem);
  },

  async acknowledgeInboxItem(input: {
    itemId: string;
    actorId: string;
    idempotencyKey: string;
  }): Promise<void> {
    const clients = getServiceClients();
    await invokeUnary<AcknowledgeInboxItemRequest, EmptyResponse>(clients.userClient.acknowledgeInboxItem.bind(clients.userClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      itemId: input.itemId,
      operationId: input.idempotencyKey,
    });
  },

  async syncDiscordIdentity(input: {
    discordUserId: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
  }): Promise<UserProfile> {
    const clients = getServiceClients();
    const operationId = crypto.randomUUID();
    const response = await invokeUnary<SyncDiscordIdentityRequest, ProtoUserProfile>(clients.userClient.syncDiscordIdentity.bind(clients.userClient), {
      context: makeRequestContext(input.discordUserId, true, operationId, ActorType.ACTOR_TYPE_SERVICE),
      discordUserId: input.discordUserId,
      username: input.username,
      displayName: input.displayName,
      avatarUrl: input.avatarUrl || "",
      operationId,
    });
    return toProfile(response);
  },

  async recordVote(input: {
    provider: string;
    rawPayload: Uint8Array;
    signature: string;
    signatureTimestamp?: string;
  }): Promise<{
    userId: string;
    totalVotes: number;
    currentStreak: number;
    longestStreak: number;
    streakExtended: boolean;
    isDuplicate: boolean;
    recordedAt?: string;
  }> {
    const clients = getServiceClients();
    const payloadBytes = new Uint8Array(input.rawPayload);
    const digest = await crypto.subtle.digest(
      "SHA-256",
      payloadBytes.buffer as ArrayBuffer,
    );
    const payloadHash = Array.from(new Uint8Array(digest), (byte) =>
      byte.toString(16).padStart(2, "0"),
    ).join("");
    const response = await invokeUnary<RecordVoteRequest, RecordVoteResponse>(clients.userClient.recordVote.bind(clients.userClient), {
      context: makeRequestContext(
        "interchat-winter-webhook",
        true,
        `vote:${input.provider}:${payloadHash}`,
        ActorType.ACTOR_TYPE_SERVICE,
      ),
      provider: `VOTE_PROVIDER_${input.provider.replace(/^VOTE_PROVIDER_/, "")}` as VoteProvider,
      rawPayload: input.rawPayload,
      signature: input.signature,
      signatureTimestamp: input.signatureTimestamp || "",
      operationId: `vote:${input.provider}:${payloadHash}`,
    });
    return { userId: response.userId, totalVotes: response.totalVotes, currentStreak: response.currentStreak, longestStreak: response.longestStreak, streakExtended: response.streakExtended, isDuplicate: response.isDuplicate, recordedAt: timestamp(response.recordedAt) };
  },
};
