// Original file: ../interchat-protobuf/control/v1/models.proto

import type { HubVisibility as _interchat_control_v1_HubVisibility, HubVisibility__Output as _interchat_control_v1_HubVisibility__Output } from '../../../interchat/control/v1/HubVisibility';

export interface HubSpec {
  'name'?: (string);
  'shortDescription'?: (string);
  'description'?: (string);
  'iconUrl'?: (string);
  'bannerUrl'?: (string);
  'welcomeMessage'?: (string);
  'language'?: (string);
  'region'?: (string);
  'visibility'?: (_interchat_control_v1_HubVisibility);
  'locked'?: (boolean);
  'nsfw'?: (boolean);
  'rules'?: (string)[];
  'appealCooldownHours'?: (number);
  'settings'?: (number);
}

export interface HubSpec__Output {
  'name': (string);
  'shortDescription': (string);
  'description': (string);
  'iconUrl': (string);
  'bannerUrl': (string);
  'welcomeMessage': (string);
  'language': (string);
  'region': (string);
  'visibility': (_interchat_control_v1_HubVisibility__Output);
  'locked': (boolean);
  'nsfw': (boolean);
  'rules': (string)[];
  'appealCooldownHours': (number);
  'settings': (number);
}
