// Original file: ../interchat-protobuf/control/v1/models.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';
import type { Long } from '@grpc/proto-loader';

export interface HubSafetySettings {
  'hubId'?: (string);
  'hideLinks'?: (boolean);
  'spamFilter'?: (boolean);
  'blockInvites'?: (boolean);
  'blockNsfw'?: (boolean);
  'allowVideos'?: (boolean);
  'blockAttachments'?: (boolean);
  'blockTenorGifs'?: (boolean);
  'version'?: (number | string | Long);
  'updatedAt'?: (_google_protobuf_Timestamp | null);
}

export interface HubSafetySettings__Output {
  'hubId': (string);
  'hideLinks': (boolean);
  'spamFilter': (boolean);
  'blockInvites': (boolean);
  'blockNsfw': (boolean);
  'allowVideos': (boolean);
  'blockAttachments': (boolean);
  'blockTenorGifs': (boolean);
  'version': (number);
  'updatedAt': (_google_protobuf_Timestamp__Output | null);
}
