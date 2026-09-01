export type BaseResourceMetadata = {
  id: string;
  name?: string;
  createdAt: string | null;
  updatedAt: string | null;
};
export type HubConnectionSpec = {
  channelId: string;
  serverId: string;
  connected: boolean;
  pausedByBot: boolean;
};

export type HubConnectionStatus = {
  serverName: string | null;
  channelName: string | null;
  lastActive: string | null;
  healthy: boolean;
  statusMessage: string | null;
  latestOperationId: string | null;
};

export type HubConnectionResource = {
  metadata: BaseResourceMetadata;
  spec: HubConnectionSpec;
  status: HubConnectionStatus;
  version: number;
};
