// Original file: ../interchat-protobuf/control/v1/user_service.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { AcknowledgeInboxItemRequest as _interchat_control_v1_AcknowledgeInboxItemRequest, AcknowledgeInboxItemRequest__Output as _interchat_control_v1_AcknowledgeInboxItemRequest__Output } from '../../../interchat/control/v1/AcknowledgeInboxItemRequest';
import type { EmptyResponse as _interchat_control_v1_EmptyResponse, EmptyResponse__Output as _interchat_control_v1_EmptyResponse__Output } from '../../../interchat/control/v1/EmptyResponse';
import type { FeedbackReceipt as _interchat_control_v1_FeedbackReceipt, FeedbackReceipt__Output as _interchat_control_v1_FeedbackReceipt__Output } from '../../../interchat/control/v1/FeedbackReceipt';
import type { GetLeaderboardRequest as _interchat_control_v1_GetLeaderboardRequest, GetLeaderboardRequest__Output as _interchat_control_v1_GetLeaderboardRequest__Output } from '../../../interchat/control/v1/GetLeaderboardRequest';
import type { GetUserActivityRequest as _interchat_control_v1_GetUserActivityRequest, GetUserActivityRequest__Output as _interchat_control_v1_GetUserActivityRequest__Output } from '../../../interchat/control/v1/GetUserActivityRequest';
import type { GetUserInboxRequest as _interchat_control_v1_GetUserInboxRequest, GetUserInboxRequest__Output as _interchat_control_v1_GetUserInboxRequest__Output } from '../../../interchat/control/v1/GetUserInboxRequest';
import type { GetUserProfileRequest as _interchat_control_v1_GetUserProfileRequest, GetUserProfileRequest__Output as _interchat_control_v1_GetUserProfileRequest__Output } from '../../../interchat/control/v1/GetUserProfileRequest';
import type { PatchUserPreferencesRequest as _interchat_control_v1_PatchUserPreferencesRequest, PatchUserPreferencesRequest__Output as _interchat_control_v1_PatchUserPreferencesRequest__Output } from '../../../interchat/control/v1/PatchUserPreferencesRequest';
import type { RecordVoteRequest as _interchat_control_v1_RecordVoteRequest, RecordVoteRequest__Output as _interchat_control_v1_RecordVoteRequest__Output } from '../../../interchat/control/v1/RecordVoteRequest';
import type { RecordVoteResponse as _interchat_control_v1_RecordVoteResponse, RecordVoteResponse__Output as _interchat_control_v1_RecordVoteResponse__Output } from '../../../interchat/control/v1/RecordVoteResponse';
import type { RequestContext as _interchat_control_v1_RequestContext, RequestContext__Output as _interchat_control_v1_RequestContext__Output } from '../../../interchat/control/v1/RequestContext';
import type { SubmitFeedbackRequest as _interchat_control_v1_SubmitFeedbackRequest, SubmitFeedbackRequest__Output as _interchat_control_v1_SubmitFeedbackRequest__Output } from '../../../interchat/control/v1/SubmitFeedbackRequest';
import type { SyncDiscordIdentityRequest as _interchat_control_v1_SyncDiscordIdentityRequest, SyncDiscordIdentityRequest__Output as _interchat_control_v1_SyncDiscordIdentityRequest__Output } from '../../../interchat/control/v1/SyncDiscordIdentityRequest';
import type { UserActivity as _interchat_control_v1_UserActivity, UserActivity__Output as _interchat_control_v1_UserActivity__Output } from '../../../interchat/control/v1/UserActivity';
import type { UserInboxResponse as _interchat_control_v1_UserInboxResponse, UserInboxResponse__Output as _interchat_control_v1_UserInboxResponse__Output } from '../../../interchat/control/v1/UserInboxResponse';
import type { UserLeaderboard as _interchat_control_v1_UserLeaderboard, UserLeaderboard__Output as _interchat_control_v1_UserLeaderboard__Output } from '../../../interchat/control/v1/UserLeaderboard';
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
  
  GetLeaderboard(argument: _interchat_control_v1_GetLeaderboardRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_UserLeaderboard__Output>): grpc.ClientUnaryCall;
  GetLeaderboard(argument: _interchat_control_v1_GetLeaderboardRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_UserLeaderboard__Output>): grpc.ClientUnaryCall;
  GetLeaderboard(argument: _interchat_control_v1_GetLeaderboardRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_UserLeaderboard__Output>): grpc.ClientUnaryCall;
  GetLeaderboard(argument: _interchat_control_v1_GetLeaderboardRequest, callback: grpc.requestCallback<_interchat_control_v1_UserLeaderboard__Output>): grpc.ClientUnaryCall;
  getLeaderboard(argument: _interchat_control_v1_GetLeaderboardRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_UserLeaderboard__Output>): grpc.ClientUnaryCall;
  getLeaderboard(argument: _interchat_control_v1_GetLeaderboardRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_UserLeaderboard__Output>): grpc.ClientUnaryCall;
  getLeaderboard(argument: _interchat_control_v1_GetLeaderboardRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_UserLeaderboard__Output>): grpc.ClientUnaryCall;
  getLeaderboard(argument: _interchat_control_v1_GetLeaderboardRequest, callback: grpc.requestCallback<_interchat_control_v1_UserLeaderboard__Output>): grpc.ClientUnaryCall;
  
  GetUserActivity(argument: _interchat_control_v1_GetUserActivityRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_UserActivity__Output>): grpc.ClientUnaryCall;
  GetUserActivity(argument: _interchat_control_v1_GetUserActivityRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_UserActivity__Output>): grpc.ClientUnaryCall;
  GetUserActivity(argument: _interchat_control_v1_GetUserActivityRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_UserActivity__Output>): grpc.ClientUnaryCall;
  GetUserActivity(argument: _interchat_control_v1_GetUserActivityRequest, callback: grpc.requestCallback<_interchat_control_v1_UserActivity__Output>): grpc.ClientUnaryCall;
  getUserActivity(argument: _interchat_control_v1_GetUserActivityRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_UserActivity__Output>): grpc.ClientUnaryCall;
  getUserActivity(argument: _interchat_control_v1_GetUserActivityRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_UserActivity__Output>): grpc.ClientUnaryCall;
  getUserActivity(argument: _interchat_control_v1_GetUserActivityRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_UserActivity__Output>): grpc.ClientUnaryCall;
  getUserActivity(argument: _interchat_control_v1_GetUserActivityRequest, callback: grpc.requestCallback<_interchat_control_v1_UserActivity__Output>): grpc.ClientUnaryCall;
  
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
  
  SubmitFeedback(argument: _interchat_control_v1_SubmitFeedbackRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_FeedbackReceipt__Output>): grpc.ClientUnaryCall;
  SubmitFeedback(argument: _interchat_control_v1_SubmitFeedbackRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_FeedbackReceipt__Output>): grpc.ClientUnaryCall;
  SubmitFeedback(argument: _interchat_control_v1_SubmitFeedbackRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_FeedbackReceipt__Output>): grpc.ClientUnaryCall;
  SubmitFeedback(argument: _interchat_control_v1_SubmitFeedbackRequest, callback: grpc.requestCallback<_interchat_control_v1_FeedbackReceipt__Output>): grpc.ClientUnaryCall;
  submitFeedback(argument: _interchat_control_v1_SubmitFeedbackRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_FeedbackReceipt__Output>): grpc.ClientUnaryCall;
  submitFeedback(argument: _interchat_control_v1_SubmitFeedbackRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_FeedbackReceipt__Output>): grpc.ClientUnaryCall;
  submitFeedback(argument: _interchat_control_v1_SubmitFeedbackRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_FeedbackReceipt__Output>): grpc.ClientUnaryCall;
  submitFeedback(argument: _interchat_control_v1_SubmitFeedbackRequest, callback: grpc.requestCallback<_interchat_control_v1_FeedbackReceipt__Output>): grpc.ClientUnaryCall;
  
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
  
  GetLeaderboard: grpc.handleUnaryCall<_interchat_control_v1_GetLeaderboardRequest__Output, _interchat_control_v1_UserLeaderboard>;
  
  GetUserActivity: grpc.handleUnaryCall<_interchat_control_v1_GetUserActivityRequest__Output, _interchat_control_v1_UserActivity>;
  
  GetUserInbox: grpc.handleUnaryCall<_interchat_control_v1_GetUserInboxRequest__Output, _interchat_control_v1_UserInboxResponse>;
  
  GetUserPreferences: grpc.handleUnaryCall<_interchat_control_v1_RequestContext__Output, _interchat_control_v1_UserPreferences>;
  
  GetUserProfile: grpc.handleUnaryCall<_interchat_control_v1_GetUserProfileRequest__Output, _interchat_control_v1_UserProfile>;
  
  PatchUserPreferences: grpc.handleUnaryCall<_interchat_control_v1_PatchUserPreferencesRequest__Output, _interchat_control_v1_UserPreferences>;
  
  RecordVote: grpc.handleUnaryCall<_interchat_control_v1_RecordVoteRequest__Output, _interchat_control_v1_RecordVoteResponse>;
  
  SubmitFeedback: grpc.handleUnaryCall<_interchat_control_v1_SubmitFeedbackRequest__Output, _interchat_control_v1_FeedbackReceipt>;
  
  SyncDiscordIdentity: grpc.handleUnaryCall<_interchat_control_v1_SyncDiscordIdentityRequest__Output, _interchat_control_v1_UserProfile>;
  
}

