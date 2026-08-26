// Original file: ../interchat-protobuf/control/v1/user_service.proto

import type { RequestContext as _interchat_control_v1_RequestContext, RequestContext__Output as _interchat_control_v1_RequestContext__Output } from '../../../interchat/control/v1/RequestContext';
import type { LeaderboardKind as _interchat_control_v1_LeaderboardKind, LeaderboardKind__Output as _interchat_control_v1_LeaderboardKind__Output } from '../../../interchat/control/v1/LeaderboardKind';

export interface GetLeaderboardRequest {
  'context'?: (_interchat_control_v1_RequestContext | null);
  'kind'?: (_interchat_control_v1_LeaderboardKind);
  'limit'?: (number);
  'offset'?: (number);
}

export interface GetLeaderboardRequest__Output {
  'context': (_interchat_control_v1_RequestContext__Output | null);
  'kind': (_interchat_control_v1_LeaderboardKind__Output);
  'limit': (number);
  'offset': (number);
}
