import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from './google/protobuf/Timestamp';
import type { AcknowledgeInboxItemRequest as _interchat_control_v1_AcknowledgeInboxItemRequest, AcknowledgeInboxItemRequest__Output as _interchat_control_v1_AcknowledgeInboxItemRequest__Output } from './interchat/control/v1/AcknowledgeInboxItemRequest';
import type { Appeal as _interchat_control_v1_Appeal, Appeal__Output as _interchat_control_v1_Appeal__Output } from './interchat/control/v1/Appeal';
import type { Connection as _interchat_control_v1_Connection, Connection__Output as _interchat_control_v1_Connection__Output } from './interchat/control/v1/Connection';
import type { ConnectionMetadata as _interchat_control_v1_ConnectionMetadata, ConnectionMetadata__Output as _interchat_control_v1_ConnectionMetadata__Output } from './interchat/control/v1/ConnectionMetadata';
import type { ConnectionSpec as _interchat_control_v1_ConnectionSpec, ConnectionSpec__Output as _interchat_control_v1_ConnectionSpec__Output } from './interchat/control/v1/ConnectionSpec';
import type { ConnectionStatus as _interchat_control_v1_ConnectionStatus, ConnectionStatus__Output as _interchat_control_v1_ConnectionStatus__Output } from './interchat/control/v1/ConnectionStatus';
import type { EmptyResponse as _interchat_control_v1_EmptyResponse, EmptyResponse__Output as _interchat_control_v1_EmptyResponse__Output } from './interchat/control/v1/EmptyResponse';
import type { FeedbackReceipt as _interchat_control_v1_FeedbackReceipt, FeedbackReceipt__Output as _interchat_control_v1_FeedbackReceipt__Output } from './interchat/control/v1/FeedbackReceipt';
import type { GetLeaderboardRequest as _interchat_control_v1_GetLeaderboardRequest, GetLeaderboardRequest__Output as _interchat_control_v1_GetLeaderboardRequest__Output } from './interchat/control/v1/GetLeaderboardRequest';
import type { GetUserActivityRequest as _interchat_control_v1_GetUserActivityRequest, GetUserActivityRequest__Output as _interchat_control_v1_GetUserActivityRequest__Output } from './interchat/control/v1/GetUserActivityRequest';
import type { GetUserInboxRequest as _interchat_control_v1_GetUserInboxRequest, GetUserInboxRequest__Output as _interchat_control_v1_GetUserInboxRequest__Output } from './interchat/control/v1/GetUserInboxRequest';
import type { GetUserProfileRequest as _interchat_control_v1_GetUserProfileRequest, GetUserProfileRequest__Output as _interchat_control_v1_GetUserProfileRequest__Output } from './interchat/control/v1/GetUserProfileRequest';
import type { Hub as _interchat_control_v1_Hub, Hub__Output as _interchat_control_v1_Hub__Output } from './interchat/control/v1/Hub';
import type { HubAnnouncement as _interchat_control_v1_HubAnnouncement, HubAnnouncement__Output as _interchat_control_v1_HubAnnouncement__Output } from './interchat/control/v1/HubAnnouncement';
import type { HubAnnouncementMetadata as _interchat_control_v1_HubAnnouncementMetadata, HubAnnouncementMetadata__Output as _interchat_control_v1_HubAnnouncementMetadata__Output } from './interchat/control/v1/HubAnnouncementMetadata';
import type { HubAnnouncementSpec as _interchat_control_v1_HubAnnouncementSpec, HubAnnouncementSpec__Output as _interchat_control_v1_HubAnnouncementSpec__Output } from './interchat/control/v1/HubAnnouncementSpec';
import type { HubAnnouncementStatus as _interchat_control_v1_HubAnnouncementStatus, HubAnnouncementStatus__Output as _interchat_control_v1_HubAnnouncementStatus__Output } from './interchat/control/v1/HubAnnouncementStatus';
import type { HubAuditEntry as _interchat_control_v1_HubAuditEntry, HubAuditEntry__Output as _interchat_control_v1_HubAuditEntry__Output } from './interchat/control/v1/HubAuditEntry';
import type { HubBadgeConfig as _interchat_control_v1_HubBadgeConfig, HubBadgeConfig__Output as _interchat_control_v1_HubBadgeConfig__Output } from './interchat/control/v1/HubBadgeConfig';
import type { HubDirectoryItem as _interchat_control_v1_HubDirectoryItem, HubDirectoryItem__Output as _interchat_control_v1_HubDirectoryItem__Output } from './interchat/control/v1/HubDirectoryItem';
import type { HubInvite as _interchat_control_v1_HubInvite, HubInvite__Output as _interchat_control_v1_HubInvite__Output } from './interchat/control/v1/HubInvite';
import type { HubLogConfig as _interchat_control_v1_HubLogConfig, HubLogConfig__Output as _interchat_control_v1_HubLogConfig__Output } from './interchat/control/v1/HubLogConfig';
import type { HubMetadata as _interchat_control_v1_HubMetadata, HubMetadata__Output as _interchat_control_v1_HubMetadata__Output } from './interchat/control/v1/HubMetadata';
import type { HubRole as _interchat_control_v1_HubRole, HubRole__Output as _interchat_control_v1_HubRole__Output } from './interchat/control/v1/HubRole';
import type { HubRoleMetadata as _interchat_control_v1_HubRoleMetadata, HubRoleMetadata__Output as _interchat_control_v1_HubRoleMetadata__Output } from './interchat/control/v1/HubRoleMetadata';
import type { HubRoleSpec as _interchat_control_v1_HubRoleSpec, HubRoleSpec__Output as _interchat_control_v1_HubRoleSpec__Output } from './interchat/control/v1/HubRoleSpec';
import type { HubRoleStatus as _interchat_control_v1_HubRoleStatus, HubRoleStatus__Output as _interchat_control_v1_HubRoleStatus__Output } from './interchat/control/v1/HubRoleStatus';
import type { HubRule as _interchat_control_v1_HubRule, HubRule__Output as _interchat_control_v1_HubRule__Output } from './interchat/control/v1/HubRule';
import type { HubSpec as _interchat_control_v1_HubSpec, HubSpec__Output as _interchat_control_v1_HubSpec__Output } from './interchat/control/v1/HubSpec';
import type { HubStaffMember as _interchat_control_v1_HubStaffMember, HubStaffMember__Output as _interchat_control_v1_HubStaffMember__Output } from './interchat/control/v1/HubStaffMember';
import type { HubStaffMemberMetadata as _interchat_control_v1_HubStaffMemberMetadata, HubStaffMemberMetadata__Output as _interchat_control_v1_HubStaffMemberMetadata__Output } from './interchat/control/v1/HubStaffMemberMetadata';
import type { HubStaffMemberSpec as _interchat_control_v1_HubStaffMemberSpec, HubStaffMemberSpec__Output as _interchat_control_v1_HubStaffMemberSpec__Output } from './interchat/control/v1/HubStaffMemberSpec';
import type { HubStaffMemberStatus as _interchat_control_v1_HubStaffMemberStatus, HubStaffMemberStatus__Output as _interchat_control_v1_HubStaffMemberStatus__Output } from './interchat/control/v1/HubStaffMemberStatus';
import type { HubStatus as _interchat_control_v1_HubStatus, HubStatus__Output as _interchat_control_v1_HubStatus__Output } from './interchat/control/v1/HubStatus';
import type { HubTag as _interchat_control_v1_HubTag, HubTag__Output as _interchat_control_v1_HubTag__Output } from './interchat/control/v1/HubTag';
import type { Infraction as _interchat_control_v1_Infraction, Infraction__Output as _interchat_control_v1_Infraction__Output } from './interchat/control/v1/Infraction';
import type { LeaderboardEntry as _interchat_control_v1_LeaderboardEntry, LeaderboardEntry__Output as _interchat_control_v1_LeaderboardEntry__Output } from './interchat/control/v1/LeaderboardEntry';
import type { ManagedHubSummary as _interchat_control_v1_ManagedHubSummary, ManagedHubSummary__Output as _interchat_control_v1_ManagedHubSummary__Output } from './interchat/control/v1/ManagedHubSummary';
import type { PatchUserPreferencesRequest as _interchat_control_v1_PatchUserPreferencesRequest, PatchUserPreferencesRequest__Output as _interchat_control_v1_PatchUserPreferencesRequest__Output } from './interchat/control/v1/PatchUserPreferencesRequest';
import type { RecordVoteRequest as _interchat_control_v1_RecordVoteRequest, RecordVoteRequest__Output as _interchat_control_v1_RecordVoteRequest__Output } from './interchat/control/v1/RecordVoteRequest';
import type { RecordVoteResponse as _interchat_control_v1_RecordVoteResponse, RecordVoteResponse__Output as _interchat_control_v1_RecordVoteResponse__Output } from './interchat/control/v1/RecordVoteResponse';
import type { RequestContext as _interchat_control_v1_RequestContext, RequestContext__Output as _interchat_control_v1_RequestContext__Output } from './interchat/control/v1/RequestContext';
import type { Server as _interchat_control_v1_Server, Server__Output as _interchat_control_v1_Server__Output } from './interchat/control/v1/Server';
import type { ServerBlock as _interchat_control_v1_ServerBlock, ServerBlock__Output as _interchat_control_v1_ServerBlock__Output } from './interchat/control/v1/ServerBlock';
import type { ServerMetadata as _interchat_control_v1_ServerMetadata, ServerMetadata__Output as _interchat_control_v1_ServerMetadata__Output } from './interchat/control/v1/ServerMetadata';
import type { ServerSpec as _interchat_control_v1_ServerSpec, ServerSpec__Output as _interchat_control_v1_ServerSpec__Output } from './interchat/control/v1/ServerSpec';
import type { ServerStatus as _interchat_control_v1_ServerStatus, ServerStatus__Output as _interchat_control_v1_ServerStatus__Output } from './interchat/control/v1/ServerStatus';
import type { SubmitFeedbackRequest as _interchat_control_v1_SubmitFeedbackRequest, SubmitFeedbackRequest__Output as _interchat_control_v1_SubmitFeedbackRequest__Output } from './interchat/control/v1/SubmitFeedbackRequest';
import type { SyncDiscordIdentityRequest as _interchat_control_v1_SyncDiscordIdentityRequest, SyncDiscordIdentityRequest__Output as _interchat_control_v1_SyncDiscordIdentityRequest__Output } from './interchat/control/v1/SyncDiscordIdentityRequest';
import type { UserActivity as _interchat_control_v1_UserActivity, UserActivity__Output as _interchat_control_v1_UserActivity__Output } from './interchat/control/v1/UserActivity';
import type { UserActivityHub as _interchat_control_v1_UserActivityHub, UserActivityHub__Output as _interchat_control_v1_UserActivityHub__Output } from './interchat/control/v1/UserActivityHub';
import type { UserInboxItem as _interchat_control_v1_UserInboxItem, UserInboxItem__Output as _interchat_control_v1_UserInboxItem__Output } from './interchat/control/v1/UserInboxItem';
import type { UserInboxResponse as _interchat_control_v1_UserInboxResponse, UserInboxResponse__Output as _interchat_control_v1_UserInboxResponse__Output } from './interchat/control/v1/UserInboxResponse';
import type { UserLeaderboard as _interchat_control_v1_UserLeaderboard, UserLeaderboard__Output as _interchat_control_v1_UserLeaderboard__Output } from './interchat/control/v1/UserLeaderboard';
import type { UserPreferences as _interchat_control_v1_UserPreferences, UserPreferences__Output as _interchat_control_v1_UserPreferences__Output } from './interchat/control/v1/UserPreferences';
import type { UserProfile as _interchat_control_v1_UserProfile, UserProfile__Output as _interchat_control_v1_UserProfile__Output } from './interchat/control/v1/UserProfile';
import type { UserServiceClient as _interchat_control_v1_UserServiceClient, UserServiceDefinition as _interchat_control_v1_UserServiceDefinition } from './interchat/control/v1/UserService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  google: {
    protobuf: {
      Timestamp: MessageTypeDefinition<_google_protobuf_Timestamp, _google_protobuf_Timestamp__Output>
    }
  }
  interchat: {
    control: {
      v1: {
        AcknowledgeInboxItemRequest: MessageTypeDefinition<_interchat_control_v1_AcknowledgeInboxItemRequest, _interchat_control_v1_AcknowledgeInboxItemRequest__Output>
        ActorType: EnumTypeDefinition
        Appeal: MessageTypeDefinition<_interchat_control_v1_Appeal, _interchat_control_v1_Appeal__Output>
        BlockTargetType: EnumTypeDefinition
        Connection: MessageTypeDefinition<_interchat_control_v1_Connection, _interchat_control_v1_Connection__Output>
        ConnectionMetadata: MessageTypeDefinition<_interchat_control_v1_ConnectionMetadata, _interchat_control_v1_ConnectionMetadata__Output>
        ConnectionSpec: MessageTypeDefinition<_interchat_control_v1_ConnectionSpec, _interchat_control_v1_ConnectionSpec__Output>
        ConnectionStatus: MessageTypeDefinition<_interchat_control_v1_ConnectionStatus, _interchat_control_v1_ConnectionStatus__Output>
        EmptyResponse: MessageTypeDefinition<_interchat_control_v1_EmptyResponse, _interchat_control_v1_EmptyResponse__Output>
        FeedbackReceipt: MessageTypeDefinition<_interchat_control_v1_FeedbackReceipt, _interchat_control_v1_FeedbackReceipt__Output>
        GetLeaderboardRequest: MessageTypeDefinition<_interchat_control_v1_GetLeaderboardRequest, _interchat_control_v1_GetLeaderboardRequest__Output>
        GetUserActivityRequest: MessageTypeDefinition<_interchat_control_v1_GetUserActivityRequest, _interchat_control_v1_GetUserActivityRequest__Output>
        GetUserInboxRequest: MessageTypeDefinition<_interchat_control_v1_GetUserInboxRequest, _interchat_control_v1_GetUserInboxRequest__Output>
        GetUserProfileRequest: MessageTypeDefinition<_interchat_control_v1_GetUserProfileRequest, _interchat_control_v1_GetUserProfileRequest__Output>
        Hub: MessageTypeDefinition<_interchat_control_v1_Hub, _interchat_control_v1_Hub__Output>
        HubActivityLevel: EnumTypeDefinition
        HubAnnouncement: MessageTypeDefinition<_interchat_control_v1_HubAnnouncement, _interchat_control_v1_HubAnnouncement__Output>
        HubAnnouncementDeliveryState: EnumTypeDefinition
        HubAnnouncementDesiredState: EnumTypeDefinition
        HubAnnouncementMetadata: MessageTypeDefinition<_interchat_control_v1_HubAnnouncementMetadata, _interchat_control_v1_HubAnnouncementMetadata__Output>
        HubAnnouncementSpec: MessageTypeDefinition<_interchat_control_v1_HubAnnouncementSpec, _interchat_control_v1_HubAnnouncementSpec__Output>
        HubAnnouncementStatus: MessageTypeDefinition<_interchat_control_v1_HubAnnouncementStatus, _interchat_control_v1_HubAnnouncementStatus__Output>
        HubAuditEntry: MessageTypeDefinition<_interchat_control_v1_HubAuditEntry, _interchat_control_v1_HubAuditEntry__Output>
        HubBadgeConfig: MessageTypeDefinition<_interchat_control_v1_HubBadgeConfig, _interchat_control_v1_HubBadgeConfig__Output>
        HubDirectoryItem: MessageTypeDefinition<_interchat_control_v1_HubDirectoryItem, _interchat_control_v1_HubDirectoryItem__Output>
        HubInvite: MessageTypeDefinition<_interchat_control_v1_HubInvite, _interchat_control_v1_HubInvite__Output>
        HubLogConfig: MessageTypeDefinition<_interchat_control_v1_HubLogConfig, _interchat_control_v1_HubLogConfig__Output>
        HubMetadata: MessageTypeDefinition<_interchat_control_v1_HubMetadata, _interchat_control_v1_HubMetadata__Output>
        HubRole: MessageTypeDefinition<_interchat_control_v1_HubRole, _interchat_control_v1_HubRole__Output>
        HubRoleMetadata: MessageTypeDefinition<_interchat_control_v1_HubRoleMetadata, _interchat_control_v1_HubRoleMetadata__Output>
        HubRoleSpec: MessageTypeDefinition<_interchat_control_v1_HubRoleSpec, _interchat_control_v1_HubRoleSpec__Output>
        HubRoleStatus: MessageTypeDefinition<_interchat_control_v1_HubRoleStatus, _interchat_control_v1_HubRoleStatus__Output>
        HubRule: MessageTypeDefinition<_interchat_control_v1_HubRule, _interchat_control_v1_HubRule__Output>
        HubSearchSort: EnumTypeDefinition
        HubSpec: MessageTypeDefinition<_interchat_control_v1_HubSpec, _interchat_control_v1_HubSpec__Output>
        HubStaffMember: MessageTypeDefinition<_interchat_control_v1_HubStaffMember, _interchat_control_v1_HubStaffMember__Output>
        HubStaffMemberMetadata: MessageTypeDefinition<_interchat_control_v1_HubStaffMemberMetadata, _interchat_control_v1_HubStaffMemberMetadata__Output>
        HubStaffMemberSpec: MessageTypeDefinition<_interchat_control_v1_HubStaffMemberSpec, _interchat_control_v1_HubStaffMemberSpec__Output>
        HubStaffMemberStatus: MessageTypeDefinition<_interchat_control_v1_HubStaffMemberStatus, _interchat_control_v1_HubStaffMemberStatus__Output>
        HubStatus: MessageTypeDefinition<_interchat_control_v1_HubStatus, _interchat_control_v1_HubStatus__Output>
        HubTag: MessageTypeDefinition<_interchat_control_v1_HubTag, _interchat_control_v1_HubTag__Output>
        HubVisibility: EnumTypeDefinition
        Infraction: MessageTypeDefinition<_interchat_control_v1_Infraction, _interchat_control_v1_Infraction__Output>
        InfractionStatus: EnumTypeDefinition
        LeaderboardEntry: MessageTypeDefinition<_interchat_control_v1_LeaderboardEntry, _interchat_control_v1_LeaderboardEntry__Output>
        LeaderboardKind: EnumTypeDefinition
        ManagedHubSummary: MessageTypeDefinition<_interchat_control_v1_ManagedHubSummary, _interchat_control_v1_ManagedHubSummary__Output>
        NsfwFilter: EnumTypeDefinition
        PatchUserPreferencesRequest: MessageTypeDefinition<_interchat_control_v1_PatchUserPreferencesRequest, _interchat_control_v1_PatchUserPreferencesRequest__Output>
        RecordVoteRequest: MessageTypeDefinition<_interchat_control_v1_RecordVoteRequest, _interchat_control_v1_RecordVoteRequest__Output>
        RecordVoteResponse: MessageTypeDefinition<_interchat_control_v1_RecordVoteResponse, _interchat_control_v1_RecordVoteResponse__Output>
        RequestContext: MessageTypeDefinition<_interchat_control_v1_RequestContext, _interchat_control_v1_RequestContext__Output>
        SanctionType: EnumTypeDefinition
        Server: MessageTypeDefinition<_interchat_control_v1_Server, _interchat_control_v1_Server__Output>
        ServerBlock: MessageTypeDefinition<_interchat_control_v1_ServerBlock, _interchat_control_v1_ServerBlock__Output>
        ServerMetadata: MessageTypeDefinition<_interchat_control_v1_ServerMetadata, _interchat_control_v1_ServerMetadata__Output>
        ServerSpec: MessageTypeDefinition<_interchat_control_v1_ServerSpec, _interchat_control_v1_ServerSpec__Output>
        ServerStatus: MessageTypeDefinition<_interchat_control_v1_ServerStatus, _interchat_control_v1_ServerStatus__Output>
        SubmitFeedbackRequest: MessageTypeDefinition<_interchat_control_v1_SubmitFeedbackRequest, _interchat_control_v1_SubmitFeedbackRequest__Output>
        SyncDiscordIdentityRequest: MessageTypeDefinition<_interchat_control_v1_SyncDiscordIdentityRequest, _interchat_control_v1_SyncDiscordIdentityRequest__Output>
        UserActivity: MessageTypeDefinition<_interchat_control_v1_UserActivity, _interchat_control_v1_UserActivity__Output>
        UserActivityHub: MessageTypeDefinition<_interchat_control_v1_UserActivityHub, _interchat_control_v1_UserActivityHub__Output>
        UserInboxItem: MessageTypeDefinition<_interchat_control_v1_UserInboxItem, _interchat_control_v1_UserInboxItem__Output>
        UserInboxResponse: MessageTypeDefinition<_interchat_control_v1_UserInboxResponse, _interchat_control_v1_UserInboxResponse__Output>
        UserLeaderboard: MessageTypeDefinition<_interchat_control_v1_UserLeaderboard, _interchat_control_v1_UserLeaderboard__Output>
        UserPreferences: MessageTypeDefinition<_interchat_control_v1_UserPreferences, _interchat_control_v1_UserPreferences__Output>
        UserProfile: MessageTypeDefinition<_interchat_control_v1_UserProfile, _interchat_control_v1_UserProfile__Output>
        UserService: SubtypeConstructor<typeof grpc.Client, _interchat_control_v1_UserServiceClient> & { service: _interchat_control_v1_UserServiceDefinition }
        VoteProvider: EnumTypeDefinition
      }
    }
  }
}

