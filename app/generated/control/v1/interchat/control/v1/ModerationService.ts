// Original file: ../interchat-protobuf/control/v1/moderation_service.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { Appeal as _interchat_control_v1_Appeal, Appeal__Output as _interchat_control_v1_Appeal__Output } from '../../../interchat/control/v1/Appeal';
import type { ApplySanctionRequest as _interchat_control_v1_ApplySanctionRequest, ApplySanctionRequest__Output as _interchat_control_v1_ApplySanctionRequest__Output } from '../../../interchat/control/v1/ApplySanctionRequest';
import type { GetInfractionsRequest as _interchat_control_v1_GetInfractionsRequest, GetInfractionsRequest__Output as _interchat_control_v1_GetInfractionsRequest__Output } from '../../../interchat/control/v1/GetInfractionsRequest';
import type { Infraction as _interchat_control_v1_Infraction, Infraction__Output as _interchat_control_v1_Infraction__Output } from '../../../interchat/control/v1/Infraction';
import type { InfractionsResponse as _interchat_control_v1_InfractionsResponse, InfractionsResponse__Output as _interchat_control_v1_InfractionsResponse__Output } from '../../../interchat/control/v1/InfractionsResponse';
import type { ListMyAppealableInfractionsRequest as _interchat_control_v1_ListMyAppealableInfractionsRequest, ListMyAppealableInfractionsRequest__Output as _interchat_control_v1_ListMyAppealableInfractionsRequest__Output } from '../../../interchat/control/v1/ListMyAppealableInfractionsRequest';
import type { RevokeSanctionRequest as _interchat_control_v1_RevokeSanctionRequest, RevokeSanctionRequest__Output as _interchat_control_v1_RevokeSanctionRequest__Output } from '../../../interchat/control/v1/RevokeSanctionRequest';
import type { SubmitAppealRequest as _interchat_control_v1_SubmitAppealRequest, SubmitAppealRequest__Output as _interchat_control_v1_SubmitAppealRequest__Output } from '../../../interchat/control/v1/SubmitAppealRequest';

export interface ModerationServiceClient extends grpc.Client {
  ApplySanction(argument: _interchat_control_v1_ApplySanctionRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Infraction__Output>): grpc.ClientUnaryCall;
  ApplySanction(argument: _interchat_control_v1_ApplySanctionRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_Infraction__Output>): grpc.ClientUnaryCall;
  ApplySanction(argument: _interchat_control_v1_ApplySanctionRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Infraction__Output>): grpc.ClientUnaryCall;
  ApplySanction(argument: _interchat_control_v1_ApplySanctionRequest, callback: grpc.requestCallback<_interchat_control_v1_Infraction__Output>): grpc.ClientUnaryCall;
  applySanction(argument: _interchat_control_v1_ApplySanctionRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Infraction__Output>): grpc.ClientUnaryCall;
  applySanction(argument: _interchat_control_v1_ApplySanctionRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_Infraction__Output>): grpc.ClientUnaryCall;
  applySanction(argument: _interchat_control_v1_ApplySanctionRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Infraction__Output>): grpc.ClientUnaryCall;
  applySanction(argument: _interchat_control_v1_ApplySanctionRequest, callback: grpc.requestCallback<_interchat_control_v1_Infraction__Output>): grpc.ClientUnaryCall;
  
  GetInfractions(argument: _interchat_control_v1_GetInfractionsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_InfractionsResponse__Output>): grpc.ClientUnaryCall;
  GetInfractions(argument: _interchat_control_v1_GetInfractionsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_InfractionsResponse__Output>): grpc.ClientUnaryCall;
  GetInfractions(argument: _interchat_control_v1_GetInfractionsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_InfractionsResponse__Output>): grpc.ClientUnaryCall;
  GetInfractions(argument: _interchat_control_v1_GetInfractionsRequest, callback: grpc.requestCallback<_interchat_control_v1_InfractionsResponse__Output>): grpc.ClientUnaryCall;
  getInfractions(argument: _interchat_control_v1_GetInfractionsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_InfractionsResponse__Output>): grpc.ClientUnaryCall;
  getInfractions(argument: _interchat_control_v1_GetInfractionsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_InfractionsResponse__Output>): grpc.ClientUnaryCall;
  getInfractions(argument: _interchat_control_v1_GetInfractionsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_InfractionsResponse__Output>): grpc.ClientUnaryCall;
  getInfractions(argument: _interchat_control_v1_GetInfractionsRequest, callback: grpc.requestCallback<_interchat_control_v1_InfractionsResponse__Output>): grpc.ClientUnaryCall;
  
  ListMyAppealableInfractions(argument: _interchat_control_v1_ListMyAppealableInfractionsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_InfractionsResponse__Output>): grpc.ClientUnaryCall;
  ListMyAppealableInfractions(argument: _interchat_control_v1_ListMyAppealableInfractionsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_InfractionsResponse__Output>): grpc.ClientUnaryCall;
  ListMyAppealableInfractions(argument: _interchat_control_v1_ListMyAppealableInfractionsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_InfractionsResponse__Output>): grpc.ClientUnaryCall;
  ListMyAppealableInfractions(argument: _interchat_control_v1_ListMyAppealableInfractionsRequest, callback: grpc.requestCallback<_interchat_control_v1_InfractionsResponse__Output>): grpc.ClientUnaryCall;
  listMyAppealableInfractions(argument: _interchat_control_v1_ListMyAppealableInfractionsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_InfractionsResponse__Output>): grpc.ClientUnaryCall;
  listMyAppealableInfractions(argument: _interchat_control_v1_ListMyAppealableInfractionsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_InfractionsResponse__Output>): grpc.ClientUnaryCall;
  listMyAppealableInfractions(argument: _interchat_control_v1_ListMyAppealableInfractionsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_InfractionsResponse__Output>): grpc.ClientUnaryCall;
  listMyAppealableInfractions(argument: _interchat_control_v1_ListMyAppealableInfractionsRequest, callback: grpc.requestCallback<_interchat_control_v1_InfractionsResponse__Output>): grpc.ClientUnaryCall;
  
