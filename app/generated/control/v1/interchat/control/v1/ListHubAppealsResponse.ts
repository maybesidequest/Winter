// Original file: ../interchat-protobuf/control/v1/moderation_service.proto

import type { Appeal as _interchat_control_v1_Appeal, Appeal__Output as _interchat_control_v1_Appeal__Output } from '../../../interchat/control/v1/Appeal';

export interface ListHubAppealsResponse {
  'appeals'?: (_interchat_control_v1_Appeal)[];
  'nextCursor'?: (string);
  'totalCount'?: (number);
}

export interface ListHubAppealsResponse__Output {
  'appeals': (_interchat_control_v1_Appeal__Output)[];
  'nextCursor': (string);
  'totalCount': (number);
}
