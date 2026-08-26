// Original file: /home/zev/Documents/code/interchat-protobuf/control/v1/hub_service.proto

import type { HubAuditEntry as _interchat_control_v1_HubAuditEntry, HubAuditEntry__Output as _interchat_control_v1_HubAuditEntry__Output } from '../../../interchat/control/v1/HubAuditEntry';

export interface HubAuditResponse {
  'entries'?: (_interchat_control_v1_HubAuditEntry)[];
  'hasMore'?: (boolean);
}

export interface HubAuditResponse__Output {
  'entries': (_interchat_control_v1_HubAuditEntry__Output)[];
  'hasMore': (boolean);
}
