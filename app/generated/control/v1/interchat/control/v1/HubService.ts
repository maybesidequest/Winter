// Original file: ../interchat-protobuf/control/v1/hub_service.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { AssignHubStaffRoleRequest as _interchat_control_v1_AssignHubStaffRoleRequest, AssignHubStaffRoleRequest__Output as _interchat_control_v1_AssignHubStaffRoleRequest__Output } from '../../../interchat/control/v1/AssignHubStaffRoleRequest';
import type { CreateHubAnnouncementRequest as _interchat_control_v1_CreateHubAnnouncementRequest, CreateHubAnnouncementRequest__Output as _interchat_control_v1_CreateHubAnnouncementRequest__Output } from '../../../interchat/control/v1/CreateHubAnnouncementRequest';
import type { CreateHubInviteRequest as _interchat_control_v1_CreateHubInviteRequest, CreateHubInviteRequest__Output as _interchat_control_v1_CreateHubInviteRequest__Output } from '../../../interchat/control/v1/CreateHubInviteRequest';
import type { CreateHubRequest as _interchat_control_v1_CreateHubRequest, CreateHubRequest__Output as _interchat_control_v1_CreateHubRequest__Output } from '../../../interchat/control/v1/CreateHubRequest';
import type { CreateHubRuleRequest as _interchat_control_v1_CreateHubRuleRequest, CreateHubRuleRequest__Output as _interchat_control_v1_CreateHubRuleRequest__Output } from '../../../interchat/control/v1/CreateHubRuleRequest';
import type { DeleteHubAnnouncementRequest as _interchat_control_v1_DeleteHubAnnouncementRequest, DeleteHubAnnouncementRequest__Output as _interchat_control_v1_DeleteHubAnnouncementRequest__Output } from '../../../interchat/control/v1/DeleteHubAnnouncementRequest';
import type { DeleteHubRequest as _interchat_control_v1_DeleteHubRequest, DeleteHubRequest__Output as _interchat_control_v1_DeleteHubRequest__Output } from '../../../interchat/control/v1/DeleteHubRequest';
import type { DeleteHubRuleRequest as _interchat_control_v1_DeleteHubRuleRequest, DeleteHubRuleRequest__Output as _interchat_control_v1_DeleteHubRuleRequest__Output } from '../../../interchat/control/v1/DeleteHubRuleRequest';
import type { EmptyResponse as _interchat_control_v1_EmptyResponse, EmptyResponse__Output as _interchat_control_v1_EmptyResponse__Output } from '../../../interchat/control/v1/EmptyResponse';
import type { GetHubRequest as _interchat_control_v1_GetHubRequest, GetHubRequest__Output as _interchat_control_v1_GetHubRequest__Output } from '../../../interchat/control/v1/GetHubRequest';
import type { Hub as _interchat_control_v1_Hub, Hub__Output as _interchat_control_v1_Hub__Output } from '../../../interchat/control/v1/Hub';
import type { HubAnnouncement as _interchat_control_v1_HubAnnouncement, HubAnnouncement__Output as _interchat_control_v1_HubAnnouncement__Output } from '../../../interchat/control/v1/HubAnnouncement';
import type { HubAnnouncementsResponse as _interchat_control_v1_HubAnnouncementsResponse, HubAnnouncementsResponse__Output as _interchat_control_v1_HubAnnouncementsResponse__Output } from '../../../interchat/control/v1/HubAnnouncementsResponse';
import type { HubBadgeConfig as _interchat_control_v1_HubBadgeConfig, HubBadgeConfig__Output as _interchat_control_v1_HubBadgeConfig__Output } from '../../../interchat/control/v1/HubBadgeConfig';
import type { HubInvite as _interchat_control_v1_HubInvite, HubInvite__Output as _interchat_control_v1_HubInvite__Output } from '../../../interchat/control/v1/HubInvite';
import type { HubInvitesResponse as _interchat_control_v1_HubInvitesResponse, HubInvitesResponse__Output as _interchat_control_v1_HubInvitesResponse__Output } from '../../../interchat/control/v1/HubInvitesResponse';
import type { HubLogConfig as _interchat_control_v1_HubLogConfig, HubLogConfig__Output as _interchat_control_v1_HubLogConfig__Output } from '../../../interchat/control/v1/HubLogConfig';
import type { HubRule as _interchat_control_v1_HubRule, HubRule__Output as _interchat_control_v1_HubRule__Output } from '../../../interchat/control/v1/HubRule';
import type { HubRulesResponse as _interchat_control_v1_HubRulesResponse, HubRulesResponse__Output as _interchat_control_v1_HubRulesResponse__Output } from '../../../interchat/control/v1/HubRulesResponse';
import type { HubStaffMember as _interchat_control_v1_HubStaffMember, HubStaffMember__Output as _interchat_control_v1_HubStaffMember__Output } from '../../../interchat/control/v1/HubStaffMember';
import type { HubStaffResponse as _interchat_control_v1_HubStaffResponse, HubStaffResponse__Output as _interchat_control_v1_HubStaffResponse__Output } from '../../../interchat/control/v1/HubStaffResponse';
import type { ListHubAnnouncementsRequest as _interchat_control_v1_ListHubAnnouncementsRequest, ListHubAnnouncementsRequest__Output as _interchat_control_v1_ListHubAnnouncementsRequest__Output } from '../../../interchat/control/v1/ListHubAnnouncementsRequest';
import type { ListHubInvitesRequest as _interchat_control_v1_ListHubInvitesRequest, ListHubInvitesRequest__Output as _interchat_control_v1_ListHubInvitesRequest__Output } from '../../../interchat/control/v1/ListHubInvitesRequest';
import type { ListHubStaffRequest as _interchat_control_v1_ListHubStaffRequest, ListHubStaffRequest__Output as _interchat_control_v1_ListHubStaffRequest__Output } from '../../../interchat/control/v1/ListHubStaffRequest';
import type { LockdownHubRequest as _interchat_control_v1_LockdownHubRequest, LockdownHubRequest__Output as _interchat_control_v1_LockdownHubRequest__Output } from '../../../interchat/control/v1/LockdownHubRequest';
import type { PatchHubBadgesRequest as _interchat_control_v1_PatchHubBadgesRequest, PatchHubBadgesRequest__Output as _interchat_control_v1_PatchHubBadgesRequest__Output } from '../../../interchat/control/v1/PatchHubBadgesRequest';
import type { PatchHubLogConfigRequest as _interchat_control_v1_PatchHubLogConfigRequest, PatchHubLogConfigRequest__Output as _interchat_control_v1_PatchHubLogConfigRequest__Output } from '../../../interchat/control/v1/PatchHubLogConfigRequest';
import type { PatchHubRequest as _interchat_control_v1_PatchHubRequest, PatchHubRequest__Output as _interchat_control_v1_PatchHubRequest__Output } from '../../../interchat/control/v1/PatchHubRequest';
import type { RemoveHubStaffRoleRequest as _interchat_control_v1_RemoveHubStaffRoleRequest, RemoveHubStaffRoleRequest__Output as _interchat_control_v1_RemoveHubStaffRoleRequest__Output } from '../../../interchat/control/v1/RemoveHubStaffRoleRequest';
import type { ReorderHubRulesRequest as _interchat_control_v1_ReorderHubRulesRequest, ReorderHubRulesRequest__Output as _interchat_control_v1_ReorderHubRulesRequest__Output } from '../../../interchat/control/v1/ReorderHubRulesRequest';
import type { RevokeHubInviteRequest as _interchat_control_v1_RevokeHubInviteRequest, RevokeHubInviteRequest__Output as _interchat_control_v1_RevokeHubInviteRequest__Output } from '../../../interchat/control/v1/RevokeHubInviteRequest';
import type { TransferHubOwnershipRequest as _interchat_control_v1_TransferHubOwnershipRequest, TransferHubOwnershipRequest__Output as _interchat_control_v1_TransferHubOwnershipRequest__Output } from '../../../interchat/control/v1/TransferHubOwnershipRequest';
import type { UpdateHubAnnouncementRequest as _interchat_control_v1_UpdateHubAnnouncementRequest, UpdateHubAnnouncementRequest__Output as _interchat_control_v1_UpdateHubAnnouncementRequest__Output } from '../../../interchat/control/v1/UpdateHubAnnouncementRequest';
import type { UpdateHubRuleRequest as _interchat_control_v1_UpdateHubRuleRequest, UpdateHubRuleRequest__Output as _interchat_control_v1_UpdateHubRuleRequest__Output } from '../../../interchat/control/v1/UpdateHubRuleRequest';

