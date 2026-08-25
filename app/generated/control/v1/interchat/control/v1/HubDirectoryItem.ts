// Original file: ../interchat-protobuf/control/v1/models.proto

import type { HubActivityLevel as _interchat_control_v1_HubActivityLevel, HubActivityLevel__Output as _interchat_control_v1_HubActivityLevel__Output } from '../../../interchat/control/v1/HubActivityLevel';

export interface HubDirectoryItem {
  'id'?: (string);
  'name'?: (string);
  'shortDescription'?: (string);
  'iconUrl'?: (string);
  'bannerUrl'?: (string);
  'language'?: (string);
  'region'?: (string);
  'verified'?: (boolean);
  'partnered'?: (boolean);
  'featured'?: (boolean);
  'nsfw'?: (boolean);
  'connectionCount'?: (number);
  'upvoteCount'?: (number);
  'averageRating'?: (number | string);
  'activityLevel'?: (_interchat_control_v1_HubActivityLevel);
  'tags'?: (string)[];
}

export interface HubDirectoryItem__Output {
  'id': (string);
  'name': (string);
  'shortDescription': (string);
  'iconUrl': (string);
  'bannerUrl': (string);
  'language': (string);
  'region': (string);
  'verified': (boolean);
  'partnered': (boolean);
  'featured': (boolean);
  'nsfw': (boolean);
  'connectionCount': (number);
  'upvoteCount': (number);
  'averageRating': (number);
  'activityLevel': (_interchat_control_v1_HubActivityLevel__Output);
  'tags': (string)[];
}
