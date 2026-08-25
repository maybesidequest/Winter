// Original file: ../interchat-protobuf/control/v1/hub_service.proto

import type { ManagedHubSummary as _interchat_control_v1_ManagedHubSummary, ManagedHubSummary__Output as _interchat_control_v1_ManagedHubSummary__Output } from '../../../interchat/control/v1/ManagedHubSummary';

export interface ListMyHubsResponse {
  'hubs'?: (_interchat_control_v1_ManagedHubSummary)[];
  'nextCursor'?: (string);
  'totalCount'?: (number);
}

export interface ListMyHubsResponse__Output {
  'hubs': (_interchat_control_v1_ManagedHubSummary__Output)[];
  'nextCursor': (string);
  'totalCount': (number);
}
