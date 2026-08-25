// Original file: ../interchat-protobuf/control/v1/hub_service.proto

import type { RequestContext as _interchat_control_v1_RequestContext, RequestContext__Output as _interchat_control_v1_RequestContext__Output } from '../../../interchat/control/v1/RequestContext';

export interface ListMyHubsRequest {
  'context'?: (_interchat_control_v1_RequestContext | null);
  'limit'?: (number);
  'cursor'?: (string);
}

export interface ListMyHubsRequest__Output {
  'context': (_interchat_control_v1_RequestContext__Output | null);
  'limit': (number);
  'cursor': (string);
}
