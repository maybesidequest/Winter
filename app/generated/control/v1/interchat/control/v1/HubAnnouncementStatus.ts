// Original file: ../interchat-protobuf/control/v1/models.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';
import type { HubAnnouncementDeliveryState as _interchat_control_v1_HubAnnouncementDeliveryState, HubAnnouncementDeliveryState__Output as _interchat_control_v1_HubAnnouncementDeliveryState__Output } from '../../../interchat/control/v1/HubAnnouncementDeliveryState';

export interface HubAnnouncementStatus {
  'nextDelivery'?: (_google_protobuf_Timestamp | null);
  'latestAttempt'?: (_google_protobuf_Timestamp | null);
  'latestSuccess'?: (_google_protobuf_Timestamp | null);
  'deliveryState'?: (_interchat_control_v1_HubAnnouncementDeliveryState);
  'lastError'?: (string);
  'completed'?: (boolean);
}

export interface HubAnnouncementStatus__Output {
  'nextDelivery': (_google_protobuf_Timestamp__Output | null);
  'latestAttempt': (_google_protobuf_Timestamp__Output | null);
  'latestSuccess': (_google_protobuf_Timestamp__Output | null);
  'deliveryState': (_interchat_control_v1_HubAnnouncementDeliveryState__Output);
  'lastError': (string);
  'completed': (boolean);
}
