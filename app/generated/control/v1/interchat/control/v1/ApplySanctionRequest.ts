// Original file: ../interchat-protobuf/control/v1/moderation_service.proto

import type { RequestContext as _interchat_control_v1_RequestContext, RequestContext__Output as _interchat_control_v1_RequestContext__Output } from '../../../interchat/control/v1/RequestContext';
import type { SanctionType as _interchat_control_v1_SanctionType, SanctionType__Output as _interchat_control_v1_SanctionType__Output } from '../../../interchat/control/v1/SanctionType';

export interface ApplySanctionRequest {
  'context'?: (_interchat_control_v1_RequestContext | null);
  'hubId'?: (string);
  'userId'?: (string);
  'type'?: (_interchat_control_v1_SanctionType);
  'reason'?: (string);
  'durationSeconds'?: (number);
}

export interface ApplySanctionRequest__Output {
  'context': (_interchat_control_v1_RequestContext__Output | null);
  'hubId': (string);
  'userId': (string);
  'type': (_interchat_control_v1_SanctionType__Output);
  'reason': (string);
  'durationSeconds': (number);
}
