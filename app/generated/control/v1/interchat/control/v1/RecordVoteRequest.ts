// Original file: ../interchat-protobuf/control/v1/user_service.proto

import type { RequestContext as _interchat_control_v1_RequestContext, RequestContext__Output as _interchat_control_v1_RequestContext__Output } from '../../../interchat/control/v1/RequestContext';
import type { VoteProvider as _interchat_control_v1_VoteProvider, VoteProvider__Output as _interchat_control_v1_VoteProvider__Output } from '../../../interchat/control/v1/VoteProvider';

export interface RecordVoteRequest {
  'context'?: (_interchat_control_v1_RequestContext | null);
  'provider'?: (_interchat_control_v1_VoteProvider);
  'rawPayload'?: (Buffer | Uint8Array | string);
  'signature'?: (string);
  'signatureTimestamp'?: (string);
}

export interface RecordVoteRequest__Output {
  'context': (_interchat_control_v1_RequestContext__Output | null);
  'provider': (_interchat_control_v1_VoteProvider__Output);
  'rawPayload': (Buffer);
  'signature': (string);
  'signatureTimestamp': (string);
}
