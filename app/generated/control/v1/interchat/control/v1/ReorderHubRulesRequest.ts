// Original file: ../interchat-protobuf/control/v1/hub_service.proto

import type { RequestContext as _interchat_control_v1_RequestContext, RequestContext__Output as _interchat_control_v1_RequestContext__Output } from '../../../interchat/control/v1/RequestContext';
import type { Long } from '@grpc/proto-loader';

export interface ReorderHubRulesRequest {
  'context'?: (_interchat_control_v1_RequestContext | null);
  'hubId'?: (string);
  'ruleIds'?: (string)[];
  'expectedVersion'?: (number | string | Long);
}

export interface ReorderHubRulesRequest__Output {
  'context': (_interchat_control_v1_RequestContext__Output | null);
  'hubId': (string);
  'ruleIds': (string)[];
  'expectedVersion': (number);
}
