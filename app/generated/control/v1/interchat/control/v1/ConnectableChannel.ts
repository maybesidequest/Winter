// Original file: ../interchat-protobuf/control/v1/server_service.proto

import type { Long } from '@grpc/proto-loader';

export interface ConnectableChannel {
  'serverId'?: (string);
  'channelId'?: (string);
  'name'?: (string);
  'type'?: (number);
  'actorPermissions'?: (number | string | Long);
  'botPermissions'?: (number | string | Long);
  'connectable'?: (boolean);
  'rejectionReason'?: (string);
}

export interface ConnectableChannel__Output {
  'serverId': (string);
  'channelId': (string);
  'name': (string);
  'type': (number);
  'actorPermissions': (number);
  'botPermissions': (number);
  'connectable': (boolean);
  'rejectionReason': (string);
}
