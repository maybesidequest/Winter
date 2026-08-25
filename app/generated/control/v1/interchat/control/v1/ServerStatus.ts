// Original file: ../interchat-protobuf/control/v1/models.proto

import type { Long } from '@grpc/proto-loader';

export interface ServerStatus {
  'botInstalled'?: (boolean);
  'botPermissions'?: (number | string | Long);
  'connectionCount'?: (number);
  'activeCall'?: (boolean);
}

export interface ServerStatus__Output {
  'botInstalled': (boolean);
  'botPermissions': (number);
  'connectionCount': (number);
  'activeCall': (boolean);
}
