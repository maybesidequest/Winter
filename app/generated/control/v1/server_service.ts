import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { FieldMask as _google_protobuf_FieldMask, FieldMask__Output as _google_protobuf_FieldMask__Output } from './google/protobuf/FieldMask';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from './google/protobuf/Timestamp';
import type { AddBlockRequest as _interchat_control_v1_AddBlockRequest, AddBlockRequest__Output as _interchat_control_v1_AddBlockRequest__Output } from './interchat/control/v1/AddBlockRequest';
import type { Appeal as _interchat_control_v1_Appeal, Appeal__Output as _interchat_control_v1_Appeal__Output } from './interchat/control/v1/Appeal';
import type { BlocklistResponse as _interchat_control_v1_BlocklistResponse, BlocklistResponse__Output as _interchat_control_v1_BlocklistResponse__Output } from './interchat/control/v1/BlocklistResponse';
import type { Connection as _interchat_control_v1_Connection, Connection__Output as _interchat_control_v1_Connection__Output } from './interchat/control/v1/Connection';
import type { ConnectionMetadata as _interchat_control_v1_ConnectionMetadata, ConnectionMetadata__Output as _interchat_control_v1_ConnectionMetadata__Output } from './interchat/control/v1/ConnectionMetadata';
import type { ConnectionSpec as _interchat_control_v1_ConnectionSpec, ConnectionSpec__Output as _interchat_control_v1_ConnectionSpec__Output } from './interchat/control/v1/ConnectionSpec';
import type { ConnectionStatus as _interchat_control_v1_ConnectionStatus, ConnectionStatus__Output as _interchat_control_v1_ConnectionStatus__Output } from './interchat/control/v1/ConnectionStatus';
import type { EmptyResponse as _interchat_control_v1_EmptyResponse, EmptyResponse__Output as _interchat_control_v1_EmptyResponse__Output } from './interchat/control/v1/EmptyResponse';
import type { GetBlocklistRequest as _interchat_control_v1_GetBlocklistRequest, GetBlocklistRequest__Output as _interchat_control_v1_GetBlocklistRequest__Output } from './interchat/control/v1/GetBlocklistRequest';
import type { GetServerRequest as _interchat_control_v1_GetServerRequest, GetServerRequest__Output as _interchat_control_v1_GetServerRequest__Output } from './interchat/control/v1/GetServerRequest';
import type { Hub as _interchat_control_v1_Hub, Hub__Output as _interchat_control_v1_Hub__Output } from './interchat/control/v1/Hub';
import type { HubAnnouncement as _interchat_control_v1_HubAnnouncement, HubAnnouncement__Output as _interchat_control_v1_HubAnnouncement__Output } from './interchat/control/v1/HubAnnouncement';
import type { HubBadgeConfig as _interchat_control_v1_HubBadgeConfig, HubBadgeConfig__Output as _interchat_control_v1_HubBadgeConfig__Output } from './interchat/control/v1/HubBadgeConfig';
import type { HubInvite as _interchat_control_v1_HubInvite, HubInvite__Output as _interchat_control_v1_HubInvite__Output } from './interchat/control/v1/HubInvite';
import type { HubLogConfig as _interchat_control_v1_HubLogConfig, HubLogConfig__Output as _interchat_control_v1_HubLogConfig__Output } from './interchat/control/v1/HubLogConfig';
import type { HubMetadata as _interchat_control_v1_HubMetadata, HubMetadata__Output as _interchat_control_v1_HubMetadata__Output } from './interchat/control/v1/HubMetadata';
import type { HubRule as _interchat_control_v1_HubRule, HubRule__Output as _interchat_control_v1_HubRule__Output } from './interchat/control/v1/HubRule';
import type { HubSpec as _interchat_control_v1_HubSpec, HubSpec__Output as _interchat_control_v1_HubSpec__Output } from './interchat/control/v1/HubSpec';
import type { HubStaffMember as _interchat_control_v1_HubStaffMember, HubStaffMember__Output as _interchat_control_v1_HubStaffMember__Output } from './interchat/control/v1/HubStaffMember';
import type { HubStaffMemberMetadata as _interchat_control_v1_HubStaffMemberMetadata, HubStaffMemberMetadata__Output as _interchat_control_v1_HubStaffMemberMetadata__Output } from './interchat/control/v1/HubStaffMemberMetadata';
import type { HubStaffMemberSpec as _interchat_control_v1_HubStaffMemberSpec, HubStaffMemberSpec__Output as _interchat_control_v1_HubStaffMemberSpec__Output } from './interchat/control/v1/HubStaffMemberSpec';
import type { HubStaffMemberStatus as _interchat_control_v1_HubStaffMemberStatus, HubStaffMemberStatus__Output as _interchat_control_v1_HubStaffMemberStatus__Output } from './interchat/control/v1/HubStaffMemberStatus';
import type { HubStatus as _interchat_control_v1_HubStatus, HubStatus__Output as _interchat_control_v1_HubStatus__Output } from './interchat/control/v1/HubStatus';
import type { Infraction as _interchat_control_v1_Infraction, Infraction__Output as _interchat_control_v1_Infraction__Output } from './interchat/control/v1/Infraction';
import type { PatchServerConfigRequest as _interchat_control_v1_PatchServerConfigRequest, PatchServerConfigRequest__Output as _interchat_control_v1_PatchServerConfigRequest__Output } from './interchat/control/v1/PatchServerConfigRequest';
import type { RemoveBlockRequest as _interchat_control_v1_RemoveBlockRequest, RemoveBlockRequest__Output as _interchat_control_v1_RemoveBlockRequest__Output } from './interchat/control/v1/RemoveBlockRequest';
import type { RequestContext as _interchat_control_v1_RequestContext, RequestContext__Output as _interchat_control_v1_RequestContext__Output } from './interchat/control/v1/RequestContext';
import type { Server as _interchat_control_v1_Server, Server__Output as _interchat_control_v1_Server__Output } from './interchat/control/v1/Server';
import type { ServerBlock as _interchat_control_v1_ServerBlock, ServerBlock__Output as _interchat_control_v1_ServerBlock__Output } from './interchat/control/v1/ServerBlock';
import type { ServerMetadata as _interchat_control_v1_ServerMetadata, ServerMetadata__Output as _interchat_control_v1_ServerMetadata__Output } from './interchat/control/v1/ServerMetadata';
import type { ServerServiceClient as _interchat_control_v1_ServerServiceClient, ServerServiceDefinition as _interchat_control_v1_ServerServiceDefinition } from './interchat/control/v1/ServerService';
import type { ServerSpec as _interchat_control_v1_ServerSpec, ServerSpec__Output as _interchat_control_v1_ServerSpec__Output } from './interchat/control/v1/ServerSpec';
import type { ServerStatus as _interchat_control_v1_ServerStatus, ServerStatus__Output as _interchat_control_v1_ServerStatus__Output } from './interchat/control/v1/ServerStatus';
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
        AddBlockRequest: MessageTypeDefinition<_interchat_control_v1_AddBlockRequest, _interchat_control_v1_AddBlockRequest__Output>
        Appeal: MessageTypeDefinition<_interchat_control_v1_Appeal, _interchat_control_v1_Appeal__Output>
        BlockTargetType: EnumTypeDefinition
        BlocklistResponse: MessageTypeDefinition<_interchat_control_v1_BlocklistResponse, _interchat_control_v1_BlocklistResponse__Output>
        Connection: MessageTypeDefinition<_interchat_control_v1_Connection, _interchat_control_v1_Connection__Output>
        ConnectionMetadata: MessageTypeDefinition<_interchat_control_v1_ConnectionMetadata, _interchat_control_v1_ConnectionMetadata__Output>
        ConnectionSpec: MessageTypeDefinition<_interchat_control_v1_ConnectionSpec, _interchat_control_v1_ConnectionSpec__Output>
        ConnectionStatus: MessageTypeDefinition<_interchat_control_v1_ConnectionStatus, _interchat_control_v1_ConnectionStatus__Output>
        EmptyResponse: MessageTypeDefinition<_interchat_control_v1_EmptyResponse, _interchat_control_v1_EmptyResponse__Output>
        GetBlocklistRequest: MessageTypeDefinition<_interchat_control_v1_GetBlocklistRequest, _interchat_control_v1_GetBlocklistRequest__Output>
        GetServerRequest: MessageTypeDefinition<_interchat_control_v1_GetServerRequest, _interchat_control_v1_GetServerRequest__Output>
        Hub: MessageTypeDefinition<_interchat_control_v1_Hub, _interchat_control_v1_Hub__Output>
        HubActivityLevel: EnumTypeDefinition
        HubAnnouncement: MessageTypeDefinition<_interchat_control_v1_HubAnnouncement, _interchat_control_v1_HubAnnouncement__Output>
        HubBadgeConfig: MessageTypeDefinition<_interchat_control_v1_HubBadgeConfig, _interchat_control_v1_HubBadgeConfig__Output>
        HubInvite: MessageTypeDefinition<_interchat_control_v1_HubInvite, _interchat_control_v1_HubInvite__Output>
        HubLogConfig: MessageTypeDefinition<_interchat_control_v1_HubLogConfig, _interchat_control_v1_HubLogConfig__Output>
        HubMetadata: MessageTypeDefinition<_interchat_control_v1_HubMetadata, _interchat_control_v1_HubMetadata__Output>
        HubRule: MessageTypeDefinition<_interchat_control_v1_HubRule, _interchat_control_v1_HubRule__Output>
        HubSpec: MessageTypeDefinition<_interchat_control_v1_HubSpec, _interchat_control_v1_HubSpec__Output>
        HubStaffMember: MessageTypeDefinition<_interchat_control_v1_HubStaffMember, _interchat_control_v1_HubStaffMember__Output>
        HubStaffMemberMetadata: MessageTypeDefinition<_interchat_control_v1_HubStaffMemberMetadata, _interchat_control_v1_HubStaffMemberMetadata__Output>
        HubStaffMemberSpec: MessageTypeDefinition<_interchat_control_v1_HubStaffMemberSpec, _interchat_control_v1_HubStaffMemberSpec__Output>
        HubStaffMemberStatus: MessageTypeDefinition<_interchat_control_v1_HubStaffMemberStatus, _interchat_control_v1_HubStaffMemberStatus__Output>
        HubStatus: MessageTypeDefinition<_interchat_control_v1_HubStatus, _interchat_control_v1_HubStatus__Output>
        HubVisibility: EnumTypeDefinition
        Infraction: MessageTypeDefinition<_interchat_control_v1_Infraction, _interchat_control_v1_Infraction__Output>
        InfractionStatus: EnumTypeDefinition
        PatchServerConfigRequest: MessageTypeDefinition<_interchat_control_v1_PatchServerConfigRequest, _interchat_control_v1_PatchServerConfigRequest__Output>
        RemoveBlockRequest: MessageTypeDefinition<_interchat_control_v1_RemoveBlockRequest, _interchat_control_v1_RemoveBlockRequest__Output>
        RequestContext: MessageTypeDefinition<_interchat_control_v1_RequestContext, _interchat_control_v1_RequestContext__Output>
        SanctionType: EnumTypeDefinition
        Server: MessageTypeDefinition<_interchat_control_v1_Server, _interchat_control_v1_Server__Output>
        ServerBlock: MessageTypeDefinition<_interchat_control_v1_ServerBlock, _interchat_control_v1_ServerBlock__Output>
        ServerMetadata: MessageTypeDefinition<_interchat_control_v1_ServerMetadata, _interchat_control_v1_ServerMetadata__Output>
        ServerService: SubtypeConstructor<typeof grpc.Client, _interchat_control_v1_ServerServiceClient> & { service: _interchat_control_v1_ServerServiceDefinition }
        ServerSpec: MessageTypeDefinition<_interchat_control_v1_ServerSpec, _interchat_control_v1_ServerSpec__Output>
        ServerStatus: MessageTypeDefinition<_interchat_control_v1_ServerStatus, _interchat_control_v1_ServerStatus__Output>
        UserInboxItem: MessageTypeDefinition<_interchat_control_v1_UserInboxItem, _interchat_control_v1_UserInboxItem__Output>
        UserPreferences: MessageTypeDefinition<_interchat_control_v1_UserPreferences, _interchat_control_v1_UserPreferences__Output>
        UserProfile: MessageTypeDefinition<_interchat_control_v1_UserProfile, _interchat_control_v1_UserProfile__Output>
      }
    }
  }
}

