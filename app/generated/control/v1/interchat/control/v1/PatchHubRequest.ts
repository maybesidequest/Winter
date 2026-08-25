// Original file: ../interchat-protobuf/control/v1/hub_service.proto

import type { RequestContext as _interchat_control_v1_RequestContext, RequestContext__Output as _interchat_control_v1_RequestContext__Output } from '../../../interchat/control/v1/RequestContext';
import type { HubSpec as _interchat_control_v1_HubSpec, HubSpec__Output as _interchat_control_v1_HubSpec__Output } from '../../../interchat/control/v1/HubSpec';
import type { FieldMask as _google_protobuf_FieldMask, FieldMask__Output as _google_protobuf_FieldMask__Output } from '../../../google/protobuf/FieldMask';
import type { Long } from '@grpc/proto-loader';

export interface PatchHubRequest {
  'context'?: (_interchat_control_v1_RequestContext | null);
  'hubId'?: (string);
  'spec'?: (_interchat_control_v1_HubSpec | null);
  'updateMask'?: (_google_protobuf_FieldMask | null);
  'expectedVersion'?: (number | string | Long);
}

export interface PatchHubRequest__Output {
  'context': (_interchat_control_v1_RequestContext__Output | null);
  'hubId': (string);
  'spec': (_interchat_control_v1_HubSpec__Output | null);
  'updateMask': (_google_protobuf_FieldMask__Output | null);
  'expectedVersion': (number);
}
