// Original file: ../interchat-protobuf/control/v1/models.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';

export interface HubAnnouncement {
  'id'?: (string);
  'hubId'?: (string);
  'authorId'?: (string);
  'content'?: (string);
  'scheduledFor'?: (_google_protobuf_Timestamp | null);
  'sentAt'?: (_google_protobuf_Timestamp | null);
  'createdAt'?: (_google_protobuf_Timestamp | null);
}

export interface HubAnnouncement__Output {
  'id': (string);
  'hubId': (string);
  'authorId': (string);
  'content': (string);
  'scheduledFor': (_google_protobuf_Timestamp__Output | null);
  'sentAt': (_google_protobuf_Timestamp__Output | null);
  'createdAt': (_google_protobuf_Timestamp__Output | null);
}
