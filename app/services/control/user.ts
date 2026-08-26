import type { UserProfile__Output } from "~/generated/control/v1/interchat/control/v1/UserProfile";
import type { UserPreferences__Output } from "~/generated/control/v1/interchat/control/v1/UserPreferences";
import type { UserInboxItem__Output } from "~/generated/control/v1/interchat/control/v1/UserInboxItem";
import type { UserInboxResponse__Output } from "~/generated/control/v1/interchat/control/v1/UserInboxResponse";
import type { RecordVoteResponse__Output } from "~/generated/control/v1/interchat/control/v1/RecordVoteResponse";
import type { VoteProvider } from "~/generated/control/v1/interchat/control/v1/VoteProvider";
import type { GetUserProfileRequest } from "~/generated/control/v1/interchat/control/v1/GetUserProfileRequest";
import type { GetUserInboxRequest } from "~/generated/control/v1/interchat/control/v1/GetUserInboxRequest";
import type { PatchUserPreferencesRequest } from "~/generated/control/v1/interchat/control/v1/PatchUserPreferencesRequest";
import type { AcknowledgeInboxItemRequest } from "~/generated/control/v1/interchat/control/v1/AcknowledgeInboxItemRequest";
import type { SyncDiscordIdentityRequest } from "~/generated/control/v1/interchat/control/v1/SyncDiscordIdentityRequest";
import type { RecordVoteRequest } from "~/generated/control/v1/interchat/control/v1/RecordVoteRequest";
import type { RequestContext } from "~/generated/control/v1/interchat/control/v1/RequestContext";
import type { EmptyResponse__Output } from "~/generated/control/v1/interchat/control/v1/EmptyResponse";
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

function timestamp(value: { seconds?: number; nanos?: number } | null | undefined): string | undefined {
  if (!value) return undefined;
  return new Date((value.seconds || 0) * 1000 + (value.nanos || 0) / 1_000_000).toISOString();
}

function toProfile(value: UserProfile__Output): UserProfile {
  return { id: value.id, username: value.username, displayName: value.displayName, avatarUrl: value.avatarUrl, streakDays: value.streakDays, totalRelayedMessages: value.totalRelayedMessages, createdAt: timestamp(value.createdAt) };
}

function toPreferences(value: UserPreferences__Output): UserPreferences {
  return { userId: value.userId, language: value.language, replyMention: value.replyMention, badgeVisibility: value.badgeVisibility, streakReminders: value.streakReminders, voteReminders: value.voteReminders };
}

function toInboxItem(value: UserInboxItem__Output): UserInboxItem {
  return { id: value.id, userId: value.userId, kind: value.kind, title: value.title, body: value.body, actionUrl: value.actionUrl, read: value.read, createdAt: timestamp(value.createdAt) };
}

export const userService = {
  async getUserProfile(userId: string, actorId: string): Promise<UserProfile> {
    const clients = getServiceClients();
    const response = await invokeUnary<GetUserProfileRequest, UserProfile__Output>(clients.userClient.GetUserProfile.bind(clients.userClient), {
      context: makeRequestContext(actorId),
      userId,
    });
    return toProfile(response);
  },

  async getUserPreferences(actorId: string): Promise<UserPreferences> {
    const clients = getServiceClients();
    const response = await invokeUnary<RequestContext, UserPreferences__Output>(clients.userClient.GetUserPreferences.bind(clients.userClient), makeRequestContext(actorId));
    return toPreferences(response);
  },

  async patchUserPreferences(input: {
    actorId: string;
    preferences: Partial<UserPreferences>;
    idempotencyKey: string;
  }): Promise<UserPreferences> {
    const clients = getServiceClients();
    const response = await invokeUnary<PatchUserPreferencesRequest, UserPreferences__Output>(clients.userClient.PatchUserPreferences.bind(clients.userClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      preferences: {
        userId: input.actorId,
        ...input.preferences,
      },
    });
    return toPreferences(response);
  },

  async getUserInbox(actorId: string): Promise<UserInboxItem[]> {
    const clients = getServiceClients();
    const res = await invokeUnary<GetUserInboxRequest, UserInboxResponse__Output>(
      clients.userClient.GetUserInbox.bind(clients.userClient),
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
    await invokeUnary<AcknowledgeInboxItemRequest, EmptyResponse__Output>(clients.userClient.AcknowledgeInboxItem.bind(clients.userClient), {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      itemId: input.itemId,
    });
  },

  async syncDiscordIdentity(input: {
    discordUserId: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
  }): Promise<UserProfile> {
    const clients = getServiceClients();
    const response = await invokeUnary<SyncDiscordIdentityRequest, UserProfile__Output>(clients.userClient.SyncDiscordIdentity.bind(clients.userClient), {
      context: makeRequestContext(input.discordUserId, true, crypto.randomUUID(), "ACTOR_TYPE_SERVICE"),
      discordUserId: input.discordUserId,
      username: input.username,
      displayName: input.displayName,
      avatarUrl: input.avatarUrl || "",
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
    const response = await invokeUnary<RecordVoteRequest, RecordVoteResponse__Output>(clients.userClient.RecordVote.bind(clients.userClient), {
      context: makeRequestContext("interchat-winter-webhook"),
      provider: `VOTE_PROVIDER_${input.provider.replace(/^VOTE_PROVIDER_/, "")}` as VoteProvider,
      rawPayload: input.rawPayload,
      signature: input.signature,
      signatureTimestamp: input.signatureTimestamp || "",
    });
    return { userId: response.userId, totalVotes: response.totalVotes, currentStreak: response.currentStreak, longestStreak: response.longestStreak, streakExtended: response.streakExtended, isDuplicate: response.isDuplicate, recordedAt: timestamp(response.recordedAt) };
  },
};
