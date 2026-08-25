// Original file: ../interchat-protobuf/control/v1/models.proto

import type { ActorType as _interchat_control_v1_ActorType, ActorType__Output as _interchat_control_v1_ActorType__Output } from '../../../interchat/control/v1/ActorType';

export interface RequestContext {
  'requestId'?: (string);
  'actorId'?: (string);
  'actorType'?: (_interchat_control_v1_ActorType);
  'servicePrincipal'?: (string);
  'idempotencyKey'?: (string);
  'traceId'?: (string);
  'source'?: (string);
}

export interface RequestContext__Output {
  'requestId': (string);
  'actorId': (string);
  'actorType': (_interchat_control_v1_ActorType__Output);
  'servicePrincipal': (string);
  'idempotencyKey': (string);
  'traceId': (string);
  'source': (string);
}
