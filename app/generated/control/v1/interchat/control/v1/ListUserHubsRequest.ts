// Original file: ../interchat-protobuf/control/v1/hub_service.proto

import type { RequestContext as _interchat_control_v1_RequestContext, RequestContext__Output as _interchat_control_v1_RequestContext__Output } from '../../../interchat/control/v1/RequestContext';

export interface ListUserHubsRequest {
  'context'?: (_interchat_control_v1_RequestContext | null);
  'hubIds'?: (string)[];
}

export interface ListUserHubsRequest__Output {
  'context': (_interchat_control_v1_RequestContext__Output | null);
  'hubIds': (string)[];
}
