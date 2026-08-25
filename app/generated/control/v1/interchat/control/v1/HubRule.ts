// Original file: ../interchat-protobuf/control/v1/models.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';

export interface HubRule {
  'id'?: (string);
  'hubId'?: (string);
  'ruleNumber'?: (number);
  'title'?: (string);
  'description'?: (string);
  'createdAt'?: (_google_protobuf_Timestamp | null);
}

export interface HubRule__Output {
  'id': (string);
  'hubId': (string);
  'ruleNumber': (number);
  'title': (string);
  'description': (string);
  'createdAt': (_google_protobuf_Timestamp__Output | null);
}