export interface UserServiceDefinition extends grpc.ServiceDefinition {
  AcknowledgeInboxItem: MethodDefinition<_interchat_control_v1_AcknowledgeInboxItemRequest, _interchat_control_v1_EmptyResponse, _interchat_control_v1_AcknowledgeInboxItemRequest__Output, _interchat_control_v1_EmptyResponse__Output>
  GetLeaderboard: MethodDefinition<_interchat_control_v1_GetLeaderboardRequest, _interchat_control_v1_UserLeaderboard, _interchat_control_v1_GetLeaderboardRequest__Output, _interchat_control_v1_UserLeaderboard__Output>
  GetUserActivity: MethodDefinition<_interchat_control_v1_GetUserActivityRequest, _interchat_control_v1_UserActivity, _interchat_control_v1_GetUserActivityRequest__Output, _interchat_control_v1_UserActivity__Output>
  GetUserInbox: MethodDefinition<_interchat_control_v1_GetUserInboxRequest, _interchat_control_v1_UserInboxResponse, _interchat_control_v1_GetUserInboxRequest__Output, _interchat_control_v1_UserInboxResponse__Output>
  GetUserPreferences: MethodDefinition<_interchat_control_v1_RequestContext, _interchat_control_v1_UserPreferences, _interchat_control_v1_RequestContext__Output, _interchat_control_v1_UserPreferences__Output>
  GetUserProfile: MethodDefinition<_interchat_control_v1_GetUserProfileRequest, _interchat_control_v1_UserProfile, _interchat_control_v1_GetUserProfileRequest__Output, _interchat_control_v1_UserProfile__Output>
  PatchUserPreferences: MethodDefinition<_interchat_control_v1_PatchUserPreferencesRequest, _interchat_control_v1_UserPreferences, _interchat_control_v1_PatchUserPreferencesRequest__Output, _interchat_control_v1_UserPreferences__Output>
  RecordVote: MethodDefinition<_interchat_control_v1_RecordVoteRequest, _interchat_control_v1_RecordVoteResponse, _interchat_control_v1_RecordVoteRequest__Output, _interchat_control_v1_RecordVoteResponse__Output>
  SubmitFeedback: MethodDefinition<_interchat_control_v1_SubmitFeedbackRequest, _interchat_control_v1_FeedbackReceipt, _interchat_control_v1_SubmitFeedbackRequest__Output, _interchat_control_v1_FeedbackReceipt__Output>
  SyncDiscordIdentity: MethodDefinition<_interchat_control_v1_SyncDiscordIdentityRequest, _interchat_control_v1_UserProfile, _interchat_control_v1_SyncDiscordIdentityRequest__Output, _interchat_control_v1_UserProfile__Output>
}
