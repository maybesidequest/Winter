// Original file: ../interchat-protobuf/control/v1/hub_service.proto

import type { RequestContext as _interchat_control_v1_RequestContext, RequestContext__Output as _interchat_control_v1_RequestContext__Output } from '../../../interchat/control/v1/RequestContext';
import type { HubAnnouncementSpec as _interchat_control_v1_HubAnnouncementSpec, HubAnnouncementSpec__Output as _interchat_control_v1_HubAnnouncementSpec__Output } from '../../../interchat/control/v1/HubAnnouncementSpec';
import type { FieldMask as _google_protobuf_FieldMask, FieldMask__Output as _google_protobuf_FieldMask__Output } from '../../../google/protobuf/FieldMask';
import type { Long } from '@grpc/proto-loader';

export interface UpdateHubAnnouncementRequest {
  'context'?: (_interchat_control_v1_RequestContext | null);
  'hubId'?: (string);
  'announcementId'?: (string);
  'content'?: (string);
  'spec'?: (_interchat_control_v1_HubAnnouncementSpec | null);
  'updateMask'?: (_google_protobuf_FieldMask | null);
  'expectedVersion'?: (number | string | Long);
}

export interface UpdateHubAnnouncementRequest__Output {
  'context': (_interchat_control_v1_RequestContext__Output | null);
  'hubId': (string);
  'announcementId': (string);
  'content': (string);
  'spec': (_interchat_control_v1_HubAnnouncementSpec__Output | null);
  'updateMask': (_google_protobuf_FieldMask__Output | null);
  'expectedVersion': (number);
}
