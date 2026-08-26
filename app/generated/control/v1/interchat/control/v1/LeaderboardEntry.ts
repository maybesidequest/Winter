// Original file: ../interchat-protobuf/control/v1/models.proto

import type { Long } from '@grpc/proto-loader';

export interface LeaderboardEntry {
  'rank'?: (number);
  'userId'?: (string);
  'displayName'?: (string);
  'avatarUrl'?: (string);
  'value'?: (number | string | Long);
}

export interface LeaderboardEntry__Output {
  'rank': (number);
  'userId': (string);
  'displayName': (string);
  'avatarUrl': (string);
  'value': (number);
}
