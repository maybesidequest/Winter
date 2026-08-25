// Original file: ../interchat-protobuf/control/v1/models.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';

export interface ConnectionStatus {
  'healthy'?: (boolean);
  'statusMessage'?: (string);
  'lastRelayedAt'?: (_google_protobuf_Timestamp | null);
  'webhookProvisioned'?: (boolean);
}

export interface ConnectionStatus__Output {
  'healthy': (boolean);
  'statusMessage': (string);
  'lastRelayedAt': (_google_protobuf_Timestamp__Output | null);
  'webhookProvisioned': (boolean);
}
