// Original file: ../interchat-protobuf/control/v1/models.proto

import type { HubRoleMetadata as _interchat_control_v1_HubRoleMetadata, HubRoleMetadata__Output as _interchat_control_v1_HubRoleMetadata__Output } from '../../../interchat/control/v1/HubRoleMetadata';
import type { HubRoleSpec as _interchat_control_v1_HubRoleSpec, HubRoleSpec__Output as _interchat_control_v1_HubRoleSpec__Output } from '../../../interchat/control/v1/HubRoleSpec';
import type { HubRoleStatus as _interchat_control_v1_HubRoleStatus, HubRoleStatus__Output as _interchat_control_v1_HubRoleStatus__Output } from '../../../interchat/control/v1/HubRoleStatus';
import type { Long } from '@grpc/proto-loader';

export interface HubRole {
  'metadata'?: (_interchat_control_v1_HubRoleMetadata | null);
  'spec'?: (_interchat_control_v1_HubRoleSpec | null);
  'status'?: (_interchat_control_v1_HubRoleStatus | null);
  'version'?: (number | string | Long);
}

export interface HubRole__Output {
  'metadata': (_interchat_control_v1_HubRoleMetadata__Output | null);
  'spec': (_interchat_control_v1_HubRoleSpec__Output | null);
  'status': (_interchat_control_v1_HubRoleStatus__Output | null);
  'version': (number);
}