export interface HubServiceClient extends grpc.Client {
  AssignStaffRole(argument: _interchat_control_v1_AssignHubStaffRoleRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubStaffMember__Output>): grpc.ClientUnaryCall;
  AssignStaffRole(argument: _interchat_control_v1_AssignHubStaffRoleRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_HubStaffMember__Output>): grpc.ClientUnaryCall;
  AssignStaffRole(argument: _interchat_control_v1_AssignHubStaffRoleRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubStaffMember__Output>): grpc.ClientUnaryCall;
  AssignStaffRole(argument: _interchat_control_v1_AssignHubStaffRoleRequest, callback: grpc.requestCallback<_interchat_control_v1_HubStaffMember__Output>): grpc.ClientUnaryCall;
  assignStaffRole(argument: _interchat_control_v1_AssignHubStaffRoleRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubStaffMember__Output>): grpc.ClientUnaryCall;
  assignStaffRole(argument: _interchat_control_v1_AssignHubStaffRoleRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_HubStaffMember__Output>): grpc.ClientUnaryCall;
  assignStaffRole(argument: _interchat_control_v1_AssignHubStaffRoleRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubStaffMember__Output>): grpc.ClientUnaryCall;
  assignStaffRole(argument: _interchat_control_v1_AssignHubStaffRoleRequest, callback: grpc.requestCallback<_interchat_control_v1_HubStaffMember__Output>): grpc.ClientUnaryCall;
  
  CreateAnnouncement(argument: _interchat_control_v1_CreateHubAnnouncementRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubAnnouncement__Output>): grpc.ClientUnaryCall;
  CreateAnnouncement(argument: _interchat_control_v1_CreateHubAnnouncementRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_HubAnnouncement__Output>): grpc.ClientUnaryCall;
  CreateAnnouncement(argument: _interchat_control_v1_CreateHubAnnouncementRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubAnnouncement__Output>): grpc.ClientUnaryCall;
  CreateAnnouncement(argument: _interchat_control_v1_CreateHubAnnouncementRequest, callback: grpc.requestCallback<_interchat_control_v1_HubAnnouncement__Output>): grpc.ClientUnaryCall;
  createAnnouncement(argument: _interchat_control_v1_CreateHubAnnouncementRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubAnnouncement__Output>): grpc.ClientUnaryCall;
  createAnnouncement(argument: _interchat_control_v1_CreateHubAnnouncementRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_HubAnnouncement__Output>): grpc.ClientUnaryCall;
  createAnnouncement(argument: _interchat_control_v1_CreateHubAnnouncementRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubAnnouncement__Output>): grpc.ClientUnaryCall;
  createAnnouncement(argument: _interchat_control_v1_CreateHubAnnouncementRequest, callback: grpc.requestCallback<_interchat_control_v1_HubAnnouncement__Output>): grpc.ClientUnaryCall;
  
