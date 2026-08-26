// Original file: ../interchat-protobuf/control/v1/models.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';

export interface FeedbackReceipt {
  'id'?: (string);
  'category'?: (string);
  'submittedAt'?: (_google_protobuf_Timestamp | null);
}

export interface FeedbackReceipt__Output {
  'id': (string);
  'category': (string);
  'submittedAt': (_google_protobuf_Timestamp__Output | null);
}
