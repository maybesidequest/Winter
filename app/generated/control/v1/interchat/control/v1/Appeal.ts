// Original file: ../interchat-protobuf/control/v1/models.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';

export interface Appeal {
  'id'?: (string);
  'infractionId'?: (string);
  'hubId'?: (string);
  'userId'?: (string);
  'reason'?: (string);
  'status'?: (string);
  'createdAt'?: (_google_protobuf_Timestamp | null);
}

export interface Appeal__Output {
  'id': (string);
  'infractionId': (string);
  'hubId': (string);
  'userId': (string);
  'reason': (string);
  'status': (string);
  'createdAt': (_google_protobuf_Timestamp__Output | null);
}
