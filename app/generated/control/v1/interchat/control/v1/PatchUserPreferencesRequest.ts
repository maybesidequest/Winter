// Original file: ../interchat-protobuf/control/v1/user_service.proto

import type { RequestContext as _interchat_control_v1_RequestContext, RequestContext__Output as _interchat_control_v1_RequestContext__Output } from '../../../interchat/control/v1/RequestContext';
import type { UserPreferences as _interchat_control_v1_UserPreferences, UserPreferences__Output as _interchat_control_v1_UserPreferences__Output } from '../../../interchat/control/v1/UserPreferences';

export interface PatchUserPreferencesRequest {
  'context'?: (_interchat_control_v1_RequestContext | null);
  'preferences'?: (_interchat_control_v1_UserPreferences | null);
}

export interface PatchUserPreferencesRequest__Output {
  'context': (_interchat_control_v1_RequestContext__Output | null);
  'preferences': (_interchat_control_v1_UserPreferences__Output | null);
}
