// Original file: ../interchat-protobuf/control/v1/models.proto

import type { SanctionType as _interchat_control_v1_SanctionType, SanctionType__Output as _interchat_control_v1_SanctionType__Output } from '../../../interchat/control/v1/SanctionType';
import type { InfractionStatus as _interchat_control_v1_InfractionStatus, InfractionStatus__Output as _interchat_control_v1_InfractionStatus__Output } from '../../../interchat/control/v1/InfractionStatus';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';

export interface Infraction {
  'id'?: (string);
  'hubId'?: (string);
  'userId'?: (string);
  'type'?: (_interchat_control_v1_SanctionType);
  'reason'?: (string);
  'issuerId'?: (string);
  'status'?: (_interchat_control_v1_InfractionStatus);
  'expiresAt'?: (_google_protobuf_Timestamp | null);
  'createdAt'?: (_google_protobuf_Timestamp | null);
}

export interface Infraction__Output {
  'id': (string);
  'hubId': (string);
  'userId': (string);
  'type': (_interchat_control_v1_SanctionType__Output);
  'reason': (string);
  'issuerId': (string);
  'status': (_interchat_control_v1_InfractionStatus__Output);
  'expiresAt': (_google_protobuf_Timestamp__Output | null);
  'createdAt': (_google_protobuf_Timestamp__Output | null);
}
