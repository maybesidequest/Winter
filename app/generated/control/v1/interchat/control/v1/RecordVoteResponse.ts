// Original file: ../interchat-protobuf/control/v1/user_service.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';

export interface RecordVoteResponse {
  'userId'?: (string);
  'totalVotes'?: (number);
  'currentStreak'?: (number);
  'longestStreak'?: (number);
  'streakExtended'?: (boolean);
  'isDuplicate'?: (boolean);
  'recordedAt'?: (_google_protobuf_Timestamp | null);
}

export interface RecordVoteResponse__Output {
  'userId': (string);
  'totalVotes': (number);
  'currentStreak': (number);
  'longestStreak': (number);
  'streakExtended': (boolean);
  'isDuplicate': (boolean);
  'recordedAt': (_google_protobuf_Timestamp__Output | null);
}
