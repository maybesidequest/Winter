// Original file: ../interchat-protobuf/control/v1/user_service.proto

import type { RequestContext as _interchat_control_v1_RequestContext, RequestContext__Output as _interchat_control_v1_RequestContext__Output } from '../../../interchat/control/v1/RequestContext';

export interface SyncDiscordIdentityRequest {
  'context'?: (_interchat_control_v1_RequestContext | null);
  'discordUserId'?: (string);
  'username'?: (string);
  'displayName'?: (string);
  'avatarUrl'?: (string);
}

export interface SyncDiscordIdentityRequest__Output {
  'context': (_interchat_control_v1_RequestContext__Output | null);
  'discordUserId': (string);
  'username': (string);
  'displayName': (string);
  'avatarUrl': (string);
}
