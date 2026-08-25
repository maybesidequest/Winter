// Original file: ../interchat-protobuf/control/v1/models.proto

import type { BlockTargetType as _interchat_control_v1_BlockTargetType, BlockTargetType__Output as _interchat_control_v1_BlockTargetType__Output } from '../../../interchat/control/v1/BlockTargetType';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';

export interface ServerBlock {
  'id'?: (string);
  'serverId'?: (string);
  'targetId'?: (string);
  'targetType'?: (_interchat_control_v1_BlockTargetType);
  'reason'?: (string);
  'authorId'?: (string);
  'createdAt'?: (_google_protobuf_Timestamp | null);
}

export interface ServerBlock__Output {
  'id': (string);
  'serverId': (string);
  'targetId': (string);
  'targetType': (_interchat_control_v1_BlockTargetType__Output);
  'reason': (string);
  'authorId': (string);
  'createdAt': (_google_protobuf_Timestamp__Output | null);
}
