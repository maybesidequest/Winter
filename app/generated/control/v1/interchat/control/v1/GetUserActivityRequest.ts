// Original file: /home/zev/Documents/code/interchat-protobuf/control/v1/user_service.proto

import type { RequestContext as _interchat_control_v1_RequestContext, RequestContext__Output as _interchat_control_v1_RequestContext__Output } from '../../../interchat/control/v1/RequestContext';

export interface GetUserActivityRequest {
  'context'?: (_interchat_control_v1_RequestContext | null);
  'userId'?: (string);
  'year'?: (number);
  'month'?: (number);
  'limit'?: (number);
}

export interface GetUserActivityRequest__Output {
  'context': (_interchat_control_v1_RequestContext__Output | null);
  'userId': (string);
  'year': (number);
  'month': (number);
  'limit': (number);
}
