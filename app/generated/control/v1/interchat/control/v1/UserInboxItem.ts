// Original file: ../interchat-protobuf/control/v1/models.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';

export interface UserInboxItem {
  'id'?: (string);
  'userId'?: (string);
  'kind'?: (string);
  'title'?: (string);
  'body'?: (string);
  'actionUrl'?: (string);
  'read'?: (boolean);
  'createdAt'?: (_google_protobuf_Timestamp | null);
}

export interface UserInboxItem__Output {
  'id': (string);
  'userId': (string);
  'kind': (string);
  'title': (string);
  'body': (string);
  'actionUrl': (string);
  'read': (boolean);
  'createdAt': (_google_protobuf_Timestamp__Output | null);
}
