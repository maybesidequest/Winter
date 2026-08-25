// Original file: ../interchat-protobuf/control/v1/models.proto

import type { Long } from '@grpc/proto-loader';

export interface HubLogConfig {
  'hubId'?: (string);
  'channelId'?: (string);
  'eventFlags'?: (number | string | Long);
  'notificationRoleId'?: (string);
}

export interface HubLogConfig__Output {
  'hubId': (string);
  'channelId': (string);
  'eventFlags': (number);
  'notificationRoleId': (string);
}
