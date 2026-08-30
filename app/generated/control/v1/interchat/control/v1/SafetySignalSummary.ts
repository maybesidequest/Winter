// Original file: ../interchat-protobuf/control/v1/models.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';

export interface SafetySignalSummary {
  'code'?: (string);
  'summary'?: (string);
  'contribution'?: (number | string);
  'mitigating'?: (boolean);
  'observedAt'?: (_google_protobuf_Timestamp | null);
}

export interface SafetySignalSummary__Output {
  'code': (string);
  'summary': (string);
  'contribution': (number);
  'mitigating': (boolean);
  'observedAt': (_google_protobuf_Timestamp__Output | null);
}
