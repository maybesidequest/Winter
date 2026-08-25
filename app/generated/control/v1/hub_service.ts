import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { FieldMask as _google_protobuf_FieldMask, FieldMask__Output as _google_protobuf_FieldMask__Output } from './google/protobuf/FieldMask';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from './google/protobuf/Timestamp';
import type { Appeal as _interchat_control_v1_Appeal, Appeal__Output as _interchat_control_v1_Appeal__Output } from './interchat/control/v1/Appeal';
import type { AssignHubStaffRoleRequest as _interchat_control_v1_AssignHubStaffRoleRequest, AssignHubStaffRoleRequest__Output as _interchat_control_v1_AssignHubStaffRoleRequest__Output } from './interchat/control/v1/AssignHubStaffRoleRequest';
import type { Connection as _interchat_control_v1_Connection, Connection__Output as _interchat_control_v1_Connection__Output } from './interchat/control/v1/Connection';
import type { ConnectionMetadata as _interchat_control_v1_ConnectionMetadata, ConnectionMetadata__Output as _interchat_control_v1_ConnectionMetadata__Output } from './interchat/control/v1/ConnectionMetadata';
import type { ConnectionSpec as _interchat_control_v1_ConnectionSpec, ConnectionSpec__Output as _interchat_control_v1_ConnectionSpec__Output } from './interchat/control/v1/ConnectionSpec';
import type { ConnectionStatus as _interchat_control_v1_ConnectionStatus, ConnectionStatus__Output as _interchat_control_v1_ConnectionStatus__Output } from './interchat/control/v1/ConnectionStatus';
import type { CreateHubAnnouncementRequest as _interchat_control_v1_CreateHubAnnouncementRequest, CreateHubAnnouncementRequest__Output as _interchat_control_v1_CreateHubAnnouncementRequest__Output } from './interchat/control/v1/CreateHubAnnouncementRequest';
import type { CreateHubInviteRequest as _interchat_control_v1_CreateHubInviteRequest, CreateHubInviteRequest__Output as _interchat_control_v1_CreateHubInviteRequest__Output } from './interchat/control/v1/CreateHubInviteRequest';
import type { CreateHubRequest as _interchat_control_v1_CreateHubRequest, CreateHubRequest__Output as _interchat_control_v1_CreateHubRequest__Output } from './interchat/control/v1/CreateHubRequest';
import type { CreateHubRuleRequest as _interchat_control_v1_CreateHubRuleRequest, CreateHubRuleRequest__Output as _interchat_control_v1_CreateHubRuleRequest__Output } from './interchat/control/v1/CreateHubRuleRequest';
import type { DeleteHubAnnouncementRequest as _interchat_control_v1_DeleteHubAnnouncementRequest, DeleteHubAnnouncementRequest__Output as _interchat_control_v1_DeleteHubAnnouncementRequest__Output } from './interchat/control/v1/DeleteHubAnnouncementRequest';
import type { DeleteHubRequest as _interchat_control_v1_DeleteHubRequest, DeleteHubRequest__Output as _interchat_control_v1_DeleteHubRequest__Output } from './interchat/control/v1/DeleteHubRequest';
import type { DeleteHubRuleRequest as _interchat_control_v1_DeleteHubRuleRequest, DeleteHubRuleRequest__Output as _interchat_control_v1_DeleteHubRuleRequest__Output } from './interchat/control/v1/DeleteHubRuleRequest';
import type { EmptyResponse as _interchat_control_v1_EmptyResponse, EmptyResponse__Output as _interchat_control_v1_EmptyResponse__Output } from './interchat/control/v1/EmptyResponse';
import type { GetHubRequest as _interchat_control_v1_GetHubRequest, GetHubRequest__Output as _interchat_control_v1_GetHubRequest__Output } from './interchat/control/v1/GetHubRequest';
import type { Hub as _interchat_control_v1_Hub, Hub__Output as _interchat_control_v1_Hub__Output } from './interchat/control/v1/Hub';
import type { HubAnnouncement as _interchat_control_v1_HubAnnouncement, HubAnnouncement__Output as _interchat_control_v1_HubAnnouncement__Output } from './interchat/control/v1/HubAnnouncement';
import type { HubAnnouncementsResponse as _interchat_control_v1_HubAnnouncementsResponse, HubAnnouncementsResponse__Output as _interchat_control_v1_HubAnnouncementsResponse__Output } from './interchat/control/v1/HubAnnouncementsResponse';
import type { HubBadgeConfig as _interchat_control_v1_HubBadgeConfig, HubBadgeConfig__Output as _interchat_control_v1_HubBadgeConfig__Output } from './interchat/control/v1/HubBadgeConfig';
import type { HubInvite as _interchat_control_v1_HubInvite, HubInvite__Output as _interchat_control_v1_HubInvite__Output } from './interchat/control/v1/HubInvite';
import type { HubInvitesResponse as _interchat_control_v1_HubInvitesResponse, HubInvitesResponse__Output as _interchat_control_v1_HubInvitesResponse__Output } from './interchat/control/v1/HubInvitesResponse';
import type { HubLogConfig as _interchat_control_v1_HubLogConfig, HubLogConfig__Output as _interchat_control_v1_HubLogConfig__Output } from './interchat/control/v1/HubLogConfig';
import type { HubMetadata as _interchat_control_v1_HubMetadata, HubMetadata__Output as _interchat_control_v1_HubMetadata__Output } from './interchat/control/v1/HubMetadata';
import type { HubRule as _interchat_control_v1_HubRule, HubRule__Output as _interchat_control_v1_HubRule__Output } from './interchat/control/v1/HubRule';
import type { HubRulesResponse as _interchat_control_v1_HubRulesResponse, HubRulesResponse__Output as _interchat_control_v1_HubRulesResponse__Output } from './interchat/control/v1/HubRulesResponse';
import type { HubServiceClient as _interchat_control_v1_HubServiceClient, HubServiceDefinition as _interchat_control_v1_HubServiceDefinition } from './interchat/control/v1/HubService';
import type { HubSpec as _interchat_control_v1_HubSpec, HubSpec__Output as _interchat_control_v1_HubSpec__Output } from './interchat/control/v1/HubSpec';
import type { HubStaffMember as _interchat_control_v1_HubStaffMember, HubStaffMember__Output as _interchat_control_v1_HubStaffMember__Output } from './interchat/control/v1/HubStaffMember';
import type { HubStaffMemberMetadata as _interchat_control_v1_HubStaffMemberMetadata, HubStaffMemberMetadata__Output as _interchat_control_v1_HubStaffMemberMetadata__Output } from './interchat/control/v1/HubStaffMemberMetadata';
import type { HubStaffMemberSpec as _interchat_control_v1_HubStaffMemberSpec, HubStaffMemberSpec__Output as _interchat_control_v1_HubStaffMemberSpec__Output } from './interchat/control/v1/HubStaffMemberSpec';
import type { HubStaffMemberStatus as _interchat_control_v1_HubStaffMemberStatus, HubStaffMemberStatus__Output as _interchat_control_v1_HubStaffMemberStatus__Output } from './interchat/control/v1/HubStaffMemberStatus';
import type { HubStaffResponse as _interchat_control_v1_HubStaffResponse, HubStaffResponse__Output as _interchat_control_v1_HubStaffResponse__Output } from './interchat/control/v1/HubStaffResponse';
import type { HubStatus as _interchat_control_v1_HubStatus, HubStatus__Output as _interchat_control_v1_HubStatus__Output } from './interchat/control/v1/HubStatus';
import type { Infraction as _interchat_control_v1_Infraction, Infraction__Output as _interchat_control_v1_Infraction__Output } from './interchat/control/v1/Infraction';
import type { ListHubAnnouncementsRequest as _interchat_control_v1_ListHubAnnouncementsRequest, ListHubAnnouncementsRequest__Output as _interchat_control_v1_ListHubAnnouncementsRequest__Output } from './interchat/control/v1/ListHubAnnouncementsRequest';
import type { ListHubInvitesRequest as _interchat_control_v1_ListHubInvitesRequest, ListHubInvitesRequest__Output as _interchat_control_v1_ListHubInvitesRequest__Output } from './interchat/control/v1/ListHubInvitesRequest';
import type { ListHubStaffRequest as _interchat_control_v1_ListHubStaffRequest, ListHubStaffRequest__Output as _interchat_control_v1_ListHubStaffRequest__Output } from './interchat/control/v1/ListHubStaffRequest';
import type { LockdownHubRequest as _interchat_control_v1_LockdownHubRequest, LockdownHubRequest__Output as _interchat_control_v1_LockdownHubRequest__Output } from './interchat/control/v1/LockdownHubRequest';
import type { PatchHubBadgesRequest as _interchat_control_v1_PatchHubBadgesRequest, PatchHubBadgesRequest__Output as _interchat_control_v1_PatchHubBadgesRequest__Output } from './interchat/control/v1/PatchHubBadgesRequest';
import type { PatchHubLogConfigRequest as _interchat_control_v1_PatchHubLogConfigRequest, PatchHubLogConfigRequest__Output as _interchat_control_v1_PatchHubLogConfigRequest__Output } from './interchat/control/v1/PatchHubLogConfigRequest';
import type { PatchHubRequest as _interchat_control_v1_PatchHubRequest, PatchHubRequest__Output as _interchat_control_v1_PatchHubRequest__Output } from './interchat/control/v1/PatchHubRequest';
import type { RemoveHubStaffRoleRequest as _interchat_control_v1_RemoveHubStaffRoleRequest, RemoveHubStaffRoleRequest__Output as _interchat_control_v1_RemoveHubStaffRoleRequest__Output } from './interchat/control/v1/RemoveHubStaffRoleRequest';
import type { ReorderHubRulesRequest as _interchat_control_v1_ReorderHubRulesRequest, ReorderHubRulesRequest__Output as _interchat_control_v1_ReorderHubRulesRequest__Output } from './interchat/control/v1/ReorderHubRulesRequest';
import type { RequestContext as _interchat_control_v1_RequestContext, RequestContext__Output as _interchat_control_v1_RequestContext__Output } from './interchat/control/v1/RequestContext';
import type { RevokeHubInviteRequest as _interchat_control_v1_RevokeHubInviteRequest, RevokeHubInviteRequest__Output as _interchat_control_v1_RevokeHubInviteRequest__Output } from './interchat/control/v1/RevokeHubInviteRequest';
import type { Server as _interchat_control_v1_Server, Server__Output as _interchat_control_v1_Server__Output } from './interchat/control/v1/Server';
import type { ServerBlock as _interchat_control_v1_ServerBlock, ServerBlock__Output as _interchat_control_v1_ServerBlock__Output } from './interchat/control/v1/ServerBlock';
import type { ServerMetadata as _interchat_control_v1_ServerMetadata, ServerMetadata__Output as _interchat_control_v1_ServerMetadata__Output } from './interchat/control/v1/ServerMetadata';
import type { ServerSpec as _interchat_control_v1_ServerSpec, ServerSpec__Output as _interchat_control_v1_ServerSpec__Output } from './interchat/control/v1/ServerSpec';
import type { ServerStatus as _interchat_control_v1_ServerStatus, ServerStatus__Output as _interchat_control_v1_ServerStatus__Output } from './interchat/control/v1/ServerStatus';
import type { TransferHubOwnershipRequest as _interchat_control_v1_TransferHubOwnershipRequest, TransferHubOwnershipRequest__Output as _interchat_control_v1_TransferHubOwnershipRequest__Output } from './interchat/control/v1/TransferHubOwnershipRequest';
import type { UpdateHubAnnouncementRequest as _interchat_control_v1_UpdateHubAnnouncementRequest, UpdateHubAnnouncementRequest__Output as _interchat_control_v1_UpdateHubAnnouncementRequest__Output } from './interchat/control/v1/UpdateHubAnnouncementRequest';
import type { UpdateHubRuleRequest as _interchat_control_v1_UpdateHubRuleRequest, UpdateHubRuleRequest__Output as _interchat_control_v1_UpdateHubRuleRequest__Output } from './interchat/control/v1/UpdateHubRuleRequest';
import type { UserInboxItem as _interchat_control_v1_UserInboxItem, UserInboxItem__Output as _interchat_control_v1_UserInboxItem__Output } from './interchat/control/v1/UserInboxItem';
import type { UserPreferences as _interchat_control_v1_UserPreferences, UserPreferences__Output as _interchat_control_v1_UserPreferences__Output } from './interchat/control/v1/UserPreferences';
import type { UserProfile as _interchat_control_v1_UserProfile, UserProfile__Output as _interchat_control_v1_UserProfile__Output } from './interchat/control/v1/UserProfile';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  google: {
    protobuf: {
      FieldMask: MessageTypeDefinition<_google_protobuf_FieldMask, _google_protobuf_FieldMask__Output>
      Timestamp: MessageTypeDefinition<_google_protobuf_Timestamp, _google_protobuf_Timestamp__Output>
    }
  }
  interchat: {
    control: {
      v1: {
        ActorType: EnumTypeDefinition
        Appeal: MessageTypeDefinition<_interchat_control_v1_Appeal, _interchat_control_v1_Appeal__Output>
        AssignHubStaffRoleRequest: MessageTypeDefinition<_interchat_control_v1_AssignHubStaffRoleRequest, _interchat_control_v1_AssignHubStaffRoleRequest__Output>
        BlockTargetType: EnumTypeDefinition
        Connection: MessageTypeDefinition<_interchat_control_v1_Connection, _interchat_control_v1_Connection__Output>
        ConnectionMetadata: MessageTypeDefinition<_interchat_control_v1_ConnectionMetadata, _interchat_control_v1_ConnectionMetadata__Output>
        ConnectionSpec: MessageTypeDefinition<_interchat_control_v1_ConnectionSpec, _interchat_control_v1_ConnectionSpec__Output>
        ConnectionStatus: MessageTypeDefinition<_interchat_control_v1_ConnectionStatus, _interchat_control_v1_ConnectionStatus__Output>
        CreateHubAnnouncementRequest: MessageTypeDefinition<_interchat_control_v1_CreateHubAnnouncementRequest, _interchat_control_v1_CreateHubAnnouncementRequest__Output>
        CreateHubInviteRequest: MessageTypeDefinition<_interchat_control_v1_CreateHubInviteRequest, _interchat_control_v1_CreateHubInviteRequest__Output>
        CreateHubRequest: MessageTypeDefinition<_interchat_control_v1_CreateHubRequest, _interchat_control_v1_CreateHubRequest__Output>
        CreateHubRuleRequest: MessageTypeDefinition<_interchat_control_v1_CreateHubRuleRequest, _interchat_control_v1_CreateHubRuleRequest__Output>
        DeleteHubAnnouncementRequest: MessageTypeDefinition<_interchat_control_v1_DeleteHubAnnouncementRequest, _interchat_control_v1_DeleteHubAnnouncementRequest__Output>
        DeleteHubRequest: MessageTypeDefinition<_interchat_control_v1_DeleteHubRequest, _interchat_control_v1_DeleteHubRequest__Output>
        DeleteHubRuleRequest: MessageTypeDefinition<_interchat_control_v1_DeleteHubRuleRequest, _interchat_control_v1_DeleteHubRuleRequest__Output>
        EmptyResponse: MessageTypeDefinition<_interchat_control_v1_EmptyResponse, _interchat_control_v1_EmptyResponse__Output>
        GetHubRequest: MessageTypeDefinition<_interchat_control_v1_GetHubRequest, _interchat_control_v1_GetHubRequest__Output>
        Hub: MessageTypeDefinition<_interchat_control_v1_Hub, _interchat_control_v1_Hub__Output>
        HubActivityLevel: EnumTypeDefinition
        HubAnnouncement: MessageTypeDefinition<_interchat_control_v1_HubAnnouncement, _interchat_control_v1_HubAnnouncement__Output>
        HubAnnouncementsResponse: MessageTypeDefinition<_interchat_control_v1_HubAnnouncementsResponse, _interchat_control_v1_HubAnnouncementsResponse__Output>
        HubBadgeConfig: MessageTypeDefinition<_interchat_control_v1_HubBadgeConfig, _interchat_control_v1_HubBadgeConfig__Output>
        HubInvite: MessageTypeDefinition<_interchat_control_v1_HubInvite, _interchat_control_v1_HubInvite__Output>
        HubInvitesResponse: MessageTypeDefinition<_interchat_control_v1_HubInvitesResponse, _interchat_control_v1_HubInvitesResponse__Output>
        HubLogConfig: MessageTypeDefinition<_interchat_control_v1_HubLogConfig, _interchat_control_v1_HubLogConfig__Output>
        HubMetadata: MessageTypeDefinition<_interchat_control_v1_HubMetadata, _interchat_control_v1_HubMetadata__Output>
        HubRule: MessageTypeDefinition<_interchat_control_v1_HubRule, _interchat_control_v1_HubRule__Output>
        HubRulesResponse: MessageTypeDefinition<_interchat_control_v1_HubRulesResponse, _interchat_control_v1_HubRulesResponse__Output>
        HubService: SubtypeConstructor<typeof grpc.Client, _interchat_control_v1_HubServiceClient> & { service: _interchat_control_v1_HubServiceDefinition }
        HubSpec: MessageTypeDefinition<_interchat_control_v1_HubSpec, _interchat_control_v1_HubSpec__Output>
        HubStaffMember: MessageTypeDefinition<_interchat_control_v1_HubStaffMember, _interchat_control_v1_HubStaffMember__Output>
        HubStaffMemberMetadata: MessageTypeDefinition<_interchat_control_v1_HubStaffMemberMetadata, _interchat_control_v1_HubStaffMemberMetadata__Output>
        HubStaffMemberSpec: MessageTypeDefinition<_interchat_control_v1_HubStaffMemberSpec, _interchat_control_v1_HubStaffMemberSpec__Output>
        HubStaffMemberStatus: MessageTypeDefinition<_interchat_control_v1_HubStaffMemberStatus, _interchat_control_v1_HubStaffMemberStatus__Output>
        HubStaffResponse: MessageTypeDefinition<_interchat_control_v1_HubStaffResponse, _interchat_control_v1_HubStaffResponse__Output>
        HubStatus: MessageTypeDefinition<_interchat_control_v1_HubStatus, _interchat_control_v1_HubStatus__Output>
        HubVisibility: EnumTypeDefinition
        Infraction: MessageTypeDefinition<_interchat_control_v1_Infraction, _interchat_control_v1_Infraction__Output>
        InfractionStatus: EnumTypeDefinition
        ListHubAnnouncementsRequest: MessageTypeDefinition<_interchat_control_v1_ListHubAnnouncementsRequest, _interchat_control_v1_ListHubAnnouncementsRequest__Output>
        ListHubInvitesRequest: MessageTypeDefinition<_interchat_control_v1_ListHubInvitesRequest, _interchat_control_v1_ListHubInvitesRequest__Output>
        ListHubStaffRequest: MessageTypeDefinition<_interchat_control_v1_ListHubStaffRequest, _interchat_control_v1_ListHubStaffRequest__Output>
        LockdownHubRequest: MessageTypeDefinition<_interchat_control_v1_LockdownHubRequest, _interchat_control_v1_LockdownHubRequest__Output>
        PatchHubBadgesRequest: MessageTypeDefinition<_interchat_control_v1_PatchHubBadgesRequest, _interchat_control_v1_PatchHubBadgesRequest__Output>
        PatchHubLogConfigRequest: MessageTypeDefinition<_interchat_control_v1_PatchHubLogConfigRequest, _interchat_control_v1_PatchHubLogConfigRequest__Output>
        PatchHubRequest: MessageTypeDefinition<_interchat_control_v1_PatchHubRequest, _interchat_control_v1_PatchHubRequest__Output>
        RemoveHubStaffRoleRequest: MessageTypeDefinition<_interchat_control_v1_RemoveHubStaffRoleRequest, _interchat_control_v1_RemoveHubStaffRoleRequest__Output>
        ReorderHubRulesRequest: MessageTypeDefinition<_interchat_control_v1_ReorderHubRulesRequest, _interchat_control_v1_ReorderHubRulesRequest__Output>
        RequestContext: MessageTypeDefinition<_interchat_control_v1_RequestContext, _interchat_control_v1_RequestContext__Output>
        RevokeHubInviteRequest: MessageTypeDefinition<_interchat_control_v1_RevokeHubInviteRequest, _interchat_control_v1_RevokeHubInviteRequest__Output>
        SanctionType: EnumTypeDefinition
        Server: MessageTypeDefinition<_interchat_control_v1_Server, _interchat_control_v1_Server__Output>
        ServerBlock: MessageTypeDefinition<_interchat_control_v1_ServerBlock, _interchat_control_v1_ServerBlock__Output>
        ServerMetadata: MessageTypeDefinition<_interchat_control_v1_ServerMetadata, _interchat_control_v1_ServerMetadata__Output>
        ServerSpec: MessageTypeDefinition<_interchat_control_v1_ServerSpec, _interchat_control_v1_ServerSpec__Output>
        ServerStatus: MessageTypeDefinition<_interchat_control_v1_ServerStatus, _interchat_control_v1_ServerStatus__Output>
        TransferHubOwnershipRequest: MessageTypeDefinition<_interchat_control_v1_TransferHubOwnershipRequest, _interchat_control_v1_TransferHubOwnershipRequest__Output>
        UpdateHubAnnouncementRequest: MessageTypeDefinition<_interchat_control_v1_UpdateHubAnnouncementRequest, _interchat_control_v1_UpdateHubAnnouncementRequest__Output>
        UpdateHubRuleRequest: MessageTypeDefinition<_interchat_control_v1_UpdateHubRuleRequest, _interchat_control_v1_UpdateHubRuleRequest__Output>
        UserInboxItem: MessageTypeDefinition<_interchat_control_v1_UserInboxItem, _interchat_control_v1_UserInboxItem__Output>
        UserPreferences: MessageTypeDefinition<_interchat_control_v1_UserPreferences, _interchat_control_v1_UserPreferences__Output>
        UserProfile: MessageTypeDefinition<_interchat_control_v1_UserProfile, _interchat_control_v1_UserProfile__Output>
      }
    }
  }
}

