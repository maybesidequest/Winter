// Original file: ../interchat-protobuf/control/v1/hub_service.proto

import type { RequestContext as _interchat_control_v1_RequestContext, RequestContext__Output as _interchat_control_v1_RequestContext__Output } from '../../../interchat/control/v1/RequestContext';
import type { HubAnnouncementDeliveryState as _interchat_control_v1_HubAnnouncementDeliveryState, HubAnnouncementDeliveryState__Output as _interchat_control_v1_HubAnnouncementDeliveryState__Output } from '../../../interchat/control/v1/HubAnnouncementDeliveryState';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';

export interface RecordHubAnnouncementDeliveryRequest {
  'context'?: (_interchat_control_v1_RequestContext | null);
  'announcementId'?: (string);
  'occurrenceId'?: (string);
  'prismBatchId'?: (string);
  'result'?: (_interchat_control_v1_HubAnnouncementDeliveryState);
  'deliveredCount'?: (number);
  'failedCount'?: (number);
  'deliveredAt'?: (_google_protobuf_Timestamp | null);
  'safeError'?: (string);
}

export interface RecordHubAnnouncementDeliveryRequest__Output {
  'context': (_interchat_control_v1_RequestContext__Output | null);
  'announcementId': (string);
  'occurrenceId': (string);
  'prismBatchId': (string);
  'result': (_interchat_control_v1_HubAnnouncementDeliveryState__Output);
  'deliveredCount': (number);
  'failedCount': (number);
  'deliveredAt': (_google_protobuf_Timestamp__Output | null);
  'safeError': (string);
}
