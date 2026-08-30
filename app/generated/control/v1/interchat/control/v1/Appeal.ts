// Original file: ../interchat-protobuf/control/v1/models.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';
import type { AppealStatus as _interchat_control_v1_AppealStatus, AppealStatus__Output as _interchat_control_v1_AppealStatus__Output } from '../../../interchat/control/v1/AppealStatus';
import type { Infraction as _interchat_control_v1_Infraction, Infraction__Output as _interchat_control_v1_Infraction__Output } from '../../../interchat/control/v1/Infraction';
import type { AppealApprovalOutcome as _interchat_control_v1_AppealApprovalOutcome, AppealApprovalOutcome__Output as _interchat_control_v1_AppealApprovalOutcome__Output } from '../../../interchat/control/v1/AppealApprovalOutcome';
import type { Long } from '@grpc/proto-loader';

export interface Appeal {
  'id'?: (string);
  'infractionId'?: (string);
  'hubId'?: (string);
  'userId'?: (string);
  'reason'?: (string);
  'status'?: (string);
  'createdAt'?: (_google_protobuf_Timestamp | null);
  'appealStatus'?: (_interchat_control_v1_AppealStatus);
  'version'?: (number | string | Long);
  'reviewerId'?: (string);
  'reviewedAt'?: (_google_protobuf_Timestamp | null);
  'resolutionReason'?: (string);
  'infraction'?: (_interchat_control_v1_Infraction | null);
  'approvalOutcome'?: (_interchat_control_v1_AppealApprovalOutcome);
  'updatedAt'?: (_google_protobuf_Timestamp | null);
}

export interface Appeal__Output {
  'id': (string);
  'infractionId': (string);
  'hubId': (string);
  'userId': (string);
  'reason': (string);
  'status': (string);
  'createdAt': (_google_protobuf_Timestamp__Output | null);
  'appealStatus': (_interchat_control_v1_AppealStatus__Output);
  'version': (number);
  'reviewerId': (string);
  'reviewedAt': (_google_protobuf_Timestamp__Output | null);
  'resolutionReason': (string);
  'infraction': (_interchat_control_v1_Infraction__Output | null);
  'approvalOutcome': (_interchat_control_v1_AppealApprovalOutcome__Output);
  'updatedAt': (_google_protobuf_Timestamp__Output | null);
}