  RevokeSanction(argument: _interchat_control_v1_RevokeSanctionRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Infraction__Output>): grpc.ClientUnaryCall;
  RevokeSanction(argument: _interchat_control_v1_RevokeSanctionRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_Infraction__Output>): grpc.ClientUnaryCall;
  RevokeSanction(argument: _interchat_control_v1_RevokeSanctionRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Infraction__Output>): grpc.ClientUnaryCall;
  RevokeSanction(argument: _interchat_control_v1_RevokeSanctionRequest, callback: grpc.requestCallback<_interchat_control_v1_Infraction__Output>): grpc.ClientUnaryCall;
  revokeSanction(argument: _interchat_control_v1_RevokeSanctionRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Infraction__Output>): grpc.ClientUnaryCall;
  revokeSanction(argument: _interchat_control_v1_RevokeSanctionRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_Infraction__Output>): grpc.ClientUnaryCall;
  revokeSanction(argument: _interchat_control_v1_RevokeSanctionRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Infraction__Output>): grpc.ClientUnaryCall;
  revokeSanction(argument: _interchat_control_v1_RevokeSanctionRequest, callback: grpc.requestCallback<_interchat_control_v1_Infraction__Output>): grpc.ClientUnaryCall;
  
  SubmitAppeal(argument: _interchat_control_v1_SubmitAppealRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Appeal__Output>): grpc.ClientUnaryCall;
  SubmitAppeal(argument: _interchat_control_v1_SubmitAppealRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_Appeal__Output>): grpc.ClientUnaryCall;
  SubmitAppeal(argument: _interchat_control_v1_SubmitAppealRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Appeal__Output>): grpc.ClientUnaryCall;
  SubmitAppeal(argument: _interchat_control_v1_SubmitAppealRequest, callback: grpc.requestCallback<_interchat_control_v1_Appeal__Output>): grpc.ClientUnaryCall;
  submitAppeal(argument: _interchat_control_v1_SubmitAppealRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Appeal__Output>): grpc.ClientUnaryCall;
  submitAppeal(argument: _interchat_control_v1_SubmitAppealRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_Appeal__Output>): grpc.ClientUnaryCall;
  submitAppeal(argument: _interchat_control_v1_SubmitAppealRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Appeal__Output>): grpc.ClientUnaryCall;
  submitAppeal(argument: _interchat_control_v1_SubmitAppealRequest, callback: grpc.requestCallback<_interchat_control_v1_Appeal__Output>): grpc.ClientUnaryCall;
  
}

export interface ModerationServiceHandlers extends grpc.UntypedServiceImplementation {
  ApplySanction: grpc.handleUnaryCall<_interchat_control_v1_ApplySanctionRequest__Output, _interchat_control_v1_Infraction>;
  
  GetInfractions: grpc.handleUnaryCall<_interchat_control_v1_GetInfractionsRequest__Output, _interchat_control_v1_InfractionsResponse>;
  
  ListMyAppealableInfractions: grpc.handleUnaryCall<_interchat_control_v1_ListMyAppealableInfractionsRequest__Output, _interchat_control_v1_InfractionsResponse>;
  
  RevokeSanction: grpc.handleUnaryCall<_interchat_control_v1_RevokeSanctionRequest__Output, _interchat_control_v1_Infraction>;
  
  SubmitAppeal: grpc.handleUnaryCall<_interchat_control_v1_SubmitAppealRequest__Output, _interchat_control_v1_Appeal>;
  
}

export interface ModerationServiceDefinition extends grpc.ServiceDefinition {
  ApplySanction: MethodDefinition<_interchat_control_v1_ApplySanctionRequest, _interchat_control_v1_Infraction, _interchat_control_v1_ApplySanctionRequest__Output, _interchat_control_v1_Infraction__Output>
  GetInfractions: MethodDefinition<_interchat_control_v1_GetInfractionsRequest, _interchat_control_v1_InfractionsResponse, _interchat_control_v1_GetInfractionsRequest__Output, _interchat_control_v1_InfractionsResponse__Output>
  ListMyAppealableInfractions: MethodDefinition<_interchat_control_v1_ListMyAppealableInfractionsRequest, _interchat_control_v1_InfractionsResponse, _interchat_control_v1_ListMyAppealableInfractionsRequest__Output, _interchat_control_v1_InfractionsResponse__Output>
  RevokeSanction: MethodDefinition<_interchat_control_v1_RevokeSanctionRequest, _interchat_control_v1_Infraction, _interchat_control_v1_RevokeSanctionRequest__Output, _interchat_control_v1_Infraction__Output>
  SubmitAppeal: MethodDefinition<_interchat_control_v1_SubmitAppealRequest, _interchat_control_v1_Appeal, _interchat_control_v1_SubmitAppealRequest__Output, _interchat_control_v1_Appeal__Output>
}
