// Original file: ../interchat-protobuf/control/v1/models.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';

export interface HubAuditEntry {
  'id'?: (string);
  'hubId'?: (string);
  'eventType'?: (string);
  'summary'?: (string);
  'actorId'?: (string);
  'source'?: (string);
  'requestId'?: (string);
  'traceId'?: (string);
  'createdAt'?: (_google_protobuf_Timestamp | null);
}

export interface HubAuditEntry__Output {
  'id': (string);
  'hubId': (string);
  'eventType': (string);
  'summary': (string);
  'actorId': (string);
  'source': (string);
  'requestId': (string);
  'traceId': (string);
  'createdAt': (_google_protobuf_Timestamp__Output | null);
}
