// Original file: ../interchat-protobuf/control/v1/models.proto

import type { ConnectionMetadata as _interchat_control_v1_ConnectionMetadata, ConnectionMetadata__Output as _interchat_control_v1_ConnectionMetadata__Output } from '../../../interchat/control/v1/ConnectionMetadata';
import type { ConnectionSpec as _interchat_control_v1_ConnectionSpec, ConnectionSpec__Output as _interchat_control_v1_ConnectionSpec__Output } from '../../../interchat/control/v1/ConnectionSpec';
import type { ConnectionStatus as _interchat_control_v1_ConnectionStatus, ConnectionStatus__Output as _interchat_control_v1_ConnectionStatus__Output } from '../../../interchat/control/v1/ConnectionStatus';
import type { Long } from '@grpc/proto-loader';

export interface Connection {
  'metadata'?: (_interchat_control_v1_ConnectionMetadata | null);
  'spec'?: (_interchat_control_v1_ConnectionSpec | null);
  'status'?: (_interchat_control_v1_ConnectionStatus | null);
  'version'?: (number | string | Long);
}

export interface Connection__Output {
  'metadata': (_interchat_control_v1_ConnectionMetadata__Output | null);
  'spec': (_interchat_control_v1_ConnectionSpec__Output | null);
  'status': (_interchat_control_v1_ConnectionStatus__Output | null);
  'version': (number);
}
