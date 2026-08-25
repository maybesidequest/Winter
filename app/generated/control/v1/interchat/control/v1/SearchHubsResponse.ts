// Original file: ../interchat-protobuf/control/v1/hub_service.proto

import type { HubDirectoryItem as _interchat_control_v1_HubDirectoryItem, HubDirectoryItem__Output as _interchat_control_v1_HubDirectoryItem__Output } from '../../../interchat/control/v1/HubDirectoryItem';

export interface SearchHubsResponse {
  'hubs'?: (_interchat_control_v1_HubDirectoryItem)[];
  'nextCursor'?: (string);
  'totalCount'?: (number);
}

export interface SearchHubsResponse__Output {
  'hubs': (_interchat_control_v1_HubDirectoryItem__Output)[];
  'nextCursor': (string);
  'totalCount': (number);
}
