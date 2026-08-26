// Original file: ../interchat-protobuf/control/v1/user_service.proto

import type { RequestContext as _interchat_control_v1_RequestContext, RequestContext__Output as _interchat_control_v1_RequestContext__Output } from '../../../interchat/control/v1/RequestContext';

export interface SubmitFeedbackRequest {
  'context'?: (_interchat_control_v1_RequestContext | null);
  'category'?: (string);
  'message'?: (string);
}

export interface SubmitFeedbackRequest__Output {
  'context': (_interchat_control_v1_RequestContext__Output | null);
  'category': (string);
  'message': (string);
}
