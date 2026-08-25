// Original file: ../interchat-protobuf/control/v1/server_service.proto

import type { RequestContext as _interchat_control_v1_RequestContext, RequestContext__Output as _interchat_control_v1_RequestContext__Output } from '../../../interchat/control/v1/RequestContext';
import type { ServerSpec as _interchat_control_v1_ServerSpec, ServerSpec__Output as _interchat_control_v1_ServerSpec__Output } from '../../../interchat/control/v1/ServerSpec';
import type { FieldMask as _google_protobuf_FieldMask, FieldMask__Output as _google_protobuf_FieldMask__Output } from '../../../google/protobuf/FieldMask';
import type { Long } from '@grpc/proto-loader';

export interface PatchServerConfigRequest {
  'context'?: (_interchat_control_v1_RequestContext | null);
  'serverId'?: (string);
  'spec'?: (_interchat_control_v1_ServerSpec | null);
  'updateMask'?: (_google_protobuf_FieldMask | null);
  'expectedVersion'?: (number | string | Long);
}

export interface PatchServerConfigRequest__Output {
  'context': (_interchat_control_v1_RequestContext__Output | null);
  'serverId': (string);
  'spec': (_interchat_control_v1_ServerSpec__Output | null);
  'updateMask': (_google_protobuf_FieldMask__Output | null);
  'expectedVersion': (number);
}
