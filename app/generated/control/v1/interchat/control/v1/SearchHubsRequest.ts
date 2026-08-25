// Original file: ../interchat-protobuf/control/v1/hub_service.proto

import type { RequestContext as _interchat_control_v1_RequestContext, RequestContext__Output as _interchat_control_v1_RequestContext__Output } from '../../../interchat/control/v1/RequestContext';
import type { HubSearchSort as _interchat_control_v1_HubSearchSort, HubSearchSort__Output as _interchat_control_v1_HubSearchSort__Output } from '../../../interchat/control/v1/HubSearchSort';
import type { NsfwFilter as _interchat_control_v1_NsfwFilter, NsfwFilter__Output as _interchat_control_v1_NsfwFilter__Output } from '../../../interchat/control/v1/NsfwFilter';

export interface SearchHubsRequest {
  'context'?: (_interchat_control_v1_RequestContext | null);
  'query'?: (string);
  'sort'?: (_interchat_control_v1_HubSearchSort);
  'tags'?: (string)[];
  'language'?: (string);
  'region'?: (string);
  'nsfwFilter'?: (_interchat_control_v1_NsfwFilter);
  'limit'?: (number);
  'cursor'?: (string);
}

export interface SearchHubsRequest__Output {
  'context': (_interchat_control_v1_RequestContext__Output | null);
  'query': (string);
  'sort': (_interchat_control_v1_HubSearchSort__Output);
  'tags': (string)[];
  'language': (string);
  'region': (string);
  'nsfwFilter': (_interchat_control_v1_NsfwFilter__Output);
  'limit': (number);
  'cursor': (string);
}
