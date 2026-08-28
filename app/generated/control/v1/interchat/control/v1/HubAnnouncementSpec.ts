// Original file: ../interchat-protobuf/control/v1/models.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';
import type { HubAnnouncementDesiredState as _interchat_control_v1_HubAnnouncementDesiredState, HubAnnouncementDesiredState__Output as _interchat_control_v1_HubAnnouncementDesiredState__Output } from '../../../interchat/control/v1/HubAnnouncementDesiredState';
import type { Long } from '@grpc/proto-loader';

export interface HubAnnouncementSpec {
  'title'?: (string);
  'content'?: (string);
  'scheduledFor'?: (_google_protobuf_Timestamp | null);
  'repeatIntervalSeconds'?: (number | string | Long);
  'timeZone'?: (string);
  'desiredState'?: (_interchat_control_v1_HubAnnouncementDesiredState);
}

export interface HubAnnouncementSpec__Output {
  'title': (string);
  'content': (string);
  'scheduledFor': (_google_protobuf_Timestamp__Output | null);
  'repeatIntervalSeconds': (number);
  'timeZone': (string);
  'desiredState': (_interchat_control_v1_HubAnnouncementDesiredState__Output);
}
