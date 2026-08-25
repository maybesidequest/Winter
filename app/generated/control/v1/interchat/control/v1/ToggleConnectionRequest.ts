// Original file: ../interchat-protobuf/control/v1/connection_service.proto

import type { RequestContext as _interchat_control_v1_RequestContext, RequestContext__Output as _interchat_control_v1_RequestContext__Output } from '../../../interchat/control/v1/RequestContext';
import type { Long } from '@grpc/proto-loader';

export interface ToggleConnectionRequest {
  'context'?: (_interchat_control_v1_RequestContext | null);
  'connectionId'?: (string);
  'enabled'?: (boolean);
  'expectedVersion'?: (number | string | Long);
}

export interface ToggleConnectionRequest__Output {
  'context': (_interchat_control_v1_RequestContext__Output | null);
  'connectionId': (string);
  'enabled': (boolean);
  'expectedVersion': (number);
}
