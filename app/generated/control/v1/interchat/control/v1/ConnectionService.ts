// Original file: ../interchat-protobuf/control/v1/connection_service.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { ConnectChannelRequest as _interchat_control_v1_ConnectChannelRequest, ConnectChannelRequest__Output as _interchat_control_v1_ConnectChannelRequest__Output } from '../../../interchat/control/v1/ConnectChannelRequest';
import type { Connection as _interchat_control_v1_Connection, Connection__Output as _interchat_control_v1_Connection__Output } from '../../../interchat/control/v1/Connection';
import type { ConnectionsResponse as _interchat_control_v1_ConnectionsResponse, ConnectionsResponse__Output as _interchat_control_v1_ConnectionsResponse__Output } from '../../../interchat/control/v1/ConnectionsResponse';
import type { DisconnectChannelRequest as _interchat_control_v1_DisconnectChannelRequest, DisconnectChannelRequest__Output as _interchat_control_v1_DisconnectChannelRequest__Output } from '../../../interchat/control/v1/DisconnectChannelRequest';
import type { EmptyResponse as _interchat_control_v1_EmptyResponse, EmptyResponse__Output as _interchat_control_v1_EmptyResponse__Output } from '../../../interchat/control/v1/EmptyResponse';
import type { GetConnectionsRequest as _interchat_control_v1_GetConnectionsRequest, GetConnectionsRequest__Output as _interchat_control_v1_GetConnectionsRequest__Output } from '../../../interchat/control/v1/GetConnectionsRequest';
import type { RepairConnectionWebhooksRequest as _interchat_control_v1_RepairConnectionWebhooksRequest, RepairConnectionWebhooksRequest__Output as _interchat_control_v1_RepairConnectionWebhooksRequest__Output } from '../../../interchat/control/v1/RepairConnectionWebhooksRequest';
import type { ToggleConnectionRequest as _interchat_control_v1_ToggleConnectionRequest, ToggleConnectionRequest__Output as _interchat_control_v1_ToggleConnectionRequest__Output } from '../../../interchat/control/v1/ToggleConnectionRequest';

export interface ConnectionServiceClient extends grpc.Client {
  ConnectChannel(argument: _interchat_control_v1_ConnectChannelRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Connection__Output>): grpc.ClientUnaryCall;
  ConnectChannel(argument: _interchat_control_v1_ConnectChannelRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_Connection__Output>): grpc.ClientUnaryCall;
  ConnectChannel(argument: _interchat_control_v1_ConnectChannelRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Connection__Output>): grpc.ClientUnaryCall;
  ConnectChannel(argument: _interchat_control_v1_ConnectChannelRequest, callback: grpc.requestCallback<_interchat_control_v1_Connection__Output>): grpc.ClientUnaryCall;
  connectChannel(argument: _interchat_control_v1_ConnectChannelRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Connection__Output>): grpc.ClientUnaryCall;
  connectChannel(argument: _interchat_control_v1_ConnectChannelRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_Connection__Output>): grpc.ClientUnaryCall;
  connectChannel(argument: _interchat_control_v1_ConnectChannelRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Connection__Output>): grpc.ClientUnaryCall;
  connectChannel(argument: _interchat_control_v1_ConnectChannelRequest, callback: grpc.requestCallback<_interchat_control_v1_Connection__Output>): grpc.ClientUnaryCall;
  
