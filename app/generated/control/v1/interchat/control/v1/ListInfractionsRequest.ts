// Original file: ../interchat-protobuf/control/v1/moderation_service.proto

import type { RequestContext as _interchat_control_v1_RequestContext, RequestContext__Output as _interchat_control_v1_RequestContext__Output } from '../../../interchat/control/v1/RequestContext';
import type { ModerationSubject as _interchat_control_v1_ModerationSubject, ModerationSubject__Output as _interchat_control_v1_ModerationSubject__Output } from '../../../interchat/control/v1/ModerationSubject';
import type { InfractionLifecycleState as _interchat_control_v1_InfractionLifecycleState, InfractionLifecycleState__Output as _interchat_control_v1_InfractionLifecycleState__Output } from '../../../interchat/control/v1/InfractionLifecycleState';
import type { SanctionType as _interchat_control_v1_SanctionType, SanctionType__Output as _interchat_control_v1_SanctionType__Output } from '../../../interchat/control/v1/SanctionType';

export interface ListInfractionsRequest {
  'context'?: (_interchat_control_v1_RequestContext | null);
  'hubId'?: (string);
  'subject'?: (_interchat_control_v1_ModerationSubject | null);
  'lifecycleState'?: (_interchat_control_v1_InfractionLifecycleState);
  'sanctionType'?: (_interchat_control_v1_SanctionType);
  'limit'?: (number);
  'cursor'?: (string);
}

export interface ListInfractionsRequest__Output {
  'context': (_interchat_control_v1_RequestContext__Output | null);
  'hubId': (string);
  'subject': (_interchat_control_v1_ModerationSubject__Output | null);
  'lifecycleState': (_interchat_control_v1_InfractionLifecycleState__Output);
  'sanctionType': (_interchat_control_v1_SanctionType__Output);
  'limit': (number);
  'cursor': (string);
}
