export type ServerResource = {
  metadata: { id: string; name: string; iconUrl: string | null; ownerId?: string; bannerUrl?: string | null };
  spec: {
    bannerUrl?: string | null;
    prefix?: string | null;
    hideServerName: boolean;
    pingOnMatch: boolean;
    autoRequeueOnSkip: boolean;
    autoRequeueOnHangup: boolean;
    filterNsfw: boolean;
    lobbyChannelIds: string[];
  };
  /** Observed integration state. Counts are intentionally not included until backed by Control Plane data. */
  status: { botInstalled: boolean; manageable: boolean; botPermissions?: number; connectionCount?: number; activeCall?: boolean };
  version?: number;
};

export type DiscordChannelResource = {
  id: string;
  name: string;
  type: number;
  actorPermissions: number;
  botPermissions: number;
  connectable: boolean;
  rejectionReason: string | null;
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
  createdAt: string | null;
  version: number;
  webhookProvisioned: boolean;
};

export type ServerBlockResource = {
  id: string;
  targetType: "user" | "server";
  targetId: string;
  reason: string;
  authorId: string;
  targetName?: string;
  createdAt: string | null;
};
