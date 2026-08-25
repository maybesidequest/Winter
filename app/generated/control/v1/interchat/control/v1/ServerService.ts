// Original file: ../interchat-protobuf/control/v1/server_service.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { AddBlockRequest as _interchat_control_v1_AddBlockRequest, AddBlockRequest__Output as _interchat_control_v1_AddBlockRequest__Output } from '../../../interchat/control/v1/AddBlockRequest';
import type { BlocklistResponse as _interchat_control_v1_BlocklistResponse, BlocklistResponse__Output as _interchat_control_v1_BlocklistResponse__Output } from '../../../interchat/control/v1/BlocklistResponse';
import type { EmptyResponse as _interchat_control_v1_EmptyResponse, EmptyResponse__Output as _interchat_control_v1_EmptyResponse__Output } from '../../../interchat/control/v1/EmptyResponse';
import type { GetBlocklistRequest as _interchat_control_v1_GetBlocklistRequest, GetBlocklistRequest__Output as _interchat_control_v1_GetBlocklistRequest__Output } from '../../../interchat/control/v1/GetBlocklistRequest';
import type { GetServerRequest as _interchat_control_v1_GetServerRequest, GetServerRequest__Output as _interchat_control_v1_GetServerRequest__Output } from '../../../interchat/control/v1/GetServerRequest';
import type { PatchServerConfigRequest as _interchat_control_v1_PatchServerConfigRequest, PatchServerConfigRequest__Output as _interchat_control_v1_PatchServerConfigRequest__Output } from '../../../interchat/control/v1/PatchServerConfigRequest';
import type { RemoveBlockRequest as _interchat_control_v1_RemoveBlockRequest, RemoveBlockRequest__Output as _interchat_control_v1_RemoveBlockRequest__Output } from '../../../interchat/control/v1/RemoveBlockRequest';
import type { Server as _interchat_control_v1_Server, Server__Output as _interchat_control_v1_Server__Output } from '../../../interchat/control/v1/Server';
import type { ServerBlock as _interchat_control_v1_ServerBlock, ServerBlock__Output as _interchat_control_v1_ServerBlock__Output } from '../../../interchat/control/v1/ServerBlock';

export interface ServerServiceClient extends grpc.Client {
  AddBlock(argument: _interchat_control_v1_AddBlockRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_ServerBlock__Output>): grpc.ClientUnaryCall;
  AddBlock(argument: _interchat_control_v1_AddBlockRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_ServerBlock__Output>): grpc.ClientUnaryCall;
  AddBlock(argument: _interchat_control_v1_AddBlockRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_ServerBlock__Output>): grpc.ClientUnaryCall;
  AddBlock(argument: _interchat_control_v1_AddBlockRequest, callback: grpc.requestCallback<_interchat_control_v1_ServerBlock__Output>): grpc.ClientUnaryCall;
  addBlock(argument: _interchat_control_v1_AddBlockRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_ServerBlock__Output>): grpc.ClientUnaryCall;
  addBlock(argument: _interchat_control_v1_AddBlockRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_ServerBlock__Output>): grpc.ClientUnaryCall;
  addBlock(argument: _interchat_control_v1_AddBlockRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_ServerBlock__Output>): grpc.ClientUnaryCall;
  addBlock(argument: _interchat_control_v1_AddBlockRequest, callback: grpc.requestCallback<_interchat_control_v1_ServerBlock__Output>): grpc.ClientUnaryCall;
  
  GetBlocklist(argument: _interchat_control_v1_GetBlocklistRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_BlocklistResponse__Output>): grpc.ClientUnaryCall;
  GetBlocklist(argument: _interchat_control_v1_GetBlocklistRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_BlocklistResponse__Output>): grpc.ClientUnaryCall;
  GetBlocklist(argument: _interchat_control_v1_GetBlocklistRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_BlocklistResponse__Output>): grpc.ClientUnaryCall;
  GetBlocklist(argument: _interchat_control_v1_GetBlocklistRequest, callback: grpc.requestCallback<_interchat_control_v1_BlocklistResponse__Output>): grpc.ClientUnaryCall;
  getBlocklist(argument: _interchat_control_v1_GetBlocklistRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_BlocklistResponse__Output>): grpc.ClientUnaryCall;
  getBlocklist(argument: _interchat_control_v1_GetBlocklistRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_BlocklistResponse__Output>): grpc.ClientUnaryCall;
  getBlocklist(argument: _interchat_control_v1_GetBlocklistRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_BlocklistResponse__Output>): grpc.ClientUnaryCall;
  getBlocklist(argument: _interchat_control_v1_GetBlocklistRequest, callback: grpc.requestCallback<_interchat_control_v1_BlocklistResponse__Output>): grpc.ClientUnaryCall;
  
