// Original file: ../interchat-protobuf/control/v1/user_service.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { AcknowledgeInboxItemRequest as _interchat_control_v1_AcknowledgeInboxItemRequest, AcknowledgeInboxItemRequest__Output as _interchat_control_v1_AcknowledgeInboxItemRequest__Output } from '../../../interchat/control/v1/AcknowledgeInboxItemRequest';
import type { EmptyResponse as _interchat_control_v1_EmptyResponse, EmptyResponse__Output as _interchat_control_v1_EmptyResponse__Output } from '../../../interchat/control/v1/EmptyResponse';
import type { GetUserInboxRequest as _interchat_control_v1_GetUserInboxRequest, GetUserInboxRequest__Output as _interchat_control_v1_GetUserInboxRequest__Output } from '../../../interchat/control/v1/GetUserInboxRequest';
import type { GetUserProfileRequest as _interchat_control_v1_GetUserProfileRequest, GetUserProfileRequest__Output as _interchat_control_v1_GetUserProfileRequest__Output } from '../../../interchat/control/v1/GetUserProfileRequest';
import type { PatchUserPreferencesRequest as _interchat_control_v1_PatchUserPreferencesRequest, PatchUserPreferencesRequest__Output as _interchat_control_v1_PatchUserPreferencesRequest__Output } from '../../../interchat/control/v1/PatchUserPreferencesRequest';
import type { RecordVoteRequest as _interchat_control_v1_RecordVoteRequest, RecordVoteRequest__Output as _interchat_control_v1_RecordVoteRequest__Output } from '../../../interchat/control/v1/RecordVoteRequest';
import type { RecordVoteResponse as _interchat_control_v1_RecordVoteResponse, RecordVoteResponse__Output as _interchat_control_v1_RecordVoteResponse__Output } from '../../../interchat/control/v1/RecordVoteResponse';
import type { RequestContext as _interchat_control_v1_RequestContext, RequestContext__Output as _interchat_control_v1_RequestContext__Output } from '../../../interchat/control/v1/RequestContext';
import type { SyncDiscordIdentityRequest as _interchat_control_v1_SyncDiscordIdentityRequest, SyncDiscordIdentityRequest__Output as _interchat_control_v1_SyncDiscordIdentityRequest__Output } from '../../../interchat/control/v1/SyncDiscordIdentityRequest';
import type { UserInboxResponse as _interchat_control_v1_UserInboxResponse, UserInboxResponse__Output as _interchat_control_v1_UserInboxResponse__Output } from '../../../interchat/control/v1/UserInboxResponse';
import type { UserPreferences as _interchat_control_v1_UserPreferences, UserPreferences__Output as _interchat_control_v1_UserPreferences__Output } from '../../../interchat/control/v1/UserPreferences';
import type { UserProfile as _interchat_control_v1_UserProfile, UserProfile__Output as _interchat_control_v1_UserProfile__Output } from '../../../interchat/control/v1/UserProfile';

