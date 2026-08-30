import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from './google/protobuf/Timestamp';
import type { Appeal as _interchat_control_v1_Appeal, Appeal__Output as _interchat_control_v1_Appeal__Output } from './interchat/control/v1/Appeal';
import type { Connection as _interchat_control_v1_Connection, Connection__Output as _interchat_control_v1_Connection__Output } from './interchat/control/v1/Connection';
import type { ConnectionMetadata as _interchat_control_v1_ConnectionMetadata, ConnectionMetadata__Output as _interchat_control_v1_ConnectionMetadata__Output } from './interchat/control/v1/ConnectionMetadata';
import type { ConnectionSpec as _interchat_control_v1_ConnectionSpec, ConnectionSpec__Output as _interchat_control_v1_ConnectionSpec__Output } from './interchat/control/v1/ConnectionSpec';
import type { ConnectionStatus as _interchat_control_v1_ConnectionStatus, ConnectionStatus__Output as _interchat_control_v1_ConnectionStatus__Output } from './interchat/control/v1/ConnectionStatus';
import type { EmptyResponse as _interchat_control_v1_EmptyResponse, EmptyResponse__Output as _interchat_control_v1_EmptyResponse__Output } from './interchat/control/v1/EmptyResponse';
import type { FeedbackReceipt as _interchat_control_v1_FeedbackReceipt, FeedbackReceipt__Output as _interchat_control_v1_FeedbackReceipt__Output } from './interchat/control/v1/FeedbackReceipt';
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
import type { HubSafetySettings as _interchat_control_v1_HubSafetySettings, HubSafetySettings__Output as _interchat_control_v1_HubSafetySettings__Output } from './interchat/control/v1/HubSafetySettings';
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
import type { ModerationSubject as _interchat_control_v1_ModerationSubject, ModerationSubject__Output as _interchat_control_v1_ModerationSubject__Output } from './interchat/control/v1/ModerationSubject';
import type { RequestContext as _interchat_control_v1_RequestContext, RequestContext__Output as _interchat_control_v1_RequestContext__Output } from './interchat/control/v1/RequestContext';
import type { SafetyAssessment as _interchat_control_v1_SafetyAssessment, SafetyAssessment__Output as _interchat_control_v1_SafetyAssessment__Output } from './interchat/control/v1/SafetyAssessment';
import type { SafetySignalSummary as _interchat_control_v1_SafetySignalSummary, SafetySignalSummary__Output as _interchat_control_v1_SafetySignalSummary__Output } from './interchat/control/v1/SafetySignalSummary';
import type { Server as _interchat_control_v1_Server, Server__Output as _interchat_control_v1_Server__Output } from './interchat/control/v1/Server';
import type { ServerBlock as _interchat_control_v1_ServerBlock, ServerBlock__Output as _interchat_control_v1_ServerBlock__Output } from './interchat/control/v1/ServerBlock';
import type { ServerMetadata as _interchat_control_v1_ServerMetadata, ServerMetadata__Output as _interchat_control_v1_ServerMetadata__Output } from './interchat/control/v1/ServerMetadata';
import type { ServerSpec as _interchat_control_v1_ServerSpec, ServerSpec__Output as _interchat_control_v1_ServerSpec__Output } from './interchat/control/v1/ServerSpec';
import type { ServerStatus as _interchat_control_v1_ServerStatus, ServerStatus__Output as _interchat_control_v1_ServerStatus__Output } from './interchat/control/v1/ServerStatus';
import type { UserActivity as _interchat_control_v1_UserActivity, UserActivity__Output as _interchat_control_v1_UserActivity__Output } from './interchat/control/v1/UserActivity';
import type { UserActivityHub as _interchat_control_v1_UserActivityHub, UserActivityHub__Output as _interchat_control_v1_UserActivityHub__Output } from './interchat/control/v1/UserActivityHub';
import type { UserInboxItem as _interchat_control_v1_UserInboxItem, UserInboxItem__Output as _interchat_control_v1_UserInboxItem__Output } from './interchat/control/v1/UserInboxItem';
import type { UserLeaderboard as _interchat_control_v1_UserLeaderboard, UserLeaderboard__Output as _interchat_control_v1_UserLeaderboard__Output } from './interchat/control/v1/UserLeaderboard';
import type { UserPreferences as _interchat_control_v1_UserPreferences, UserPreferences__Output as _interchat_control_v1_UserPreferences__Output } from './interchat/control/v1/UserPreferences';
import type { UserProfile as _interchat_control_v1_UserProfile, UserProfile__Output as _interchat_control_v1_UserProfile__Output } from './interchat/control/v1/UserProfile';

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
        ActorType: EnumTypeDefinition
        Appeal: MessageTypeDefinition<_interchat_control_v1_Appeal, _interchat_control_v1_Appeal__Output>
        AppealApprovalOutcome: EnumTypeDefinition
        AppealStatus: EnumTypeDefinition
        BlockTargetType: EnumTypeDefinition
        Connection: MessageTypeDefinition<_interchat_control_v1_Connection, _interchat_control_v1_Connection__Output>
        ConnectionMetadata: MessageTypeDefinition<_interchat_control_v1_ConnectionMetadata, _interchat_control_v1_ConnectionMetadata__Output>
        ConnectionSpec: MessageTypeDefinition<_interchat_control_v1_ConnectionSpec, _interchat_control_v1_ConnectionSpec__Output>
        ConnectionStatus: MessageTypeDefinition<_interchat_control_v1_ConnectionStatus, _interchat_control_v1_ConnectionStatus__Output>
        EmptyResponse: MessageTypeDefinition<_interchat_control_v1_EmptyResponse, _interchat_control_v1_EmptyResponse__Output>
        FeedbackReceipt: MessageTypeDefinition<_interchat_control_v1_FeedbackReceipt, _interchat_control_v1_FeedbackReceipt__Output>
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
        HubSafetySettings: MessageTypeDefinition<_interchat_control_v1_HubSafetySettings, _interchat_control_v1_HubSafetySettings__Output>
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
        InfractionLifecycleState: EnumTypeDefinition
        InfractionStatus: EnumTypeDefinition
        LeaderboardEntry: MessageTypeDefinition<_interchat_control_v1_LeaderboardEntry, _interchat_control_v1_LeaderboardEntry__Output>
        LeaderboardKind: EnumTypeDefinition
        ManagedHubSummary: MessageTypeDefinition<_interchat_control_v1_ManagedHubSummary, _interchat_control_v1_ManagedHubSummary__Output>
        ModerationSubject: MessageTypeDefinition<_interchat_control_v1_ModerationSubject, _interchat_control_v1_ModerationSubject__Output>
        NsfwFilter: EnumTypeDefinition
        RequestContext: MessageTypeDefinition<_interchat_control_v1_RequestContext, _interchat_control_v1_RequestContext__Output>
        SafetyAssessment: MessageTypeDefinition<_interchat_control_v1_SafetyAssessment, _interchat_control_v1_SafetyAssessment__Output>
        SafetyRiskBand: EnumTypeDefinition
        SafetySignalSummary: MessageTypeDefinition<_interchat_control_v1_SafetySignalSummary, _interchat_control_v1_SafetySignalSummary__Output>
        SanctionEnforcementStatus: EnumTypeDefinition
        SanctionType: EnumTypeDefinition
        Server: MessageTypeDefinition<_interchat_control_v1_Server, _interchat_control_v1_Server__Output>
        ServerBlock: MessageTypeDefinition<_interchat_control_v1_ServerBlock, _interchat_control_v1_ServerBlock__Output>
        ServerMetadata: MessageTypeDefinition<_interchat_control_v1_ServerMetadata, _interchat_control_v1_ServerMetadata__Output>
        ServerSpec: MessageTypeDefinition<_interchat_control_v1_ServerSpec, _interchat_control_v1_ServerSpec__Output>
        ServerStatus: MessageTypeDefinition<_interchat_control_v1_ServerStatus, _interchat_control_v1_ServerStatus__Output>
        UserActivity: MessageTypeDefinition<_interchat_control_v1_UserActivity, _interchat_control_v1_UserActivity__Output>
        UserActivityHub: MessageTypeDefinition<_interchat_control_v1_UserActivityHub, _interchat_control_v1_UserActivityHub__Output>
        UserInboxItem: MessageTypeDefinition<_interchat_control_v1_UserInboxItem, _interchat_control_v1_UserInboxItem__Output>
        UserLeaderboard: MessageTypeDefinition<_interchat_control_v1_UserLeaderboard, _interchat_control_v1_UserLeaderboard__Output>
        UserPreferences: MessageTypeDefinition<_interchat_control_v1_UserPreferences, _interchat_control_v1_UserPreferences__Output>
        UserProfile: MessageTypeDefinition<_interchat_control_v1_UserProfile, _interchat_control_v1_UserProfile__Output>
        VoteProvider: EnumTypeDefinition
      }
    }
  }
}

