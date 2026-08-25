// Original file: ../interchat-protobuf/control/v1/models.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';

export interface HubMetadata {
  'id'?: (string);
  'name'?: (string);
  'ownerId'?: (string);
  'createdAt'?: (_google_protobuf_Timestamp | null);
  'updatedAt'?: (_google_protobuf_Timestamp | null);
  'effectiveRole'?: (string);
  'permissions'?: ({[key: string]: boolean});
}

export interface HubMetadata__Output {
  'id': (string);
  'name': (string);
  'ownerId': (string);
  'createdAt': (_google_protobuf_Timestamp__Output | null);
  'updatedAt': (_google_protobuf_Timestamp__Output | null);
  'effectiveRole': (string);
  'permissions': ({[key: string]: boolean});
}
