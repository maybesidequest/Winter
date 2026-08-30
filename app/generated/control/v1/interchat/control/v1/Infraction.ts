// Original file: ../interchat-protobuf/control/v1/models.proto

import type { SanctionType as _interchat_control_v1_SanctionType, SanctionType__Output as _interchat_control_v1_SanctionType__Output } from '../../../interchat/control/v1/SanctionType';
import type { InfractionStatus as _interchat_control_v1_InfractionStatus, InfractionStatus__Output as _interchat_control_v1_InfractionStatus__Output } from '../../../interchat/control/v1/InfractionStatus';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';
import type { ModerationSubject as _interchat_control_v1_ModerationSubject, ModerationSubject__Output as _interchat_control_v1_ModerationSubject__Output } from '../../../interchat/control/v1/ModerationSubject';
import type { InfractionLifecycleState as _interchat_control_v1_InfractionLifecycleState, InfractionLifecycleState__Output as _interchat_control_v1_InfractionLifecycleState__Output } from '../../../interchat/control/v1/InfractionLifecycleState';
import type { SanctionEnforcementStatus as _interchat_control_v1_SanctionEnforcementStatus, SanctionEnforcementStatus__Output as _interchat_control_v1_SanctionEnforcementStatus__Output } from '../../../interchat/control/v1/SanctionEnforcementStatus';
import type { Long } from '@grpc/proto-loader';

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
  'hubName'?: (string);
  'subject'?: (_interchat_control_v1_ModerationSubject | null);
  'version'?: (number | string | Long);
  'lifecycleState'?: (_interchat_control_v1_InfractionLifecycleState);
  'enforcementStatus'?: (_interchat_control_v1_SanctionEnforcementStatus);
  'updatedAt'?: (_google_protobuf_Timestamp | null);
  'enforcementObservedAt'?: (_google_protobuf_Timestamp | null);
  'enforcementError'?: (string);
  'revokedAt'?: (_google_protobuf_Timestamp | null);
  'revokedBy'?: (string);
  'revocationReason'?: (string);
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
  'hubName': (string);
  'subject': (_interchat_control_v1_ModerationSubject__Output | null);
  'version': (number);
  'lifecycleState': (_interchat_control_v1_InfractionLifecycleState__Output);
  'enforcementStatus': (_interchat_control_v1_SanctionEnforcementStatus__Output);
  'updatedAt': (_google_protobuf_Timestamp__Output | null);
  'enforcementObservedAt': (_google_protobuf_Timestamp__Output | null);
  'enforcementError': (string);
  'revokedAt': (_google_protobuf_Timestamp__Output | null);
  'revokedBy': (string);
  'revocationReason': (string);
}
