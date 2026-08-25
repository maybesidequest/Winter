// Original file: ../interchat-protobuf/control/v1/server_service.proto

import type { RequestContext as _interchat_control_v1_RequestContext, RequestContext__Output as _interchat_control_v1_RequestContext__Output } from '../../../interchat/control/v1/RequestContext';

export interface BatchGetServersRequest {
  'context'?: (_interchat_control_v1_RequestContext | null);
  'serverIds'?: (string)[];
}

export interface BatchGetServersRequest__Output {
  'context': (_interchat_control_v1_RequestContext__Output | null);
  'serverIds': (string)[];
}
