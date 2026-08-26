// Original file: ../interchat-protobuf/control/v1/models.proto

import type { Long } from '@grpc/proto-loader';

export interface HubRoleSpec {
  'name'?: (string);
  'permissionsBitmask'?: (number | string | Long);
  'position'?: (number);
}

export interface HubRoleSpec__Output {
  'name': (string);
  'permissionsBitmask': (number);
  'position': (number);
}
