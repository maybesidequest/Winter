// Original file: ../interchat-protobuf/control/v1/server_service.proto

import type { RequestContext as _interchat_control_v1_RequestContext, RequestContext__Output as _interchat_control_v1_RequestContext__Output } from '../../../interchat/control/v1/RequestContext';
import type { BlockTargetType as _interchat_control_v1_BlockTargetType, BlockTargetType__Output as _interchat_control_v1_BlockTargetType__Output } from '../../../interchat/control/v1/BlockTargetType';

export interface AddBlockRequest {
  'context'?: (_interchat_control_v1_RequestContext | null);
  'serverId'?: (string);
  'targetId'?: (string);
  'targetType'?: (_interchat_control_v1_BlockTargetType);
  'reason'?: (string);
}

export interface AddBlockRequest__Output {
  'context': (_interchat_control_v1_RequestContext__Output | null);
  'serverId': (string);
  'targetId': (string);
  'targetType': (_interchat_control_v1_BlockTargetType__Output);
  'reason': (string);
}
