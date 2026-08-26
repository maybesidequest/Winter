// Original file: ../interchat-protobuf/control/v1/models.proto

import type { UserActivityHub as _interchat_control_v1_UserActivityHub, UserActivityHub__Output as _interchat_control_v1_UserActivityHub__Output } from '../../../interchat/control/v1/UserActivityHub';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';

export interface UserActivity {
  'userId'?: (string);
  'currentStreak'?: (number);
  'longestStreak'?: (number);
  'streakFreezes'?: (number);
  'lifetimeMessages'?: (number);
  'messageRank'?: (number);
  'activeHubCount'?: (number);
  'totalHubMessages'?: (number);
  'topHubs'?: (_interchat_control_v1_UserActivityHub)[];
  'completedCalls'?: (number);
  'callRank'?: (number);
  'showBadges'?: (boolean);
  'streaksEnabled'?: (boolean);
  'asOf'?: (_google_protobuf_Timestamp | null);
}

export interface UserActivity__Output {
  'userId': (string);
  'currentStreak': (number);
  'longestStreak': (number);
  'streakFreezes': (number);
  'lifetimeMessages': (number);
  'messageRank': (number);
  'activeHubCount': (number);
  'totalHubMessages': (number);
  'topHubs': (_interchat_control_v1_UserActivityHub__Output)[];
  'completedCalls': (number);
  'callRank': (number);
  'showBadges': (boolean);
  'streaksEnabled': (boolean);
  'asOf': (_google_protobuf_Timestamp__Output | null);
}
