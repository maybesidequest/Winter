import { getServiceClients, invokeRpc, makeRequestContext } from "./transport";

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

export const userService = {
  async getUserProfile(userId: string, actorId: string): Promise<UserProfile> {
    const clients = getServiceClients();
    return invokeRpc(clients.userClient, "GetUserProfile", {
      context: makeRequestContext(actorId),
      userId,
    });
  },

  async getUserPreferences(actorId: string): Promise<UserPreferences> {
    const clients = getServiceClients();
    return invokeRpc(clients.userClient, "GetUserPreferences", {
      context: makeRequestContext(actorId),
    });
  },

  async patchUserPreferences(input: {
    actorId: string;
    preferences: Partial<UserPreferences>;
    idempotencyKey: string;
  }): Promise<UserPreferences> {
    const clients = getServiceClients();
    return invokeRpc(clients.userClient, "PatchUserPreferences", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      preferences: {
        userId: input.actorId,
        ...input.preferences,
      },
    });
  },

  async getUserInbox(actorId: string): Promise<UserInboxItem[]> {
    const clients = getServiceClients();
    const res = await invokeRpc<{ items?: UserInboxItem[] }>(
      clients.userClient,
      "GetUserInbox",
      {
        context: makeRequestContext(actorId),
      }
    );
    return res.items || [];
  },

  async acknowledgeInboxItem(input: {
    itemId: string;
    actorId: string;
    idempotencyKey: string;
  }): Promise<void> {
    const clients = getServiceClients();
    await invokeRpc(clients.userClient, "AcknowledgeInboxItem", {
      context: makeRequestContext(input.actorId, true, input.idempotencyKey),
      itemId: input.itemId,
    });
  },
};