  GetServer(argument: _interchat_control_v1_GetServerRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Server__Output>): grpc.ClientUnaryCall;
  GetServer(argument: _interchat_control_v1_GetServerRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_Server__Output>): grpc.ClientUnaryCall;
  GetServer(argument: _interchat_control_v1_GetServerRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Server__Output>): grpc.ClientUnaryCall;
  GetServer(argument: _interchat_control_v1_GetServerRequest, callback: grpc.requestCallback<_interchat_control_v1_Server__Output>): grpc.ClientUnaryCall;
  getServer(argument: _interchat_control_v1_GetServerRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Server__Output>): grpc.ClientUnaryCall;
  getServer(argument: _interchat_control_v1_GetServerRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_Server__Output>): grpc.ClientUnaryCall;
  getServer(argument: _interchat_control_v1_GetServerRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Server__Output>): grpc.ClientUnaryCall;
  getServer(argument: _interchat_control_v1_GetServerRequest, callback: grpc.requestCallback<_interchat_control_v1_Server__Output>): grpc.ClientUnaryCall;
  
  PatchServerConfig(argument: _interchat_control_v1_PatchServerConfigRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Server__Output>): grpc.ClientUnaryCall;
  PatchServerConfig(argument: _interchat_control_v1_PatchServerConfigRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_Server__Output>): grpc.ClientUnaryCall;
  PatchServerConfig(argument: _interchat_control_v1_PatchServerConfigRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Server__Output>): grpc.ClientUnaryCall;
  PatchServerConfig(argument: _interchat_control_v1_PatchServerConfigRequest, callback: grpc.requestCallback<_interchat_control_v1_Server__Output>): grpc.ClientUnaryCall;
  patchServerConfig(argument: _interchat_control_v1_PatchServerConfigRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Server__Output>): grpc.ClientUnaryCall;
  patchServerConfig(argument: _interchat_control_v1_PatchServerConfigRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_Server__Output>): grpc.ClientUnaryCall;
  patchServerConfig(argument: _interchat_control_v1_PatchServerConfigRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Server__Output>): grpc.ClientUnaryCall;
  patchServerConfig(argument: _interchat_control_v1_PatchServerConfigRequest, callback: grpc.requestCallback<_interchat_control_v1_Server__Output>): grpc.ClientUnaryCall;
  
  RemoveBlock(argument: _interchat_control_v1_RemoveBlockRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  RemoveBlock(argument: _interchat_control_v1_RemoveBlockRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  RemoveBlock(argument: _interchat_control_v1_RemoveBlockRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  RemoveBlock(argument: _interchat_control_v1_RemoveBlockRequest, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  removeBlock(argument: _interchat_control_v1_RemoveBlockRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  removeBlock(argument: _interchat_control_v1_RemoveBlockRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  removeBlock(argument: _interchat_control_v1_RemoveBlockRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  removeBlock(argument: _interchat_control_v1_RemoveBlockRequest, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface ServerServiceHandlers extends grpc.UntypedServiceImplementation {
  AddBlock: grpc.handleUnaryCall<_interchat_control_v1_AddBlockRequest__Output, _interchat_control_v1_ServerBlock>;
  
  GetBlocklist: grpc.handleUnaryCall<_interchat_control_v1_GetBlocklistRequest__Output, _interchat_control_v1_BlocklistResponse>;
  
  GetServer: grpc.handleUnaryCall<_interchat_control_v1_GetServerRequest__Output, _interchat_control_v1_Server>;
  
  PatchServerConfig: grpc.handleUnaryCall<_interchat_control_v1_PatchServerConfigRequest__Output, _interchat_control_v1_Server>;
  
  RemoveBlock: grpc.handleUnaryCall<_interchat_control_v1_RemoveBlockRequest__Output, _interchat_control_v1_EmptyResponse>;
  
}

export interface ServerServiceDefinition extends grpc.ServiceDefinition {
  AddBlock: MethodDefinition<_interchat_control_v1_AddBlockRequest, _interchat_control_v1_ServerBlock, _interchat_control_v1_AddBlockRequest__Output, _interchat_control_v1_ServerBlock__Output>
  GetBlocklist: MethodDefinition<_interchat_control_v1_GetBlocklistRequest, _interchat_control_v1_BlocklistResponse, _interchat_control_v1_GetBlocklistRequest__Output, _interchat_control_v1_BlocklistResponse__Output>
  GetServer: MethodDefinition<_interchat_control_v1_GetServerRequest, _interchat_control_v1_Server, _interchat_control_v1_GetServerRequest__Output, _interchat_control_v1_Server__Output>
  PatchServerConfig: MethodDefinition<_interchat_control_v1_PatchServerConfigRequest, _interchat_control_v1_Server, _interchat_control_v1_PatchServerConfigRequest__Output, _interchat_control_v1_Server__Output>
  RemoveBlock: MethodDefinition<_interchat_control_v1_RemoveBlockRequest, _interchat_control_v1_EmptyResponse, _interchat_control_v1_RemoveBlockRequest__Output, _interchat_control_v1_EmptyResponse__Output>
}
