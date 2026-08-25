// Original file: ../interchat-protobuf/control/v1/models.proto

import type { HubVisibility as _interchat_control_v1_HubVisibility, HubVisibility__Output as _interchat_control_v1_HubVisibility__Output } from '../../../interchat/control/v1/HubVisibility';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';
import type { Long } from '@grpc/proto-loader';

export interface ManagedHubSummary {
  'id'?: (string);
  'name'?: (string);
  'shortDescription'?: (string);
  'iconUrl'?: (string);
  'ownerId'?: (string);
  'visibility'?: (_interchat_control_v1_HubVisibility);
  'locked'?: (boolean);
  'nsfw'?: (boolean);
  'effectiveRole'?: (string);
  'permissions'?: ({[key: string]: boolean});
  'connectionCount'?: (number);
  'weeklyMessageCount'?: (number | string | Long);
  'createdAt'?: (_google_protobuf_Timestamp | null);
  'updatedAt'?: (_google_protobuf_Timestamp | null);
  'authzVersion'?: (number | string | Long);
}

export interface ManagedHubSummary__Output {
  'id': (string);
  'name': (string);
  'shortDescription': (string);
  'iconUrl': (string);
  'ownerId': (string);
  'visibility': (_interchat_control_v1_HubVisibility__Output);
  'locked': (boolean);
  'nsfw': (boolean);
  'effectiveRole': (string);
  'permissions': ({[key: string]: boolean});
  'connectionCount': (number);
  'weeklyMessageCount': (number);
  'createdAt': (_google_protobuf_Timestamp__Output | null);
  'updatedAt': (_google_protobuf_Timestamp__Output | null);
  'authzVersion': (number);
}
