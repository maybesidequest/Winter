// Original file: ../interchat-protobuf/control/v1/moderation_service.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { Appeal as _interchat_control_v1_Appeal, Appeal__Output as _interchat_control_v1_Appeal__Output } from '../../../interchat/control/v1/Appeal';
import type { ApplySanctionRequest as _interchat_control_v1_ApplySanctionRequest, ApplySanctionRequest__Output as _interchat_control_v1_ApplySanctionRequest__Output } from '../../../interchat/control/v1/ApplySanctionRequest';
import type { ApproveAppealRequest as _interchat_control_v1_ApproveAppealRequest, ApproveAppealRequest__Output as _interchat_control_v1_ApproveAppealRequest__Output } from '../../../interchat/control/v1/ApproveAppealRequest';
import type { GetAppealRequest as _interchat_control_v1_GetAppealRequest, GetAppealRequest__Output as _interchat_control_v1_GetAppealRequest__Output } from '../../../interchat/control/v1/GetAppealRequest';
import type { GetHubSafetySettingsRequest as _interchat_control_v1_GetHubSafetySettingsRequest, GetHubSafetySettingsRequest__Output as _interchat_control_v1_GetHubSafetySettingsRequest__Output } from '../../../interchat/control/v1/GetHubSafetySettingsRequest';
import type { GetInfractionRequest as _interchat_control_v1_GetInfractionRequest, GetInfractionRequest__Output as _interchat_control_v1_GetInfractionRequest__Output } from '../../../interchat/control/v1/GetInfractionRequest';
import type { GetInfractionsRequest as _interchat_control_v1_GetInfractionsRequest, GetInfractionsRequest__Output as _interchat_control_v1_GetInfractionsRequest__Output } from '../../../interchat/control/v1/GetInfractionsRequest';
import type { GetSafetyAssessmentRequest as _interchat_control_v1_GetSafetyAssessmentRequest, GetSafetyAssessmentRequest__Output as _interchat_control_v1_GetSafetyAssessmentRequest__Output } from '../../../interchat/control/v1/GetSafetyAssessmentRequest';
import type { HubSafetySettings as _interchat_control_v1_HubSafetySettings, HubSafetySettings__Output as _interchat_control_v1_HubSafetySettings__Output } from '../../../interchat/control/v1/HubSafetySettings';
import type { Infraction as _interchat_control_v1_Infraction, Infraction__Output as _interchat_control_v1_Infraction__Output } from '../../../interchat/control/v1/Infraction';
import type { InfractionsResponse as _interchat_control_v1_InfractionsResponse, InfractionsResponse__Output as _interchat_control_v1_InfractionsResponse__Output } from '../../../interchat/control/v1/InfractionsResponse';
import type { ListHubAppealsRequest as _interchat_control_v1_ListHubAppealsRequest, ListHubAppealsRequest__Output as _interchat_control_v1_ListHubAppealsRequest__Output } from '../../../interchat/control/v1/ListHubAppealsRequest';
import type { ListHubAppealsResponse as _interchat_control_v1_ListHubAppealsResponse, ListHubAppealsResponse__Output as _interchat_control_v1_ListHubAppealsResponse__Output } from '../../../interchat/control/v1/ListHubAppealsResponse';
import type { ListInfractionsRequest as _interchat_control_v1_ListInfractionsRequest, ListInfractionsRequest__Output as _interchat_control_v1_ListInfractionsRequest__Output } from '../../../interchat/control/v1/ListInfractionsRequest';
import type { ListInfractionsResponse as _interchat_control_v1_ListInfractionsResponse, ListInfractionsResponse__Output as _interchat_control_v1_ListInfractionsResponse__Output } from '../../../interchat/control/v1/ListInfractionsResponse';
import type { ListMyAppealableInfractionsRequest as _interchat_control_v1_ListMyAppealableInfractionsRequest, ListMyAppealableInfractionsRequest__Output as _interchat_control_v1_ListMyAppealableInfractionsRequest__Output } from '../../../interchat/control/v1/ListMyAppealableInfractionsRequest';
import type { PatchHubSafetySettingsRequest as _interchat_control_v1_PatchHubSafetySettingsRequest, PatchHubSafetySettingsRequest__Output as _interchat_control_v1_PatchHubSafetySettingsRequest__Output } from '../../../interchat/control/v1/PatchHubSafetySettingsRequest';
import type { RejectAppealRequest as _interchat_control_v1_RejectAppealRequest, RejectAppealRequest__Output as _interchat_control_v1_RejectAppealRequest__Output } from '../../../interchat/control/v1/RejectAppealRequest';
import type { RevokeSanctionRequest as _interchat_control_v1_RevokeSanctionRequest, RevokeSanctionRequest__Output as _interchat_control_v1_RevokeSanctionRequest__Output } from '../../../interchat/control/v1/RevokeSanctionRequest';
import type { SafetyAssessment as _interchat_control_v1_SafetyAssessment, SafetyAssessment__Output as _interchat_control_v1_SafetyAssessment__Output } from '../../../interchat/control/v1/SafetyAssessment';
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
  
  ApproveAppeal(argument: _interchat_control_v1_ApproveAppealRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Appeal__Output>): grpc.ClientUnaryCall;
  ApproveAppeal(argument: _interchat_control_v1_ApproveAppealRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_Appeal__Output>): grpc.ClientUnaryCall;
  ApproveAppeal(argument: _interchat_control_v1_ApproveAppealRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Appeal__Output>): grpc.ClientUnaryCall;
  ApproveAppeal(argument: _interchat_control_v1_ApproveAppealRequest, callback: grpc.requestCallback<_interchat_control_v1_Appeal__Output>): grpc.ClientUnaryCall;
  approveAppeal(argument: _interchat_control_v1_ApproveAppealRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Appeal__Output>): grpc.ClientUnaryCall;
  approveAppeal(argument: _interchat_control_v1_ApproveAppealRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_Appeal__Output>): grpc.ClientUnaryCall;
  approveAppeal(argument: _interchat_control_v1_ApproveAppealRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Appeal__Output>): grpc.ClientUnaryCall;
  approveAppeal(argument: _interchat_control_v1_ApproveAppealRequest, callback: grpc.requestCallback<_interchat_control_v1_Appeal__Output>): grpc.ClientUnaryCall;
  
  GetAppeal(argument: _interchat_control_v1_GetAppealRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Appeal__Output>): grpc.ClientUnaryCall;
  GetAppeal(argument: _interchat_control_v1_GetAppealRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_Appeal__Output>): grpc.ClientUnaryCall;
  GetAppeal(argument: _interchat_control_v1_GetAppealRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Appeal__Output>): grpc.ClientUnaryCall;
  GetAppeal(argument: _interchat_control_v1_GetAppealRequest, callback: grpc.requestCallback<_interchat_control_v1_Appeal__Output>): grpc.ClientUnaryCall;
  getAppeal(argument: _interchat_control_v1_GetAppealRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Appeal__Output>): grpc.ClientUnaryCall;
  getAppeal(argument: _interchat_control_v1_GetAppealRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_Appeal__Output>): grpc.ClientUnaryCall;
  getAppeal(argument: _interchat_control_v1_GetAppealRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Appeal__Output>): grpc.ClientUnaryCall;
  getAppeal(argument: _interchat_control_v1_GetAppealRequest, callback: grpc.requestCallback<_interchat_control_v1_Appeal__Output>): grpc.ClientUnaryCall;
  
  GetHubSafetySettings(argument: _interchat_control_v1_GetHubSafetySettingsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubSafetySettings__Output>): grpc.ClientUnaryCall;
  GetHubSafetySettings(argument: _interchat_control_v1_GetHubSafetySettingsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_HubSafetySettings__Output>): grpc.ClientUnaryCall;
  GetHubSafetySettings(argument: _interchat_control_v1_GetHubSafetySettingsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubSafetySettings__Output>): grpc.ClientUnaryCall;
  GetHubSafetySettings(argument: _interchat_control_v1_GetHubSafetySettingsRequest, callback: grpc.requestCallback<_interchat_control_v1_HubSafetySettings__Output>): grpc.ClientUnaryCall;
  getHubSafetySettings(argument: _interchat_control_v1_GetHubSafetySettingsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubSafetySettings__Output>): grpc.ClientUnaryCall;
  getHubSafetySettings(argument: _interchat_control_v1_GetHubSafetySettingsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_HubSafetySettings__Output>): grpc.ClientUnaryCall;
  getHubSafetySettings(argument: _interchat_control_v1_GetHubSafetySettingsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubSafetySettings__Output>): grpc.ClientUnaryCall;
  getHubSafetySettings(argument: _interchat_control_v1_GetHubSafetySettingsRequest, callback: grpc.requestCallback<_interchat_control_v1_HubSafetySettings__Output>): grpc.ClientUnaryCall;
  
  GetInfraction(argument: _interchat_control_v1_GetInfractionRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Infraction__Output>): grpc.ClientUnaryCall;
  GetInfraction(argument: _interchat_control_v1_GetInfractionRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_Infraction__Output>): grpc.ClientUnaryCall;
  GetInfraction(argument: _interchat_control_v1_GetInfractionRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Infraction__Output>): grpc.ClientUnaryCall;
  GetInfraction(argument: _interchat_control_v1_GetInfractionRequest, callback: grpc.requestCallback<_interchat_control_v1_Infraction__Output>): grpc.ClientUnaryCall;
  getInfraction(argument: _interchat_control_v1_GetInfractionRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Infraction__Output>): grpc.ClientUnaryCall;
  getInfraction(argument: _interchat_control_v1_GetInfractionRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_Infraction__Output>): grpc.ClientUnaryCall;
  getInfraction(argument: _interchat_control_v1_GetInfractionRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Infraction__Output>): grpc.ClientUnaryCall;
  getInfraction(argument: _interchat_control_v1_GetInfractionRequest, callback: grpc.requestCallback<_interchat_control_v1_Infraction__Output>): grpc.ClientUnaryCall;
  
  GetInfractions(argument: _interchat_control_v1_GetInfractionsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_InfractionsResponse__Output>): grpc.ClientUnaryCall;
  GetInfractions(argument: _interchat_control_v1_GetInfractionsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_InfractionsResponse__Output>): grpc.ClientUnaryCall;
  GetInfractions(argument: _interchat_control_v1_GetInfractionsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_InfractionsResponse__Output>): grpc.ClientUnaryCall;
  GetInfractions(argument: _interchat_control_v1_GetInfractionsRequest, callback: grpc.requestCallback<_interchat_control_v1_InfractionsResponse__Output>): grpc.ClientUnaryCall;
  getInfractions(argument: _interchat_control_v1_GetInfractionsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_InfractionsResponse__Output>): grpc.ClientUnaryCall;
  getInfractions(argument: _interchat_control_v1_GetInfractionsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_InfractionsResponse__Output>): grpc.ClientUnaryCall;
  getInfractions(argument: _interchat_control_v1_GetInfractionsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_InfractionsResponse__Output>): grpc.ClientUnaryCall;
  getInfractions(argument: _interchat_control_v1_GetInfractionsRequest, callback: grpc.requestCallback<_interchat_control_v1_InfractionsResponse__Output>): grpc.ClientUnaryCall;
  
  GetSafetyAssessment(argument: _interchat_control_v1_GetSafetyAssessmentRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_SafetyAssessment__Output>): grpc.ClientUnaryCall;
  GetSafetyAssessment(argument: _interchat_control_v1_GetSafetyAssessmentRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_SafetyAssessment__Output>): grpc.ClientUnaryCall;
  GetSafetyAssessment(argument: _interchat_control_v1_GetSafetyAssessmentRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_SafetyAssessment__Output>): grpc.ClientUnaryCall;
  GetSafetyAssessment(argument: _interchat_control_v1_GetSafetyAssessmentRequest, callback: grpc.requestCallback<_interchat_control_v1_SafetyAssessment__Output>): grpc.ClientUnaryCall;
  getSafetyAssessment(argument: _interchat_control_v1_GetSafetyAssessmentRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_SafetyAssessment__Output>): grpc.ClientUnaryCall;
  getSafetyAssessment(argument: _interchat_control_v1_GetSafetyAssessmentRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_SafetyAssessment__Output>): grpc.ClientUnaryCall;
  getSafetyAssessment(argument: _interchat_control_v1_GetSafetyAssessmentRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_SafetyAssessment__Output>): grpc.ClientUnaryCall;
  getSafetyAssessment(argument: _interchat_control_v1_GetSafetyAssessmentRequest, callback: grpc.requestCallback<_interchat_control_v1_SafetyAssessment__Output>): grpc.ClientUnaryCall;
  
  ListHubAppeals(argument: _interchat_control_v1_ListHubAppealsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_ListHubAppealsResponse__Output>): grpc.ClientUnaryCall;
  ListHubAppeals(argument: _interchat_control_v1_ListHubAppealsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_ListHubAppealsResponse__Output>): grpc.ClientUnaryCall;
  ListHubAppeals(argument: _interchat_control_v1_ListHubAppealsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_ListHubAppealsResponse__Output>): grpc.ClientUnaryCall;
  ListHubAppeals(argument: _interchat_control_v1_ListHubAppealsRequest, callback: grpc.requestCallback<_interchat_control_v1_ListHubAppealsResponse__Output>): grpc.ClientUnaryCall;
  listHubAppeals(argument: _interchat_control_v1_ListHubAppealsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_ListHubAppealsResponse__Output>): grpc.ClientUnaryCall;
  listHubAppeals(argument: _interchat_control_v1_ListHubAppealsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_ListHubAppealsResponse__Output>): grpc.ClientUnaryCall;
  listHubAppeals(argument: _interchat_control_v1_ListHubAppealsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_ListHubAppealsResponse__Output>): grpc.ClientUnaryCall;
  listHubAppeals(argument: _interchat_control_v1_ListHubAppealsRequest, callback: grpc.requestCallback<_interchat_control_v1_ListHubAppealsResponse__Output>): grpc.ClientUnaryCall;
  
  ListInfractions(argument: _interchat_control_v1_ListInfractionsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_ListInfractionsResponse__Output>): grpc.ClientUnaryCall;
  ListInfractions(argument: _interchat_control_v1_ListInfractionsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_ListInfractionsResponse__Output>): grpc.ClientUnaryCall;
  ListInfractions(argument: _interchat_control_v1_ListInfractionsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_ListInfractionsResponse__Output>): grpc.ClientUnaryCall;
  ListInfractions(argument: _interchat_control_v1_ListInfractionsRequest, callback: grpc.requestCallback<_interchat_control_v1_ListInfractionsResponse__Output>): grpc.ClientUnaryCall;
  listInfractions(argument: _interchat_control_v1_ListInfractionsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_ListInfractionsResponse__Output>): grpc.ClientUnaryCall;
  listInfractions(argument: _interchat_control_v1_ListInfractionsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_ListInfractionsResponse__Output>): grpc.ClientUnaryCall;
  listInfractions(argument: _interchat_control_v1_ListInfractionsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_ListInfractionsResponse__Output>): grpc.ClientUnaryCall;
  listInfractions(argument: _interchat_control_v1_ListInfractionsRequest, callback: grpc.requestCallback<_interchat_control_v1_ListInfractionsResponse__Output>): grpc.ClientUnaryCall;
  
  ListMyAppealableInfractions(argument: _interchat_control_v1_ListMyAppealableInfractionsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_InfractionsResponse__Output>): grpc.ClientUnaryCall;
  ListMyAppealableInfractions(argument: _interchat_control_v1_ListMyAppealableInfractionsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_InfractionsResponse__Output>): grpc.ClientUnaryCall;
  ListMyAppealableInfractions(argument: _interchat_control_v1_ListMyAppealableInfractionsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_InfractionsResponse__Output>): grpc.ClientUnaryCall;
  ListMyAppealableInfractions(argument: _interchat_control_v1_ListMyAppealableInfractionsRequest, callback: grpc.requestCallback<_interchat_control_v1_InfractionsResponse__Output>): grpc.ClientUnaryCall;
  listMyAppealableInfractions(argument: _interchat_control_v1_ListMyAppealableInfractionsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_InfractionsResponse__Output>): grpc.ClientUnaryCall;
  listMyAppealableInfractions(argument: _interchat_control_v1_ListMyAppealableInfractionsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_InfractionsResponse__Output>): grpc.ClientUnaryCall;
  listMyAppealableInfractions(argument: _interchat_control_v1_ListMyAppealableInfractionsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_InfractionsResponse__Output>): grpc.ClientUnaryCall;
  listMyAppealableInfractions(argument: _interchat_control_v1_ListMyAppealableInfractionsRequest, callback: grpc.requestCallback<_interchat_control_v1_InfractionsResponse__Output>): grpc.ClientUnaryCall;
  
  PatchHubSafetySettings(argument: _interchat_control_v1_PatchHubSafetySettingsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubSafetySettings__Output>): grpc.ClientUnaryCall;
  PatchHubSafetySettings(argument: _interchat_control_v1_PatchHubSafetySettingsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_HubSafetySettings__Output>): grpc.ClientUnaryCall;
  PatchHubSafetySettings(argument: _interchat_control_v1_PatchHubSafetySettingsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubSafetySettings__Output>): grpc.ClientUnaryCall;
  PatchHubSafetySettings(argument: _interchat_control_v1_PatchHubSafetySettingsRequest, callback: grpc.requestCallback<_interchat_control_v1_HubSafetySettings__Output>): grpc.ClientUnaryCall;
  patchHubSafetySettings(argument: _interchat_control_v1_PatchHubSafetySettingsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubSafetySettings__Output>): grpc.ClientUnaryCall;
  patchHubSafetySettings(argument: _interchat_control_v1_PatchHubSafetySettingsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_HubSafetySettings__Output>): grpc.ClientUnaryCall;
  patchHubSafetySettings(argument: _interchat_control_v1_PatchHubSafetySettingsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubSafetySettings__Output>): grpc.ClientUnaryCall;
  patchHubSafetySettings(argument: _interchat_control_v1_PatchHubSafetySettingsRequest, callback: grpc.requestCallback<_interchat_control_v1_HubSafetySettings__Output>): grpc.ClientUnaryCall;
  
  RejectAppeal(argument: _interchat_control_v1_RejectAppealRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Appeal__Output>): grpc.ClientUnaryCall;
  RejectAppeal(argument: _interchat_control_v1_RejectAppealRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_Appeal__Output>): grpc.ClientUnaryCall;
  RejectAppeal(argument: _interchat_control_v1_RejectAppealRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Appeal__Output>): grpc.ClientUnaryCall;
  RejectAppeal(argument: _interchat_control_v1_RejectAppealRequest, callback: grpc.requestCallback<_interchat_control_v1_Appeal__Output>): grpc.ClientUnaryCall;
  rejectAppeal(argument: _interchat_control_v1_RejectAppealRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Appeal__Output>): grpc.ClientUnaryCall;
  rejectAppeal(argument: _interchat_control_v1_RejectAppealRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_Appeal__Output>): grpc.ClientUnaryCall;
  rejectAppeal(argument: _interchat_control_v1_RejectAppealRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Appeal__Output>): grpc.ClientUnaryCall;
  rejectAppeal(argument: _interchat_control_v1_RejectAppealRequest, callback: grpc.requestCallback<_interchat_control_v1_Appeal__Output>): grpc.ClientUnaryCall;
  
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
  
  ApproveAppeal: grpc.handleUnaryCall<_interchat_control_v1_ApproveAppealRequest__Output, _interchat_control_v1_Appeal>;
  
  GetAppeal: grpc.handleUnaryCall<_interchat_control_v1_GetAppealRequest__Output, _interchat_control_v1_Appeal>;
  
  GetHubSafetySettings: grpc.handleUnaryCall<_interchat_control_v1_GetHubSafetySettingsRequest__Output, _interchat_control_v1_HubSafetySettings>;
  
  GetInfraction: grpc.handleUnaryCall<_interchat_control_v1_GetInfractionRequest__Output, _interchat_control_v1_Infraction>;
  
  GetInfractions: grpc.handleUnaryCall<_interchat_control_v1_GetInfractionsRequest__Output, _interchat_control_v1_InfractionsResponse>;
  
  GetSafetyAssessment: grpc.handleUnaryCall<_interchat_control_v1_GetSafetyAssessmentRequest__Output, _interchat_control_v1_SafetyAssessment>;
  
  ListHubAppeals: grpc.handleUnaryCall<_interchat_control_v1_ListHubAppealsRequest__Output, _interchat_control_v1_ListHubAppealsResponse>;
  
  ListInfractions: grpc.handleUnaryCall<_interchat_control_v1_ListInfractionsRequest__Output, _interchat_control_v1_ListInfractionsResponse>;
  
  ListMyAppealableInfractions: grpc.handleUnaryCall<_interchat_control_v1_ListMyAppealableInfractionsRequest__Output, _interchat_control_v1_InfractionsResponse>;
  
  PatchHubSafetySettings: grpc.handleUnaryCall<_interchat_control_v1_PatchHubSafetySettingsRequest__Output, _interchat_control_v1_HubSafetySettings>;
  
  RejectAppeal: grpc.handleUnaryCall<_interchat_control_v1_RejectAppealRequest__Output, _interchat_control_v1_Appeal>;
  
  RevokeSanction: grpc.handleUnaryCall<_interchat_control_v1_RevokeSanctionRequest__Output, _interchat_control_v1_Infraction>;
  
  SubmitAppeal: grpc.handleUnaryCall<_interchat_control_v1_SubmitAppealRequest__Output, _interchat_control_v1_Appeal>;
  
}

