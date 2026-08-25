// Original file: ../interchat-protobuf/control/v1/models.proto

import type { HubActivityLevel as _interchat_control_v1_HubActivityLevel, HubActivityLevel__Output as _interchat_control_v1_HubActivityLevel__Output } from '../../../interchat/control/v1/HubActivityLevel';
import type { Long } from '@grpc/proto-loader';

export interface HubStatus {
  'activityLevel'?: (_interchat_control_v1_HubActivityLevel);
  'verified'?: (boolean);
  'partnered'?: (boolean);
  'featured'?: (boolean);
  'weeklyMessageCount'?: (number | string | Long);
  'averageRating'?: (number | string);
  'connectionCount'?: (number);
  'upvoteCount'?: (number);
  'reviewCount'?: (number);
}

export interface HubStatus__Output {
  'activityLevel': (_interchat_control_v1_HubActivityLevel__Output);
  'verified': (boolean);
  'partnered': (boolean);
  'featured': (boolean);
  'weeklyMessageCount': (number);
  'averageRating': (number);
  'connectionCount': (number);
  'upvoteCount': (number);
  'reviewCount': (number);
}
