// Original file: ../interchat-protobuf/control/v1/hub_service.proto

import type { RequestContext as _interchat_control_v1_RequestContext, RequestContext__Output as _interchat_control_v1_RequestContext__Output } from '../../../interchat/control/v1/RequestContext';
import type { HubAnnouncementDesiredState as _interchat_control_v1_HubAnnouncementDesiredState, HubAnnouncementDesiredState__Output as _interchat_control_v1_HubAnnouncementDesiredState__Output } from '../../../interchat/control/v1/HubAnnouncementDesiredState';
import type { Long } from '@grpc/proto-loader';

export interface TransitionHubAnnouncementStateRequest {
  'context'?: (_interchat_control_v1_RequestContext | null);
  'hubId'?: (string);
  'announcementId'?: (string);
  'desiredState'?: (_interchat_control_v1_HubAnnouncementDesiredState);
  'expectedVersion'?: (number | string | Long);
}

export interface TransitionHubAnnouncementStateRequest__Output {
  'context': (_interchat_control_v1_RequestContext__Output | null);
  'hubId': (string);
  'announcementId': (string);
  'desiredState': (_interchat_control_v1_HubAnnouncementDesiredState__Output);
  'expectedVersion': (number);
}
