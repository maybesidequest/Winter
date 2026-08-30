// Original file: ../interchat-protobuf/control/v1/models.proto

import type { ModerationSubject as _interchat_control_v1_ModerationSubject, ModerationSubject__Output as _interchat_control_v1_ModerationSubject__Output } from '../../../interchat/control/v1/ModerationSubject';
import type { SafetyRiskBand as _interchat_control_v1_SafetyRiskBand, SafetyRiskBand__Output as _interchat_control_v1_SafetyRiskBand__Output } from '../../../interchat/control/v1/SafetyRiskBand';
import type { SafetySignalSummary as _interchat_control_v1_SafetySignalSummary, SafetySignalSummary__Output as _interchat_control_v1_SafetySignalSummary__Output } from '../../../interchat/control/v1/SafetySignalSummary';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';

export interface SafetyAssessment {
  'subject'?: (_interchat_control_v1_ModerationSubject | null);
  'score'?: (number | string);
  'riskBand'?: (_interchat_control_v1_SafetyRiskBand);
  'approvedSignalSummaries'?: (_interchat_control_v1_SafetySignalSummary)[];
  'source'?: (string);
  'observedAt'?: (_google_protobuf_Timestamp | null);
}

export interface SafetyAssessment__Output {
  'subject': (_interchat_control_v1_ModerationSubject__Output | null);
  'score': (number);
  'riskBand': (_interchat_control_v1_SafetyRiskBand__Output);
  'approvedSignalSummaries': (_interchat_control_v1_SafetySignalSummary__Output)[];
  'source': (string);
  'observedAt': (_google_protobuf_Timestamp__Output | null);
}
