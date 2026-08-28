// Original file: ../interchat-protobuf/control/v1/models.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';
import type { HubAnnouncementMetadata as _interchat_control_v1_HubAnnouncementMetadata, HubAnnouncementMetadata__Output as _interchat_control_v1_HubAnnouncementMetadata__Output } from '../../../interchat/control/v1/HubAnnouncementMetadata';
import type { HubAnnouncementSpec as _interchat_control_v1_HubAnnouncementSpec, HubAnnouncementSpec__Output as _interchat_control_v1_HubAnnouncementSpec__Output } from '../../../interchat/control/v1/HubAnnouncementSpec';
import type { HubAnnouncementStatus as _interchat_control_v1_HubAnnouncementStatus, HubAnnouncementStatus__Output as _interchat_control_v1_HubAnnouncementStatus__Output } from '../../../interchat/control/v1/HubAnnouncementStatus';

export interface HubAnnouncement {
  'id'?: (string);
  'hubId'?: (string);
  'authorId'?: (string);
  'content'?: (string);
  'scheduledFor'?: (_google_protobuf_Timestamp | null);
  'sentAt'?: (_google_protobuf_Timestamp | null);
  'createdAt'?: (_google_protobuf_Timestamp | null);
  'metadata'?: (_interchat_control_v1_HubAnnouncementMetadata | null);
  'spec'?: (_interchat_control_v1_HubAnnouncementSpec | null);
  'status'?: (_interchat_control_v1_HubAnnouncementStatus | null);
}

export interface HubAnnouncement__Output {
  'id': (string);
  'hubId': (string);
  'authorId': (string);
  'content': (string);
  'scheduledFor': (_google_protobuf_Timestamp__Output | null);
  'sentAt': (_google_protobuf_Timestamp__Output | null);
  'createdAt': (_google_protobuf_Timestamp__Output | null);
  'metadata': (_interchat_control_v1_HubAnnouncementMetadata__Output | null);
  'spec': (_interchat_control_v1_HubAnnouncementSpec__Output | null);
  'status': (_interchat_control_v1_HubAnnouncementStatus__Output | null);
}
