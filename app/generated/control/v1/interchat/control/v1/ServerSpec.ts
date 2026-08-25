// Original file: ../interchat-protobuf/control/v1/models.proto


export interface ServerSpec {
  'prefix'?: (string);
  'callChannelId'?: (string);
  'callDisplayName'?: (string);
  'callPing'?: (boolean);
  'callRequeue'?: (boolean);
  'callNsfwFilter'?: (boolean);
  'settings'?: (number);
}

export interface ServerSpec__Output {
  'prefix': (string);
  'callChannelId': (string);
  'callDisplayName': (string);
  'callPing': (boolean);
  'callRequeue': (boolean);
  'callNsfwFilter': (boolean);
  'settings': (number);
}
