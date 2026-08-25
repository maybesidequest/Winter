// Original file: ../interchat-protobuf/control/v1/models.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';

export interface UserProfile {
  'id'?: (string);
  'username'?: (string);
  'displayName'?: (string);
  'avatarUrl'?: (string);
  'streakDays'?: (number);
  'totalRelayedMessages'?: (number);
  'createdAt'?: (_google_protobuf_Timestamp | null);
}

export interface UserProfile__Output {
  'id': (string);
  'username': (string);
  'displayName': (string);
  'avatarUrl': (string);
  'streakDays': (number);
  'totalRelayedMessages': (number);
  'createdAt': (_google_protobuf_Timestamp__Output | null);
}
