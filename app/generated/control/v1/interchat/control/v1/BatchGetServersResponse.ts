// Original file: ../interchat-protobuf/control/v1/server_service.proto

import type { Server as _interchat_control_v1_Server, Server__Output as _interchat_control_v1_Server__Output } from '../../../interchat/control/v1/Server';

export interface BatchGetServersResponse {
  'servers'?: (_interchat_control_v1_Server)[];
  'missingServerIds'?: (string)[];
}

export interface BatchGetServersResponse__Output {
  'servers': (_interchat_control_v1_Server__Output)[];
  'missingServerIds': (string)[];
}
