// Original file: ../interchat-protobuf/control/v1/models.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';

export interface HubStaffMemberMetadata {
  'userId'?: (string);
  'hubId'?: (string);
  'assignedAt'?: (_google_protobuf_Timestamp | null);
}

export interface HubStaffMemberMetadata__Output {
  'userId': (string);
  'hubId': (string);
  'assignedAt': (_google_protobuf_Timestamp__Output | null);
}