  CreateHub(argument: _interchat_control_v1_CreateHubRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Hub__Output>): grpc.ClientUnaryCall;
  CreateHub(argument: _interchat_control_v1_CreateHubRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_Hub__Output>): grpc.ClientUnaryCall;
  CreateHub(argument: _interchat_control_v1_CreateHubRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Hub__Output>): grpc.ClientUnaryCall;
  CreateHub(argument: _interchat_control_v1_CreateHubRequest, callback: grpc.requestCallback<_interchat_control_v1_Hub__Output>): grpc.ClientUnaryCall;
  createHub(argument: _interchat_control_v1_CreateHubRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Hub__Output>): grpc.ClientUnaryCall;
  createHub(argument: _interchat_control_v1_CreateHubRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_Hub__Output>): grpc.ClientUnaryCall;
  createHub(argument: _interchat_control_v1_CreateHubRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Hub__Output>): grpc.ClientUnaryCall;
  createHub(argument: _interchat_control_v1_CreateHubRequest, callback: grpc.requestCallback<_interchat_control_v1_Hub__Output>): grpc.ClientUnaryCall;
  
  CreateInvite(argument: _interchat_control_v1_CreateHubInviteRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubInvite__Output>): grpc.ClientUnaryCall;
  CreateInvite(argument: _interchat_control_v1_CreateHubInviteRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_HubInvite__Output>): grpc.ClientUnaryCall;
  CreateInvite(argument: _interchat_control_v1_CreateHubInviteRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubInvite__Output>): grpc.ClientUnaryCall;
  CreateInvite(argument: _interchat_control_v1_CreateHubInviteRequest, callback: grpc.requestCallback<_interchat_control_v1_HubInvite__Output>): grpc.ClientUnaryCall;
  createInvite(argument: _interchat_control_v1_CreateHubInviteRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubInvite__Output>): grpc.ClientUnaryCall;
  createInvite(argument: _interchat_control_v1_CreateHubInviteRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_HubInvite__Output>): grpc.ClientUnaryCall;
  createInvite(argument: _interchat_control_v1_CreateHubInviteRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubInvite__Output>): grpc.ClientUnaryCall;
  createInvite(argument: _interchat_control_v1_CreateHubInviteRequest, callback: grpc.requestCallback<_interchat_control_v1_HubInvite__Output>): grpc.ClientUnaryCall;
  
  CreateRule(argument: _interchat_control_v1_CreateHubRuleRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubRule__Output>): grpc.ClientUnaryCall;
  CreateRule(argument: _interchat_control_v1_CreateHubRuleRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_HubRule__Output>): grpc.ClientUnaryCall;
  CreateRule(argument: _interchat_control_v1_CreateHubRuleRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubRule__Output>): grpc.ClientUnaryCall;
  CreateRule(argument: _interchat_control_v1_CreateHubRuleRequest, callback: grpc.requestCallback<_interchat_control_v1_HubRule__Output>): grpc.ClientUnaryCall;
  createRule(argument: _interchat_control_v1_CreateHubRuleRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubRule__Output>): grpc.ClientUnaryCall;
  createRule(argument: _interchat_control_v1_CreateHubRuleRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_HubRule__Output>): grpc.ClientUnaryCall;
  createRule(argument: _interchat_control_v1_CreateHubRuleRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubRule__Output>): grpc.ClientUnaryCall;
  createRule(argument: _interchat_control_v1_CreateHubRuleRequest, callback: grpc.requestCallback<_interchat_control_v1_HubRule__Output>): grpc.ClientUnaryCall;
  