export interface ModerationServiceDefinition extends grpc.ServiceDefinition {
  ApplySanction: MethodDefinition<_interchat_control_v1_ApplySanctionRequest, _interchat_control_v1_Infraction, _interchat_control_v1_ApplySanctionRequest__Output, _interchat_control_v1_Infraction__Output>
  ApproveAppeal: MethodDefinition<_interchat_control_v1_ApproveAppealRequest, _interchat_control_v1_Appeal, _interchat_control_v1_ApproveAppealRequest__Output, _interchat_control_v1_Appeal__Output>
  GetAppeal: MethodDefinition<_interchat_control_v1_GetAppealRequest, _interchat_control_v1_Appeal, _interchat_control_v1_GetAppealRequest__Output, _interchat_control_v1_Appeal__Output>
  GetHubSafetySettings: MethodDefinition<_interchat_control_v1_GetHubSafetySettingsRequest, _interchat_control_v1_HubSafetySettings, _interchat_control_v1_GetHubSafetySettingsRequest__Output, _interchat_control_v1_HubSafetySettings__Output>
  GetInfraction: MethodDefinition<_interchat_control_v1_GetInfractionRequest, _interchat_control_v1_Infraction, _interchat_control_v1_GetInfractionRequest__Output, _interchat_control_v1_Infraction__Output>
  GetInfractions: MethodDefinition<_interchat_control_v1_GetInfractionsRequest, _interchat_control_v1_InfractionsResponse, _interchat_control_v1_GetInfractionsRequest__Output, _interchat_control_v1_InfractionsResponse__Output>
  GetSafetyAssessment: MethodDefinition<_interchat_control_v1_GetSafetyAssessmentRequest, _interchat_control_v1_SafetyAssessment, _interchat_control_v1_GetSafetyAssessmentRequest__Output, _interchat_control_v1_SafetyAssessment__Output>
  ListHubAppeals: MethodDefinition<_interchat_control_v1_ListHubAppealsRequest, _interchat_control_v1_ListHubAppealsResponse, _interchat_control_v1_ListHubAppealsRequest__Output, _interchat_control_v1_ListHubAppealsResponse__Output>
  ListInfractions: MethodDefinition<_interchat_control_v1_ListInfractionsRequest, _interchat_control_v1_ListInfractionsResponse, _interchat_control_v1_ListInfractionsRequest__Output, _interchat_control_v1_ListInfractionsResponse__Output>
  ListMyAppealableInfractions: MethodDefinition<_interchat_control_v1_ListMyAppealableInfractionsRequest, _interchat_control_v1_InfractionsResponse, _interchat_control_v1_ListMyAppealableInfractionsRequest__Output, _interchat_control_v1_InfractionsResponse__Output>
  PatchHubSafetySettings: MethodDefinition<_interchat_control_v1_PatchHubSafetySettingsRequest, _interchat_control_v1_HubSafetySettings, _interchat_control_v1_PatchHubSafetySettingsRequest__Output, _interchat_control_v1_HubSafetySettings__Output>
  RejectAppeal: MethodDefinition<_interchat_control_v1_RejectAppealRequest, _interchat_control_v1_Appeal, _interchat_control_v1_RejectAppealRequest__Output, _interchat_control_v1_Appeal__Output>
  RevokeSanction: MethodDefinition<_interchat_control_v1_RevokeSanctionRequest, _interchat_control_v1_Infraction, _interchat_control_v1_RevokeSanctionRequest__Output, _interchat_control_v1_Infraction__Output>
  SubmitAppeal: MethodDefinition<_interchat_control_v1_SubmitAppealRequest, _interchat_control_v1_Appeal, _interchat_control_v1_SubmitAppealRequest__Output, _interchat_control_v1_Appeal__Output>
}
