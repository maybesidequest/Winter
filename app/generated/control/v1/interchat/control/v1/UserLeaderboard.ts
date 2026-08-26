// Original file: ../interchat-protobuf/control/v1/models.proto

import type { LeaderboardKind as _interchat_control_v1_LeaderboardKind, LeaderboardKind__Output as _interchat_control_v1_LeaderboardKind__Output } from '../../../interchat/control/v1/LeaderboardKind';
import type { LeaderboardEntry as _interchat_control_v1_LeaderboardEntry, LeaderboardEntry__Output as _interchat_control_v1_LeaderboardEntry__Output } from '../../../interchat/control/v1/LeaderboardEntry';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';

export interface UserLeaderboard {
  'kind'?: (_interchat_control_v1_LeaderboardKind);
  'entries'?: (_interchat_control_v1_LeaderboardEntry)[];
  'totalCount'?: (number);
  'asOf'?: (_google_protobuf_Timestamp | null);
}

export interface UserLeaderboard__Output {
  'kind': (_interchat_control_v1_LeaderboardKind__Output);
  'entries': (_interchat_control_v1_LeaderboardEntry__Output)[];
  'totalCount': (number);
  'asOf': (_google_protobuf_Timestamp__Output | null);
}