export interface UserServiceClient extends grpc.Client {
  AcknowledgeInboxItem(argument: _interchat_control_v1_AcknowledgeInboxItemRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  AcknowledgeInboxItem(argument: _interchat_control_v1_AcknowledgeInboxItemRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  AcknowledgeInboxItem(argument: _interchat_control_v1_AcknowledgeInboxItemRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  AcknowledgeInboxItem(argument: _interchat_control_v1_AcknowledgeInboxItemRequest, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  acknowledgeInboxItem(argument: _interchat_control_v1_AcknowledgeInboxItemRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  acknowledgeInboxItem(argument: _interchat_control_v1_AcknowledgeInboxItemRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  acknowledgeInboxItem(argument: _interchat_control_v1_AcknowledgeInboxItemRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  acknowledgeInboxItem(argument: _interchat_control_v1_AcknowledgeInboxItemRequest, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  
  GetUserInbox(argument: _interchat_control_v1_GetUserInboxRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_UserInboxResponse__Output>): grpc.ClientUnaryCall;
  GetUserInbox(argument: _interchat_control_v1_GetUserInboxRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_UserInboxResponse__Output>): grpc.ClientUnaryCall;
  GetUserInbox(argument: _interchat_control_v1_GetUserInboxRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_UserInboxResponse__Output>): grpc.ClientUnaryCall;
  GetUserInbox(argument: _interchat_control_v1_GetUserInboxRequest, callback: grpc.requestCallback<_interchat_control_v1_UserInboxResponse__Output>): grpc.ClientUnaryCall;
  getUserInbox(argument: _interchat_control_v1_GetUserInboxRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_UserInboxResponse__Output>): grpc.ClientUnaryCall;
  getUserInbox(argument: _interchat_control_v1_GetUserInboxRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_UserInboxResponse__Output>): grpc.ClientUnaryCall;
  getUserInbox(argument: _interchat_control_v1_GetUserInboxRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_UserInboxResponse__Output>): grpc.ClientUnaryCall;
  getUserInbox(argument: _interchat_control_v1_GetUserInboxRequest, callback: grpc.requestCallback<_interchat_control_v1_UserInboxResponse__Output>): grpc.ClientUnaryCall;
  
  GetUserPreferences(argument: _interchat_control_v1_RequestContext, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_UserPreferences__Output>): grpc.ClientUnaryCall;
  GetUserPreferences(argument: _interchat_control_v1_RequestContext, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_UserPreferences__Output>): grpc.ClientUnaryCall;
  GetUserPreferences(argument: _interchat_control_v1_RequestContext, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_UserPreferences__Output>): grpc.ClientUnaryCall;
  GetUserPreferences(argument: _interchat_control_v1_RequestContext, callback: grpc.requestCallback<_interchat_control_v1_UserPreferences__Output>): grpc.ClientUnaryCall;
  getUserPreferences(argument: _interchat_control_v1_RequestContext, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_UserPreferences__Output>): grpc.ClientUnaryCall;
  getUserPreferences(argument: _interchat_control_v1_RequestContext, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_UserPreferences__Output>): grpc.ClientUnaryCall;
  getUserPreferences(argument: _interchat_control_v1_RequestContext, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_UserPreferences__Output>): grpc.ClientUnaryCall;
  getUserPreferences(argument: _interchat_control_v1_RequestContext, callback: grpc.requestCallback<_interchat_control_v1_UserPreferences__Output>): grpc.ClientUnaryCall;
  
  GetUserProfile(argument: _interchat_control_v1_GetUserProfileRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_UserProfile__Output>): grpc.ClientUnaryCall;
  GetUserProfile(argument: _interchat_control_v1_GetUserProfileRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_UserProfile__Output>): grpc.ClientUnaryCall;
  GetUserProfile(argument: _interchat_control_v1_GetUserProfileRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_UserProfile__Output>): grpc.ClientUnaryCall;
  GetUserProfile(argument: _interchat_control_v1_GetUserProfileRequest, callback: grpc.requestCallback<_interchat_control_v1_UserProfile__Output>): grpc.ClientUnaryCall;
  getUserProfile(argument: _interchat_control_v1_GetUserProfileRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_UserProfile__Output>): grpc.ClientUnaryCall;
  getUserProfile(argument: _interchat_control_v1_GetUserProfileRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_UserProfile__Output>): grpc.ClientUnaryCall;
  getUserProfile(argument: _interchat_control_v1_GetUserProfileRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_UserProfile__Output>): grpc.ClientUnaryCall;
  getUserProfile(argument: _interchat_control_v1_GetUserProfileRequest, callback: grpc.requestCallback<_interchat_control_v1_UserProfile__Output>): grpc.ClientUnaryCall;
  
  PatchUserPreferences(argument: _interchat_control_v1_PatchUserPreferencesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_UserPreferences__Output>): grpc.ClientUnaryCall;
  PatchUserPreferences(argument: _interchat_control_v1_PatchUserPreferencesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_UserPreferences__Output>): grpc.ClientUnaryCall;
  PatchUserPreferences(argument: _interchat_control_v1_PatchUserPreferencesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_UserPreferences__Output>): grpc.ClientUnaryCall;
  PatchUserPreferences(argument: _interchat_control_v1_PatchUserPreferencesRequest, callback: grpc.requestCallback<_interchat_control_v1_UserPreferences__Output>): grpc.ClientUnaryCall;
  patchUserPreferences(argument: _interchat_control_v1_PatchUserPreferencesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_UserPreferences__Output>): grpc.ClientUnaryCall;
  patchUserPreferences(argument: _interchat_control_v1_PatchUserPreferencesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_UserPreferences__Output>): grpc.ClientUnaryCall;
  patchUserPreferences(argument: _interchat_control_v1_PatchUserPreferencesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_UserPreferences__Output>): grpc.ClientUnaryCall;
  patchUserPreferences(argument: _interchat_control_v1_PatchUserPreferencesRequest, callback: grpc.requestCallback<_interchat_control_v1_UserPreferences__Output>): grpc.ClientUnaryCall;
  
  RecordVote(argument: _interchat_control_v1_RecordVoteRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_RecordVoteResponse__Output>): grpc.ClientUnaryCall;
  RecordVote(argument: _interchat_control_v1_RecordVoteRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_RecordVoteResponse__Output>): grpc.ClientUnaryCall;
  RecordVote(argument: _interchat_control_v1_RecordVoteRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_RecordVoteResponse__Output>): grpc.ClientUnaryCall;
  RecordVote(argument: _interchat_control_v1_RecordVoteRequest, callback: grpc.requestCallback<_interchat_control_v1_RecordVoteResponse__Output>): grpc.ClientUnaryCall;
  recordVote(argument: _interchat_control_v1_RecordVoteRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_RecordVoteResponse__Output>): grpc.ClientUnaryCall;
  recordVote(argument: _interchat_control_v1_RecordVoteRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_RecordVoteResponse__Output>): grpc.ClientUnaryCall;
  recordVote(argument: _interchat_control_v1_RecordVoteRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_RecordVoteResponse__Output>): grpc.ClientUnaryCall;
  recordVote(argument: _interchat_control_v1_RecordVoteRequest, callback: grpc.requestCallback<_interchat_control_v1_RecordVoteResponse__Output>): grpc.ClientUnaryCall;
  
  SyncDiscordIdentity(argument: _interchat_control_v1_SyncDiscordIdentityRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_UserProfile__Output>): grpc.ClientUnaryCall;
  SyncDiscordIdentity(argument: _interchat_control_v1_SyncDiscordIdentityRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_UserProfile__Output>): grpc.ClientUnaryCall;
  SyncDiscordIdentity(argument: _interchat_control_v1_SyncDiscordIdentityRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_UserProfile__Output>): grpc.ClientUnaryCall;
  SyncDiscordIdentity(argument: _interchat_control_v1_SyncDiscordIdentityRequest, callback: grpc.requestCallback<_interchat_control_v1_UserProfile__Output>): grpc.ClientUnaryCall;
  syncDiscordIdentity(argument: _interchat_control_v1_SyncDiscordIdentityRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_UserProfile__Output>): grpc.ClientUnaryCall;
  syncDiscordIdentity(argument: _interchat_control_v1_SyncDiscordIdentityRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_UserProfile__Output>): grpc.ClientUnaryCall;
  syncDiscordIdentity(argument: _interchat_control_v1_SyncDiscordIdentityRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_UserProfile__Output>): grpc.ClientUnaryCall;
  syncDiscordIdentity(argument: _interchat_control_v1_SyncDiscordIdentityRequest, callback: grpc.requestCallback<_interchat_control_v1_UserProfile__Output>): grpc.ClientUnaryCall;
  
}

export interface UserServiceHandlers extends grpc.UntypedServiceImplementation {
  AcknowledgeInboxItem: grpc.handleUnaryCall<_interchat_control_v1_AcknowledgeInboxItemRequest__Output, _interchat_control_v1_EmptyResponse>;
  
  GetUserInbox: grpc.handleUnaryCall<_interchat_control_v1_GetUserInboxRequest__Output, _interchat_control_v1_UserInboxResponse>;
  
  GetUserPreferences: grpc.handleUnaryCall<_interchat_control_v1_RequestContext__Output, _interchat_control_v1_UserPreferences>;
  
  GetUserProfile: grpc.handleUnaryCall<_interchat_control_v1_GetUserProfileRequest__Output, _interchat_control_v1_UserProfile>;
  
  PatchUserPreferences: grpc.handleUnaryCall<_interchat_control_v1_PatchUserPreferencesRequest__Output, _interchat_control_v1_UserPreferences>;
  
  RecordVote: grpc.handleUnaryCall<_interchat_control_v1_RecordVoteRequest__Output, _interchat_control_v1_RecordVoteResponse>;
  
  SyncDiscordIdentity: grpc.handleUnaryCall<_interchat_control_v1_SyncDiscordIdentityRequest__Output, _interchat_control_v1_UserProfile>;
  
}

export interface UserServiceDefinition extends grpc.ServiceDefinition {
  AcknowledgeInboxItem: MethodDefinition<_interchat_control_v1_AcknowledgeInboxItemRequest, _interchat_control_v1_EmptyResponse, _interchat_control_v1_AcknowledgeInboxItemRequest__Output, _interchat_control_v1_EmptyResponse__Output>
  GetUserInbox: MethodDefinition<_interchat_control_v1_GetUserInboxRequest, _interchat_control_v1_UserInboxResponse, _interchat_control_v1_GetUserInboxRequest__Output, _interchat_control_v1_UserInboxResponse__Output>
  GetUserPreferences: MethodDefinition<_interchat_control_v1_RequestContext, _interchat_control_v1_UserPreferences, _interchat_control_v1_RequestContext__Output, _interchat_control_v1_UserPreferences__Output>
  GetUserProfile: MethodDefinition<_interchat_control_v1_GetUserProfileRequest, _interchat_control_v1_UserProfile, _interchat_control_v1_GetUserProfileRequest__Output, _interchat_control_v1_UserProfile__Output>
  PatchUserPreferences: MethodDefinition<_interchat_control_v1_PatchUserPreferencesRequest, _interchat_control_v1_UserPreferences, _interchat_control_v1_PatchUserPreferencesRequest__Output, _interchat_control_v1_UserPreferences__Output>
  RecordVote: MethodDefinition<_interchat_control_v1_RecordVoteRequest, _interchat_control_v1_RecordVoteResponse, _interchat_control_v1_RecordVoteRequest__Output, _interchat_control_v1_RecordVoteResponse__Output>
  SyncDiscordIdentity: MethodDefinition<_interchat_control_v1_SyncDiscordIdentityRequest, _interchat_control_v1_UserProfile, _interchat_control_v1_SyncDiscordIdentityRequest__Output, _interchat_control_v1_UserProfile__Output>
}