  DeleteAnnouncement(argument: _interchat_control_v1_DeleteHubAnnouncementRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  DeleteAnnouncement(argument: _interchat_control_v1_DeleteHubAnnouncementRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  DeleteAnnouncement(argument: _interchat_control_v1_DeleteHubAnnouncementRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  DeleteAnnouncement(argument: _interchat_control_v1_DeleteHubAnnouncementRequest, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  deleteAnnouncement(argument: _interchat_control_v1_DeleteHubAnnouncementRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  deleteAnnouncement(argument: _interchat_control_v1_DeleteHubAnnouncementRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  deleteAnnouncement(argument: _interchat_control_v1_DeleteHubAnnouncementRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  deleteAnnouncement(argument: _interchat_control_v1_DeleteHubAnnouncementRequest, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  
  DeleteHub(argument: _interchat_control_v1_DeleteHubRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  DeleteHub(argument: _interchat_control_v1_DeleteHubRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  DeleteHub(argument: _interchat_control_v1_DeleteHubRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  DeleteHub(argument: _interchat_control_v1_DeleteHubRequest, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  deleteHub(argument: _interchat_control_v1_DeleteHubRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  deleteHub(argument: _interchat_control_v1_DeleteHubRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  deleteHub(argument: _interchat_control_v1_DeleteHubRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  deleteHub(argument: _interchat_control_v1_DeleteHubRequest, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  
  DeleteRule(argument: _interchat_control_v1_DeleteHubRuleRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  DeleteRule(argument: _interchat_control_v1_DeleteHubRuleRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  DeleteRule(argument: _interchat_control_v1_DeleteHubRuleRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  DeleteRule(argument: _interchat_control_v1_DeleteHubRuleRequest, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  deleteRule(argument: _interchat_control_v1_DeleteHubRuleRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  deleteRule(argument: _interchat_control_v1_DeleteHubRuleRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  deleteRule(argument: _interchat_control_v1_DeleteHubRuleRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  deleteRule(argument: _interchat_control_v1_DeleteHubRuleRequest, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  
  GetHub(argument: _interchat_control_v1_GetHubRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Hub__Output>): grpc.ClientUnaryCall;
  GetHub(argument: _interchat_control_v1_GetHubRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_Hub__Output>): grpc.ClientUnaryCall;
  GetHub(argument: _interchat_control_v1_GetHubRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Hub__Output>): grpc.ClientUnaryCall;
  GetHub(argument: _interchat_control_v1_GetHubRequest, callback: grpc.requestCallback<_interchat_control_v1_Hub__Output>): grpc.ClientUnaryCall;
  getHub(argument: _interchat_control_v1_GetHubRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Hub__Output>): grpc.ClientUnaryCall;
  getHub(argument: _interchat_control_v1_GetHubRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_Hub__Output>): grpc.ClientUnaryCall;
  getHub(argument: _interchat_control_v1_GetHubRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Hub__Output>): grpc.ClientUnaryCall;
  getHub(argument: _interchat_control_v1_GetHubRequest, callback: grpc.requestCallback<_interchat_control_v1_Hub__Output>): grpc.ClientUnaryCall;
  
  ListAnnouncements(argument: _interchat_control_v1_ListHubAnnouncementsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubAnnouncementsResponse__Output>): grpc.ClientUnaryCall;
  ListAnnouncements(argument: _interchat_control_v1_ListHubAnnouncementsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_HubAnnouncementsResponse__Output>): grpc.ClientUnaryCall;
  ListAnnouncements(argument: _interchat_control_v1_ListHubAnnouncementsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubAnnouncementsResponse__Output>): grpc.ClientUnaryCall;
  ListAnnouncements(argument: _interchat_control_v1_ListHubAnnouncementsRequest, callback: grpc.requestCallback<_interchat_control_v1_HubAnnouncementsResponse__Output>): grpc.ClientUnaryCall;
  listAnnouncements(argument: _interchat_control_v1_ListHubAnnouncementsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubAnnouncementsResponse__Output>): grpc.ClientUnaryCall;
  listAnnouncements(argument: _interchat_control_v1_ListHubAnnouncementsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_HubAnnouncementsResponse__Output>): grpc.ClientUnaryCall;
  listAnnouncements(argument: _interchat_control_v1_ListHubAnnouncementsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubAnnouncementsResponse__Output>): grpc.ClientUnaryCall;
  listAnnouncements(argument: _interchat_control_v1_ListHubAnnouncementsRequest, callback: grpc.requestCallback<_interchat_control_v1_HubAnnouncementsResponse__Output>): grpc.ClientUnaryCall;
  
  ListInvites(argument: _interchat_control_v1_ListHubInvitesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubInvitesResponse__Output>): grpc.ClientUnaryCall;
  ListInvites(argument: _interchat_control_v1_ListHubInvitesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_HubInvitesResponse__Output>): grpc.ClientUnaryCall;
  ListInvites(argument: _interchat_control_v1_ListHubInvitesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubInvitesResponse__Output>): grpc.ClientUnaryCall;
  ListInvites(argument: _interchat_control_v1_ListHubInvitesRequest, callback: grpc.requestCallback<_interchat_control_v1_HubInvitesResponse__Output>): grpc.ClientUnaryCall;
  listInvites(argument: _interchat_control_v1_ListHubInvitesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubInvitesResponse__Output>): grpc.ClientUnaryCall;
  listInvites(argument: _interchat_control_v1_ListHubInvitesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_HubInvitesResponse__Output>): grpc.ClientUnaryCall;
  listInvites(argument: _interchat_control_v1_ListHubInvitesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubInvitesResponse__Output>): grpc.ClientUnaryCall;
  listInvites(argument: _interchat_control_v1_ListHubInvitesRequest, callback: grpc.requestCallback<_interchat_control_v1_HubInvitesResponse__Output>): grpc.ClientUnaryCall;
  
  ListRules(argument: _interchat_control_v1_GetHubRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubRulesResponse__Output>): grpc.ClientUnaryCall;
  ListRules(argument: _interchat_control_v1_GetHubRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_HubRulesResponse__Output>): grpc.ClientUnaryCall;
  ListRules(argument: _interchat_control_v1_GetHubRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubRulesResponse__Output>): grpc.ClientUnaryCall;
  ListRules(argument: _interchat_control_v1_GetHubRequest, callback: grpc.requestCallback<_interchat_control_v1_HubRulesResponse__Output>): grpc.ClientUnaryCall;
  listRules(argument: _interchat_control_v1_GetHubRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubRulesResponse__Output>): grpc.ClientUnaryCall;
  listRules(argument: _interchat_control_v1_GetHubRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_HubRulesResponse__Output>): grpc.ClientUnaryCall;
  listRules(argument: _interchat_control_v1_GetHubRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubRulesResponse__Output>): grpc.ClientUnaryCall;
  listRules(argument: _interchat_control_v1_GetHubRequest, callback: grpc.requestCallback<_interchat_control_v1_HubRulesResponse__Output>): grpc.ClientUnaryCall;
  
  ListStaff(argument: _interchat_control_v1_ListHubStaffRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubStaffResponse__Output>): grpc.ClientUnaryCall;
  ListStaff(argument: _interchat_control_v1_ListHubStaffRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_HubStaffResponse__Output>): grpc.ClientUnaryCall;
  ListStaff(argument: _interchat_control_v1_ListHubStaffRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubStaffResponse__Output>): grpc.ClientUnaryCall;
  ListStaff(argument: _interchat_control_v1_ListHubStaffRequest, callback: grpc.requestCallback<_interchat_control_v1_HubStaffResponse__Output>): grpc.ClientUnaryCall;
  listStaff(argument: _interchat_control_v1_ListHubStaffRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubStaffResponse__Output>): grpc.ClientUnaryCall;
  listStaff(argument: _interchat_control_v1_ListHubStaffRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_HubStaffResponse__Output>): grpc.ClientUnaryCall;
  listStaff(argument: _interchat_control_v1_ListHubStaffRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubStaffResponse__Output>): grpc.ClientUnaryCall;
  listStaff(argument: _interchat_control_v1_ListHubStaffRequest, callback: grpc.requestCallback<_interchat_control_v1_HubStaffResponse__Output>): grpc.ClientUnaryCall;
  
  LockdownHub(argument: _interchat_control_v1_LockdownHubRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Hub__Output>): grpc.ClientUnaryCall;
  LockdownHub(argument: _interchat_control_v1_LockdownHubRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_Hub__Output>): grpc.ClientUnaryCall;
  LockdownHub(argument: _interchat_control_v1_LockdownHubRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Hub__Output>): grpc.ClientUnaryCall;
  LockdownHub(argument: _interchat_control_v1_LockdownHubRequest, callback: grpc.requestCallback<_interchat_control_v1_Hub__Output>): grpc.ClientUnaryCall;
  lockdownHub(argument: _interchat_control_v1_LockdownHubRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Hub__Output>): grpc.ClientUnaryCall;
  lockdownHub(argument: _interchat_control_v1_LockdownHubRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_Hub__Output>): grpc.ClientUnaryCall;
  lockdownHub(argument: _interchat_control_v1_LockdownHubRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Hub__Output>): grpc.ClientUnaryCall;
  lockdownHub(argument: _interchat_control_v1_LockdownHubRequest, callback: grpc.requestCallback<_interchat_control_v1_Hub__Output>): grpc.ClientUnaryCall;
  
  PatchBadges(argument: _interchat_control_v1_PatchHubBadgesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubBadgeConfig__Output>): grpc.ClientUnaryCall;
  PatchBadges(argument: _interchat_control_v1_PatchHubBadgesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_HubBadgeConfig__Output>): grpc.ClientUnaryCall;
  PatchBadges(argument: _interchat_control_v1_PatchHubBadgesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubBadgeConfig__Output>): grpc.ClientUnaryCall;
  PatchBadges(argument: _interchat_control_v1_PatchHubBadgesRequest, callback: grpc.requestCallback<_interchat_control_v1_HubBadgeConfig__Output>): grpc.ClientUnaryCall;
  patchBadges(argument: _interchat_control_v1_PatchHubBadgesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubBadgeConfig__Output>): grpc.ClientUnaryCall;
  patchBadges(argument: _interchat_control_v1_PatchHubBadgesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_HubBadgeConfig__Output>): grpc.ClientUnaryCall;
  patchBadges(argument: _interchat_control_v1_PatchHubBadgesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubBadgeConfig__Output>): grpc.ClientUnaryCall;
  patchBadges(argument: _interchat_control_v1_PatchHubBadgesRequest, callback: grpc.requestCallback<_interchat_control_v1_HubBadgeConfig__Output>): grpc.ClientUnaryCall;
  
  PatchHub(argument: _interchat_control_v1_PatchHubRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Hub__Output>): grpc.ClientUnaryCall;
  PatchHub(argument: _interchat_control_v1_PatchHubRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_Hub__Output>): grpc.ClientUnaryCall;
  PatchHub(argument: _interchat_control_v1_PatchHubRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Hub__Output>): grpc.ClientUnaryCall;
  PatchHub(argument: _interchat_control_v1_PatchHubRequest, callback: grpc.requestCallback<_interchat_control_v1_Hub__Output>): grpc.ClientUnaryCall;
  patchHub(argument: _interchat_control_v1_PatchHubRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Hub__Output>): grpc.ClientUnaryCall;
  patchHub(argument: _interchat_control_v1_PatchHubRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_Hub__Output>): grpc.ClientUnaryCall;
  patchHub(argument: _interchat_control_v1_PatchHubRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Hub__Output>): grpc.ClientUnaryCall;
  patchHub(argument: _interchat_control_v1_PatchHubRequest, callback: grpc.requestCallback<_interchat_control_v1_Hub__Output>): grpc.ClientUnaryCall;
  
  PatchLogConfig(argument: _interchat_control_v1_PatchHubLogConfigRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubLogConfig__Output>): grpc.ClientUnaryCall;
  PatchLogConfig(argument: _interchat_control_v1_PatchHubLogConfigRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_HubLogConfig__Output>): grpc.ClientUnaryCall;
  PatchLogConfig(argument: _interchat_control_v1_PatchHubLogConfigRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubLogConfig__Output>): grpc.ClientUnaryCall;
  PatchLogConfig(argument: _interchat_control_v1_PatchHubLogConfigRequest, callback: grpc.requestCallback<_interchat_control_v1_HubLogConfig__Output>): grpc.ClientUnaryCall;
  patchLogConfig(argument: _interchat_control_v1_PatchHubLogConfigRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubLogConfig__Output>): grpc.ClientUnaryCall;
  patchLogConfig(argument: _interchat_control_v1_PatchHubLogConfigRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_HubLogConfig__Output>): grpc.ClientUnaryCall;
  patchLogConfig(argument: _interchat_control_v1_PatchHubLogConfigRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubLogConfig__Output>): grpc.ClientUnaryCall;
  patchLogConfig(argument: _interchat_control_v1_PatchHubLogConfigRequest, callback: grpc.requestCallback<_interchat_control_v1_HubLogConfig__Output>): grpc.ClientUnaryCall;
  
  RemoveStaffRole(argument: _interchat_control_v1_RemoveHubStaffRoleRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  RemoveStaffRole(argument: _interchat_control_v1_RemoveHubStaffRoleRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  RemoveStaffRole(argument: _interchat_control_v1_RemoveHubStaffRoleRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  RemoveStaffRole(argument: _interchat_control_v1_RemoveHubStaffRoleRequest, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  removeStaffRole(argument: _interchat_control_v1_RemoveHubStaffRoleRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  removeStaffRole(argument: _interchat_control_v1_RemoveHubStaffRoleRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  removeStaffRole(argument: _interchat_control_v1_RemoveHubStaffRoleRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  removeStaffRole(argument: _interchat_control_v1_RemoveHubStaffRoleRequest, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  
  ReorderRules(argument: _interchat_control_v1_ReorderHubRulesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubRulesResponse__Output>): grpc.ClientUnaryCall;
  ReorderRules(argument: _interchat_control_v1_ReorderHubRulesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_HubRulesResponse__Output>): grpc.ClientUnaryCall;
  ReorderRules(argument: _interchat_control_v1_ReorderHubRulesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubRulesResponse__Output>): grpc.ClientUnaryCall;
  ReorderRules(argument: _interchat_control_v1_ReorderHubRulesRequest, callback: grpc.requestCallback<_interchat_control_v1_HubRulesResponse__Output>): grpc.ClientUnaryCall;
  reorderRules(argument: _interchat_control_v1_ReorderHubRulesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubRulesResponse__Output>): grpc.ClientUnaryCall;
  reorderRules(argument: _interchat_control_v1_ReorderHubRulesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_HubRulesResponse__Output>): grpc.ClientUnaryCall;
  reorderRules(argument: _interchat_control_v1_ReorderHubRulesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubRulesResponse__Output>): grpc.ClientUnaryCall;
  reorderRules(argument: _interchat_control_v1_ReorderHubRulesRequest, callback: grpc.requestCallback<_interchat_control_v1_HubRulesResponse__Output>): grpc.ClientUnaryCall;
  
  RevokeInvite(argument: _interchat_control_v1_RevokeHubInviteRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  RevokeInvite(argument: _interchat_control_v1_RevokeHubInviteRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  RevokeInvite(argument: _interchat_control_v1_RevokeHubInviteRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  RevokeInvite(argument: _interchat_control_v1_RevokeHubInviteRequest, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  revokeInvite(argument: _interchat_control_v1_RevokeHubInviteRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  revokeInvite(argument: _interchat_control_v1_RevokeHubInviteRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  revokeInvite(argument: _interchat_control_v1_RevokeHubInviteRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  revokeInvite(argument: _interchat_control_v1_RevokeHubInviteRequest, callback: grpc.requestCallback<_interchat_control_v1_EmptyResponse__Output>): grpc.ClientUnaryCall;
  
  TransferOwnership(argument: _interchat_control_v1_TransferHubOwnershipRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Hub__Output>): grpc.ClientUnaryCall;
  TransferOwnership(argument: _interchat_control_v1_TransferHubOwnershipRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_Hub__Output>): grpc.ClientUnaryCall;
  TransferOwnership(argument: _interchat_control_v1_TransferHubOwnershipRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Hub__Output>): grpc.ClientUnaryCall;
  TransferOwnership(argument: _interchat_control_v1_TransferHubOwnershipRequest, callback: grpc.requestCallback<_interchat_control_v1_Hub__Output>): grpc.ClientUnaryCall;
  transferOwnership(argument: _interchat_control_v1_TransferHubOwnershipRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Hub__Output>): grpc.ClientUnaryCall;
  transferOwnership(argument: _interchat_control_v1_TransferHubOwnershipRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_Hub__Output>): grpc.ClientUnaryCall;
  transferOwnership(argument: _interchat_control_v1_TransferHubOwnershipRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_Hub__Output>): grpc.ClientUnaryCall;
  transferOwnership(argument: _interchat_control_v1_TransferHubOwnershipRequest, callback: grpc.requestCallback<_interchat_control_v1_Hub__Output>): grpc.ClientUnaryCall;
  
  UpdateAnnouncement(argument: _interchat_control_v1_UpdateHubAnnouncementRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubAnnouncement__Output>): grpc.ClientUnaryCall;
  UpdateAnnouncement(argument: _interchat_control_v1_UpdateHubAnnouncementRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_HubAnnouncement__Output>): grpc.ClientUnaryCall;
  UpdateAnnouncement(argument: _interchat_control_v1_UpdateHubAnnouncementRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubAnnouncement__Output>): grpc.ClientUnaryCall;
  UpdateAnnouncement(argument: _interchat_control_v1_UpdateHubAnnouncementRequest, callback: grpc.requestCallback<_interchat_control_v1_HubAnnouncement__Output>): grpc.ClientUnaryCall;
  updateAnnouncement(argument: _interchat_control_v1_UpdateHubAnnouncementRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubAnnouncement__Output>): grpc.ClientUnaryCall;
  updateAnnouncement(argument: _interchat_control_v1_UpdateHubAnnouncementRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_HubAnnouncement__Output>): grpc.ClientUnaryCall;
  updateAnnouncement(argument: _interchat_control_v1_UpdateHubAnnouncementRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubAnnouncement__Output>): grpc.ClientUnaryCall;
  updateAnnouncement(argument: _interchat_control_v1_UpdateHubAnnouncementRequest, callback: grpc.requestCallback<_interchat_control_v1_HubAnnouncement__Output>): grpc.ClientUnaryCall;
  
  UpdateRule(argument: _interchat_control_v1_UpdateHubRuleRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubRule__Output>): grpc.ClientUnaryCall;
  UpdateRule(argument: _interchat_control_v1_UpdateHubRuleRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_HubRule__Output>): grpc.ClientUnaryCall;
  UpdateRule(argument: _interchat_control_v1_UpdateHubRuleRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubRule__Output>): grpc.ClientUnaryCall;
  UpdateRule(argument: _interchat_control_v1_UpdateHubRuleRequest, callback: grpc.requestCallback<_interchat_control_v1_HubRule__Output>): grpc.ClientUnaryCall;
  updateRule(argument: _interchat_control_v1_UpdateHubRuleRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubRule__Output>): grpc.ClientUnaryCall;
  updateRule(argument: _interchat_control_v1_UpdateHubRuleRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_interchat_control_v1_HubRule__Output>): grpc.ClientUnaryCall;
  updateRule(argument: _interchat_control_v1_UpdateHubRuleRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_interchat_control_v1_HubRule__Output>): grpc.ClientUnaryCall;
  updateRule(argument: _interchat_control_v1_UpdateHubRuleRequest, callback: grpc.requestCallback<_interchat_control_v1_HubRule__Output>): grpc.ClientUnaryCall;
  
}

export interface HubServiceHandlers extends grpc.UntypedServiceImplementation {
  AssignStaffRole: grpc.handleUnaryCall<_interchat_control_v1_AssignHubStaffRoleRequest__Output, _interchat_control_v1_HubStaffMember>;
  
  CreateAnnouncement: grpc.handleUnaryCall<_interchat_control_v1_CreateHubAnnouncementRequest__Output, _interchat_control_v1_HubAnnouncement>;
  
  CreateHub: grpc.handleUnaryCall<_interchat_control_v1_CreateHubRequest__Output, _interchat_control_v1_Hub>;
  
  CreateInvite: grpc.handleUnaryCall<_interchat_control_v1_CreateHubInviteRequest__Output, _interchat_control_v1_HubInvite>;
  
  CreateRule: grpc.handleUnaryCall<_interchat_control_v1_CreateHubRuleRequest__Output, _interchat_control_v1_HubRule>;
  
  DeleteAnnouncement: grpc.handleUnaryCall<_interchat_control_v1_DeleteHubAnnouncementRequest__Output, _interchat_control_v1_EmptyResponse>;
  
  DeleteHub: grpc.handleUnaryCall<_interchat_control_v1_DeleteHubRequest__Output, _interchat_control_v1_EmptyResponse>;
  
  DeleteRule: grpc.handleUnaryCall<_interchat_control_v1_DeleteHubRuleRequest__Output, _interchat_control_v1_EmptyResponse>;
  
  GetHub: grpc.handleUnaryCall<_interchat_control_v1_GetHubRequest__Output, _interchat_control_v1_Hub>;
  
  ListAnnouncements: grpc.handleUnaryCall<_interchat_control_v1_ListHubAnnouncementsRequest__Output, _interchat_control_v1_HubAnnouncementsResponse>;
  
  ListInvites: grpc.handleUnaryCall<_interchat_control_v1_ListHubInvitesRequest__Output, _interchat_control_v1_HubInvitesResponse>;
  
  ListRules: grpc.handleUnaryCall<_interchat_control_v1_GetHubRequest__Output, _interchat_control_v1_HubRulesResponse>;
  
  ListStaff: grpc.handleUnaryCall<_interchat_control_v1_ListHubStaffRequest__Output, _interchat_control_v1_HubStaffResponse>;
  
  LockdownHub: grpc.handleUnaryCall<_interchat_control_v1_LockdownHubRequest__Output, _interchat_control_v1_Hub>;
  
  PatchBadges: grpc.handleUnaryCall<_interchat_control_v1_PatchHubBadgesRequest__Output, _interchat_control_v1_HubBadgeConfig>;
  
  PatchHub: grpc.handleUnaryCall<_interchat_control_v1_PatchHubRequest__Output, _interchat_control_v1_Hub>;
  
  PatchLogConfig: grpc.handleUnaryCall<_interchat_control_v1_PatchHubLogConfigRequest__Output, _interchat_control_v1_HubLogConfig>;
  
  RemoveStaffRole: grpc.handleUnaryCall<_interchat_control_v1_RemoveHubStaffRoleRequest__Output, _interchat_control_v1_EmptyResponse>;
  
  ReorderRules: grpc.handleUnaryCall<_interchat_control_v1_ReorderHubRulesRequest__Output, _interchat_control_v1_HubRulesResponse>;
  
  RevokeInvite: grpc.handleUnaryCall<_interchat_control_v1_RevokeHubInviteRequest__Output, _interchat_control_v1_EmptyResponse>;
  
  TransferOwnership: grpc.handleUnaryCall<_interchat_control_v1_TransferHubOwnershipRequest__Output, _interchat_control_v1_Hub>;
  
  UpdateAnnouncement: grpc.handleUnaryCall<_interchat_control_v1_UpdateHubAnnouncementRequest__Output, _interchat_control_v1_HubAnnouncement>;
  
  UpdateRule: grpc.handleUnaryCall<_interchat_control_v1_UpdateHubRuleRequest__Output, _interchat_control_v1_HubRule>;
  
}

export interface HubServiceDefinition extends grpc.ServiceDefinition {
  AssignStaffRole: MethodDefinition<_interchat_control_v1_AssignHubStaffRoleRequest, _interchat_control_v1_HubStaffMember, _interchat_control_v1_AssignHubStaffRoleRequest__Output, _interchat_control_v1_HubStaffMember__Output>
  CreateAnnouncement: MethodDefinition<_interchat_control_v1_CreateHubAnnouncementRequest, _interchat_control_v1_HubAnnouncement, _interchat_control_v1_CreateHubAnnouncementRequest__Output, _interchat_control_v1_HubAnnouncement__Output>
  CreateHub: MethodDefinition<_interchat_control_v1_CreateHubRequest, _interchat_control_v1_Hub, _interchat_control_v1_CreateHubRequest__Output, _interchat_control_v1_Hub__Output>
  CreateInvite: MethodDefinition<_interchat_control_v1_CreateHubInviteRequest, _interchat_control_v1_HubInvite, _interchat_control_v1_CreateHubInviteRequest__Output, _interchat_control_v1_HubInvite__Output>
  CreateRule: MethodDefinition<_interchat_control_v1_CreateHubRuleRequest, _interchat_control_v1_HubRule, _interchat_control_v1_CreateHubRuleRequest__Output, _interchat_control_v1_HubRule__Output>
  DeleteAnnouncement: MethodDefinition<_interchat_control_v1_DeleteHubAnnouncementRequest, _interchat_control_v1_EmptyResponse, _interchat_control_v1_DeleteHubAnnouncementRequest__Output, _interchat_control_v1_EmptyResponse__Output>
  DeleteHub: MethodDefinition<_interchat_control_v1_DeleteHubRequest, _interchat_control_v1_EmptyResponse, _interchat_control_v1_DeleteHubRequest__Output, _interchat_control_v1_EmptyResponse__Output>
  DeleteRule: MethodDefinition<_interchat_control_v1_DeleteHubRuleRequest, _interchat_control_v1_EmptyResponse, _interchat_control_v1_DeleteHubRuleRequest__Output, _interchat_control_v1_EmptyResponse__Output>
  GetHub: MethodDefinition<_interchat_control_v1_GetHubRequest, _interchat_control_v1_Hub, _interchat_control_v1_GetHubRequest__Output, _interchat_control_v1_Hub__Output>
  ListAnnouncements: MethodDefinition<_interchat_control_v1_ListHubAnnouncementsRequest, _interchat_control_v1_HubAnnouncementsResponse, _interchat_control_v1_ListHubAnnouncementsRequest__Output, _interchat_control_v1_HubAnnouncementsResponse__Output>
  ListInvites: MethodDefinition<_interchat_control_v1_ListHubInvitesRequest, _interchat_control_v1_HubInvitesResponse, _interchat_control_v1_ListHubInvitesRequest__Output, _interchat_control_v1_HubInvitesResponse__Output>
  ListRules: MethodDefinition<_interchat_control_v1_GetHubRequest, _interchat_control_v1_HubRulesResponse, _interchat_control_v1_GetHubRequest__Output, _interchat_control_v1_HubRulesResponse__Output>
  ListStaff: MethodDefinition<_interchat_control_v1_ListHubStaffRequest, _interchat_control_v1_HubStaffResponse, _interchat_control_v1_ListHubStaffRequest__Output, _interchat_control_v1_HubStaffResponse__Output>
  LockdownHub: MethodDefinition<_interchat_control_v1_LockdownHubRequest, _interchat_control_v1_Hub, _interchat_control_v1_LockdownHubRequest__Output, _interchat_control_v1_Hub__Output>
  PatchBadges: MethodDefinition<_interchat_control_v1_PatchHubBadgesRequest, _interchat_control_v1_HubBadgeConfig, _interchat_control_v1_PatchHubBadgesRequest__Output, _interchat_control_v1_HubBadgeConfig__Output>
  PatchHub: MethodDefinition<_interchat_control_v1_PatchHubRequest, _interchat_control_v1_Hub, _interchat_control_v1_PatchHubRequest__Output, _interchat_control_v1_Hub__Output>
  PatchLogConfig: MethodDefinition<_interchat_control_v1_PatchHubLogConfigRequest, _interchat_control_v1_HubLogConfig, _interchat_control_v1_PatchHubLogConfigRequest__Output, _interchat_control_v1_HubLogConfig__Output>
  RemoveStaffRole: MethodDefinition<_interchat_control_v1_RemoveHubStaffRoleRequest, _interchat_control_v1_EmptyResponse, _interchat_control_v1_RemoveHubStaffRoleRequest__Output, _interchat_control_v1_EmptyResponse__Output>
  ReorderRules: MethodDefinition<_interchat_control_v1_ReorderHubRulesRequest, _interchat_control_v1_HubRulesResponse, _interchat_control_v1_ReorderHubRulesRequest__Output, _interchat_control_v1_HubRulesResponse__Output>
  RevokeInvite: MethodDefinition<_interchat_control_v1_RevokeHubInviteRequest, _interchat_control_v1_EmptyResponse, _interchat_control_v1_RevokeHubInviteRequest__Output, _interchat_control_v1_EmptyResponse__Output>
  TransferOwnership: MethodDefinition<_interchat_control_v1_TransferHubOwnershipRequest, _interchat_control_v1_Hub, _interchat_control_v1_TransferHubOwnershipRequest__Output, _interchat_control_v1_Hub__Output>
  UpdateAnnouncement: MethodDefinition<_interchat_control_v1_UpdateHubAnnouncementRequest, _interchat_control_v1_HubAnnouncement, _interchat_control_v1_UpdateHubAnnouncementRequest__Output, _interchat_control_v1_HubAnnouncement__Output>
  UpdateRule: MethodDefinition<_interchat_control_v1_UpdateHubRuleRequest, _interchat_control_v1_HubRule, _interchat_control_v1_UpdateHubRuleRequest__Output, _interchat_control_v1_HubRule__Output>
}
