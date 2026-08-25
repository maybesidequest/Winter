// Original file: ../interchat-protobuf/control/v1/models.proto

import type { Long } from '@grpc/proto-loader';

export interface HubStaffMemberSpec {
  'role'?: (string);
  'permissionsBitmask'?: (number | string | Long);
  'assignedBy'?: (string);
}

export interface HubStaffMemberSpec__Output {
  'role': (string);
  'permissionsBitmask': (number);
  'assignedBy': (string);
}
