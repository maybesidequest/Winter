// Original file: ../interchat-protobuf/control/v1/moderation_service.proto

import type { RequestContext as _interchat_control_v1_RequestContext, RequestContext__Output as _interchat_control_v1_RequestContext__Output } from '../../../interchat/control/v1/RequestContext';

export interface SubmitAppealRequest {
  'context'?: (_interchat_control_v1_RequestContext | null);
  'hubId'?: (string);
  'infractionId'?: (string);
  'reason'?: (string);
}

export interface SubmitAppealRequest__Output {
  'context': (_interchat_control_v1_RequestContext__Output | null);
  'hubId': (string);
  'infractionId': (string);
  'reason': (string);
}
