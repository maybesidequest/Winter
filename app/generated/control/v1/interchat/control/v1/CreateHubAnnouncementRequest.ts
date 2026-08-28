// Original file: ../interchat-protobuf/control/v1/hub_service.proto

import type { RequestContext as _interchat_control_v1_RequestContext, RequestContext__Output as _interchat_control_v1_RequestContext__Output } from '../../../interchat/control/v1/RequestContext';
import type { HubAnnouncementSpec as _interchat_control_v1_HubAnnouncementSpec, HubAnnouncementSpec__Output as _interchat_control_v1_HubAnnouncementSpec__Output } from '../../../interchat/control/v1/HubAnnouncementSpec';
import type { Long } from '@grpc/proto-loader';

export interface CreateHubAnnouncementRequest {
  'context'?: (_interchat_control_v1_RequestContext | null);
  'hubId'?: (string);
  'content'?: (string);
  'spec'?: (_interchat_control_v1_HubAnnouncementSpec | null);
  'expectedVersion'?: (number | string | Long);
}

export interface CreateHubAnnouncementRequest__Output {
  'context': (_interchat_control_v1_RequestContext__Output | null);
  'hubId': (string);
  'content': (string);
  'spec': (_interchat_control_v1_HubAnnouncementSpec__Output | null);
  'expectedVersion': (number);
}
