export type ServerResource = {
  metadata: { id: string; name: string; iconUrl: string | null };
  spec: {
    hideServerName: boolean;
    pingOnMatch: boolean;
    autoRequeueOnSkip: boolean;
    autoRequeueOnHangup: boolean;
    filterNsfw: boolean;
    lobbyChannelIds: string[];
  };
  status: { botInstalled: boolean; manageable: boolean; callCount: number; messageCount: number };
};

export type DiscordChannelResource = {
  id: string;
  name: string;
  type: number;
  canCreateWebhook: boolean;
};

export type ServerBridgeResource = {
  id: string;
  channelId: string;
  channelName: string | null;
  hubId: string;
  hubName: string;
  hubIconUrl: string | null;
  connected: boolean;
  pausedByBot: boolean;
  pauseReason: string | null;
  createdAt: string;
};

export type ServerBlockResource = {
  id: string;
  targetType: "user" | "server";
  targetId: string;
  targetName?: string;
  createdAt: string;
};

