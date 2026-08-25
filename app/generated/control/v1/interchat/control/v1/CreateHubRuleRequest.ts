// Original file: ../interchat-protobuf/control/v1/hub_service.proto

import type { RequestContext as _interchat_control_v1_RequestContext, RequestContext__Output as _interchat_control_v1_RequestContext__Output } from '../../../interchat/control/v1/RequestContext';
import type { Long } from '@grpc/proto-loader';

export interface CreateHubRuleRequest {
  'context'?: (_interchat_control_v1_RequestContext | null);
  'hubId'?: (string);
  'title'?: (string);
  'description'?: (string);
  'expectedVersion'?: (number | string | Long);
}

export interface CreateHubRuleRequest__Output {
  'context': (_interchat_control_v1_RequestContext__Output | null);
  'hubId': (string);
  'title': (string);
  'description': (string);
  'expectedVersion': (number);
}
