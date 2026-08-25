// Original file: ../interchat-protobuf/control/v1/models.proto

import type { ServerMetadata as _interchat_control_v1_ServerMetadata, ServerMetadata__Output as _interchat_control_v1_ServerMetadata__Output } from '../../../interchat/control/v1/ServerMetadata';
import type { ServerSpec as _interchat_control_v1_ServerSpec, ServerSpec__Output as _interchat_control_v1_ServerSpec__Output } from '../../../interchat/control/v1/ServerSpec';
import type { ServerStatus as _interchat_control_v1_ServerStatus, ServerStatus__Output as _interchat_control_v1_ServerStatus__Output } from '../../../interchat/control/v1/ServerStatus';
import type { Long } from '@grpc/proto-loader';

export interface Server {
  'metadata'?: (_interchat_control_v1_ServerMetadata | null);
  'spec'?: (_interchat_control_v1_ServerSpec | null);
  'status'?: (_interchat_control_v1_ServerStatus | null);
  'version'?: (number | string | Long);
}

export interface Server__Output {
  'metadata': (_interchat_control_v1_ServerMetadata__Output | null);
  'spec': (_interchat_control_v1_ServerSpec__Output | null);
  'status': (_interchat_control_v1_ServerStatus__Output | null);
  'version': (number);
}
