// Original file: ../interchat-protobuf/control/v1/hub_service.proto

import type { RequestContext as _interchat_control_v1_RequestContext, RequestContext__Output as _interchat_control_v1_RequestContext__Output } from '../../../interchat/control/v1/RequestContext';
import type { HubSpec as _interchat_control_v1_HubSpec, HubSpec__Output as _interchat_control_v1_HubSpec__Output } from '../../../interchat/control/v1/HubSpec';

export interface CreateHubRequest {
  'context'?: (_interchat_control_v1_RequestContext | null);
  'spec'?: (_interchat_control_v1_HubSpec | null);
}

export interface CreateHubRequest__Output {
  'context': (_interchat_control_v1_RequestContext__Output | null);
  'spec': (_interchat_control_v1_HubSpec__Output | null);
}
