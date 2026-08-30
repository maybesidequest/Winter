// Original file: ../interchat-protobuf/control/v1/moderation_service.proto

import type { RequestContext as _interchat_control_v1_RequestContext, RequestContext__Output as _interchat_control_v1_RequestContext__Output } from '../../../interchat/control/v1/RequestContext';
import type { AppealStatus as _interchat_control_v1_AppealStatus, AppealStatus__Output as _interchat_control_v1_AppealStatus__Output } from '../../../interchat/control/v1/AppealStatus';
import type { ModerationSubject as _interchat_control_v1_ModerationSubject, ModerationSubject__Output as _interchat_control_v1_ModerationSubject__Output } from '../../../interchat/control/v1/ModerationSubject';

export interface ListHubAppealsRequest {
  'context'?: (_interchat_control_v1_RequestContext | null);
  'hubId'?: (string);
  'status'?: (_interchat_control_v1_AppealStatus);
  'subject'?: (_interchat_control_v1_ModerationSubject | null);
  'limit'?: (number);
  'cursor'?: (string);
}

export interface ListHubAppealsRequest__Output {
  'context': (_interchat_control_v1_RequestContext__Output | null);
  'hubId': (string);
  'status': (_interchat_control_v1_AppealStatus__Output);
  'subject': (_interchat_control_v1_ModerationSubject__Output | null);
  'limit': (number);
  'cursor': (string);
}
