// Original file: ../interchat-protobuf/control/v1/moderation_service.proto

import type { Infraction as _interchat_control_v1_Infraction, Infraction__Output as _interchat_control_v1_Infraction__Output } from '../../../interchat/control/v1/Infraction';

export interface ListInfractionsResponse {
  'infractions'?: (_interchat_control_v1_Infraction)[];
  'nextCursor'?: (string);
  'totalCount'?: (number);
}

export interface ListInfractionsResponse__Output {
  'infractions': (_interchat_control_v1_Infraction__Output)[];
  'nextCursor': (string);
  'totalCount': (number);
}
