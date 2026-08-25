// Original file: ../interchat-protobuf/control/v1/models.proto

import type { HubMetadata as _interchat_control_v1_HubMetadata, HubMetadata__Output as _interchat_control_v1_HubMetadata__Output } from '../../../interchat/control/v1/HubMetadata';
import type { HubSpec as _interchat_control_v1_HubSpec, HubSpec__Output as _interchat_control_v1_HubSpec__Output } from '../../../interchat/control/v1/HubSpec';
import type { HubStatus as _interchat_control_v1_HubStatus, HubStatus__Output as _interchat_control_v1_HubStatus__Output } from '../../../interchat/control/v1/HubStatus';
import type { Long } from '@grpc/proto-loader';

export interface Hub {
  'metadata'?: (_interchat_control_v1_HubMetadata | null);
  'spec'?: (_interchat_control_v1_HubSpec | null);
  'status'?: (_interchat_control_v1_HubStatus | null);
  'version'?: (number | string | Long);
}

export interface Hub__Output {
  'metadata': (_interchat_control_v1_HubMetadata__Output | null);
  'spec': (_interchat_control_v1_HubSpec__Output | null);
  'status': (_interchat_control_v1_HubStatus__Output | null);
  'version': (number);
}
