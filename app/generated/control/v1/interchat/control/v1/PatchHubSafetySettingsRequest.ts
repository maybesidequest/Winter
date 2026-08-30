// Original file: ../interchat-protobuf/control/v1/moderation_service.proto

import type { RequestContext as _interchat_control_v1_RequestContext, RequestContext__Output as _interchat_control_v1_RequestContext__Output } from '../../../interchat/control/v1/RequestContext';
import type { HubSafetySettings as _interchat_control_v1_HubSafetySettings, HubSafetySettings__Output as _interchat_control_v1_HubSafetySettings__Output } from '../../../interchat/control/v1/HubSafetySettings';
import type { FieldMask as _google_protobuf_FieldMask, FieldMask__Output as _google_protobuf_FieldMask__Output } from '../../../google/protobuf/FieldMask';
import type { Long } from '@grpc/proto-loader';

export interface PatchHubSafetySettingsRequest {
  'context'?: (_interchat_control_v1_RequestContext | null);
  'hubId'?: (string);
  'settings'?: (_interchat_control_v1_HubSafetySettings | null);
  'updateMask'?: (_google_protobuf_FieldMask | null);
  'expectedVersion'?: (number | string | Long);
}

export interface PatchHubSafetySettingsRequest__Output {
  'context': (_interchat_control_v1_RequestContext__Output | null);
  'hubId': (string);
  'settings': (_interchat_control_v1_HubSafetySettings__Output | null);
  'updateMask': (_google_protobuf_FieldMask__Output | null);
  'expectedVersion': (number);
}
