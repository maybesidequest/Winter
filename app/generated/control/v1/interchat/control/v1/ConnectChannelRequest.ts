// Original file: ../interchat-protobuf/control/v1/connection_service.proto

import type { RequestContext as _interchat_control_v1_RequestContext, RequestContext__Output as _interchat_control_v1_RequestContext__Output } from '../../../interchat/control/v1/RequestContext';

export interface ConnectChannelRequest {
  'context'?: (_interchat_control_v1_RequestContext | null);
  'serverId'?: (string);
  'channelId'?: (string);
  'hubId'?: (string);
  'inviteCode'?: (string);
  'customName'?: (string);
}

export interface ConnectChannelRequest__Output {
  'context': (_interchat_control_v1_RequestContext__Output | null);
  'serverId': (string);
  'channelId': (string);
  'hubId': (string);
  'inviteCode': (string);
  'customName': (string);
}
