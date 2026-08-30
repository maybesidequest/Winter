// Original file: ../interchat-protobuf/control/v1/server_service.proto

import type { RequestContext as _interchat_control_v1_RequestContext, RequestContext__Output as _interchat_control_v1_RequestContext__Output } from '../../../interchat/control/v1/RequestContext';

export interface ListConnectableChannelsRequest {
  'context'?: (_interchat_control_v1_RequestContext | null);
  'serverId'?: (string);
}

export interface ListConnectableChannelsRequest__Output {
  'context': (_interchat_control_v1_RequestContext__Output | null);
  'serverId': (string);
}