  DisconnectChannel(argument: _interchat_control_v1_DisconnectChannelRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  DisconnectChannel(argument: _interchat_control_v1_DisconnectChannelRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  DisconnectChannel(argument: _interchat_control_v1_DisconnectChannelRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  DisconnectChannel(argument: _interchat_control_v1_DisconnectChannelRequest, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  disconnectChannel(argument: _interchat_control_v1_DisconnectChannelRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  disconnectChannel(argument: _interchat_control_v1_DisconnectChannelRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  disconnectChannel(argument: _interchat_control_v1_DisconnectChannelRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  disconnectChannel(argument: _interchat_control_v1_DisconnectChannelRequest, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  
  GetConnections(argument: _interchat_control_v1_GetConnectionsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_ConnectionsResponse__Output>): grpc.ClientUnaryCall;
  GetConnections(argument: _interchat_control_v1_GetConnectionsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_ConnectionsResponse__Output>): grpc.ClientUnaryCall;
  GetConnections(argument: _interchat_control_v1_GetConnectionsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_ConnectionsResponse__Output>): grpc.ClientUnaryCall;
  GetConnections(argument: _interchat_control_v1_GetConnectionsRequest, callback: grpc.requestCallback<_interchat_control_v1_ConnectionsResponse__Output>): grpc.ClientUnaryCall;
  getConnections(argument: _interchat_control_v1_GetConnectionsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_ConnectionsResponse__Output>): grpc.ClientUnaryCall;
  getConnections(argument: _interchat_control_v1_GetConnectionsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_ConnectionsResponse__Output>): grpc.ClientUnaryCall;
  getConnections(argument: _interchat_control_v1_GetConnectionsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_ConnectionsResponse__Output>): grpc.ClientUnaryCall;
  getConnections(argument: _interchat_control_v1_GetConnectionsRequest, callback: grpc.requestCallback<_interchat_control_v1_ConnectionsResponse__Output>): grpc.ClientUnaryCall;
  
  RepairConnectionWebhooks(argument: _interchat_control_v1_RepairConnectionWebhooksRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Connection__Output>): grpc.ClientUnaryCall;
  RepairConnectionWebhooks(argument: _interchat_control_v1_RepairConnectionWebhooksRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_Connection__Output>): grpc.ClientUnaryCall;
  RepairConnectionWebhooks(argument: _interchat_control_v1_RepairConnectionWebhooksRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Connection__Output>): grpc.ClientUnaryCall;
  RepairConnectionWebhooks(argument: _interchat_control_v1_RepairConnectionWebhooksRequest, callback: grpc.requestCallback<_interchat_control_v1_Connection__Output>): grpc.ClientUnaryCall;
  repairConnectionWebhooks(argument: _interchat_control_v1_RepairConnectionWebhooksRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Connection__Output>): grpc.ClientUnaryCall;
  repairConnectionWebhooks(argument: _interchat_control_v1_RepairConnectionWebhooksRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_Connection__Output>): grpc.ClientUnaryCall;
  repairConnectionWebhooks(argument: _interchat_control_v1_RepairConnectionWebhooksRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Connection__Output>): grpc.ClientUnaryCall;
  repairConnectionWebhooks(argument: _interchat_control_v1_RepairConnectionWebhooksRequest, callback: grpc.requestCallback<_interchat_control_v1_Connection__Output>): grpc.ClientUnaryCall;
  
  ToggleConnection(argument: _interchat_control_v1_ToggleConnectionRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Connection__Output>): grpc.ClientUnaryCall;
  ToggleConnection(argument: _interchat_control_v1_ToggleConnectionRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_Connection__Output>): grpc.ClientUnaryCall;
  ToggleConnection(argument: _interchat_control_v1_ToggleConnectionRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Connection__Output>): grpc.ClientUnaryCall;
  ToggleConnection(argument: _interchat_control_v1_ToggleConnectionRequest, callback: grpc.requestCallback<_interchat_control_v1_Connection__Output>): grpc.ClientUnaryCall;
  toggleConnection(argument: _interchat_control_v1_ToggleConnectionRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Connection__Output>): grpc.ClientUnaryCall;
  toggleConnection(argument: _interchat_control_v1_ToggleConnectionRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_Connection__Output>): grpc.ClientUnaryCall;
  toggleConnection(argument: _interchat_control_v1_ToggleConnectionRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Connection__Output>): grpc.ClientUnaryCall;
  toggleConnection(argument: _interchat_control_v1_ToggleConnectionRequest, callback: grpc.requestCallback<_interchat_control_v1_Connection__Output>): grpc.ClientUnaryCall;
  
}

export interface ConnectionServiceHandlers extends grpc.UntypedServiceImplementation {
  ConnectChannel: grpc.handleUnaryCall<_interchat_control_v1_ConnectChannelRequest__Output, _interchat_control_v1_Connection>;
  
  DisconnectChannel: grpc.handleUnaryCall<_interchat_control_v1_DisconnectChannelRequest__Output, _interchat_control_v1_EmptyResponse>;
  
  GetConnections: grpc.handleUnaryCall<_interchat_control_v1_GetConnectionsRequest__Output, _interchat_control_v1_ConnectionsResponse>;
  
  RepairConnectionWebhooks: grpc.handleUnaryCall<_interchat_control_v1_RepairConnectionWebhooksRequest__Output, _interchat_control_v1_Connection>;
  
  ToggleConnection: grpc.handleUnaryCall<_interchat_control_v1_ToggleConnectionRequest__Output, _interchat_control_v1_Connection>;
  
}

export interface ConnectionServiceDefinition extends grpc.ServiceDefinition {
  ConnectChannel: MethodDefinition<_interchat_control_v1_ConnectChannelRequest, _interchat_control_v1_Connection, _interchat_control_v1_ConnectChannelRequest__Output, _interchat_control_v1_Connection__Output>
  DisconnectChannel: MethodDefinition<_interchat_control_v1_DisconnectChannelRequest, _interchat_control_v1_EmptyResponse, _interchat_control_v1_DisconnectChannelRequest__Output, _interchat_control_v1_EmptyResponse__Output>
  GetConnections: MethodDefinition<_interchat_control_v1_GetConnectionsRequest, _interchat_control_v1_ConnectionsResponse, _interchat_control_v1_GetConnectionsRequest__Output, _interchat_control_v1_ConnectionsResponse__Output>
  RepairConnectionWebhooks: MethodDefinition<_interchat_control_v1_RepairConnectionWebhooksRequest, _interchat_control_v1_Connection, _interchat_control_v1_RepairConnectionWebhooksRequest__Output, _interchat_control_v1_Connection__Output>
  ToggleConnection: MethodDefinition<_interchat_control_v1_ToggleConnectionRequest, _interchat_control_v1_Connection, _interchat_control_v1_ToggleConnectionRequest__Output, _interchat_control_v1_Connection__Output>
}
