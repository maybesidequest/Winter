// Original file: ../interchat-protobuf/control/v1/models.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';

export interface HubInvite {
  'id'?: (string);
  'hubId'?: (string);
  'code'?: (string);
  'creatorId'?: (string);
  'uses'?: (number);
  'maxUses'?: (number);
  'expiresAt'?: (_google_protobuf_Timestamp | null);
  'createdAt'?: (_google_protobuf_Timestamp | null);
}

export interface HubInvite__Output {
  'id': (string);
  'hubId': (string);
  'code': (string);
  'creatorId': (string);
  'uses': (number);
  'maxUses': (number);
  'expiresAt': (_google_protobuf_Timestamp__Output | null);
  'createdAt': (_google_protobuf_Timestamp__Output | null);
}
