// Original file: /home/zev/Documents/code/interchat-protobuf/control/v1/hub_service.proto

import type { RequestContext as _interchat_control_v1_RequestContext, RequestContext__Output as _interchat_control_v1_RequestContext__Output } from '../../../interchat/control/v1/RequestContext';

export interface GetHubBadgesRequest {
  'context'?: (_interchat_control_v1_RequestContext | null);
  'hubId'?: (string);
}

export interface GetHubBadgesRequest__Output {
  'context': (_interchat_control_v1_RequestContext__Output | null);
  'hubId': (string);
}
