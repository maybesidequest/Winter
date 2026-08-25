// Original file: ../interchat-protobuf/control/v1/models.proto

import type { HubStaffMemberMetadata as _interchat_control_v1_HubStaffMemberMetadata, HubStaffMemberMetadata__Output as _interchat_control_v1_HubStaffMemberMetadata__Output } from '../../../interchat/control/v1/HubStaffMemberMetadata';
import type { HubStaffMemberSpec as _interchat_control_v1_HubStaffMemberSpec, HubStaffMemberSpec__Output as _interchat_control_v1_HubStaffMemberSpec__Output } from '../../../interchat/control/v1/HubStaffMemberSpec';
import type { HubStaffMemberStatus as _interchat_control_v1_HubStaffMemberStatus, HubStaffMemberStatus__Output as _interchat_control_v1_HubStaffMemberStatus__Output } from '../../../interchat/control/v1/HubStaffMemberStatus';

export interface HubStaffMember {
  'metadata'?: (_interchat_control_v1_HubStaffMemberMetadata | null);
  'spec'?: (_interchat_control_v1_HubStaffMemberSpec | null);
  'status'?: (_interchat_control_v1_HubStaffMemberStatus | null);
}

export interface HubStaffMember__Output {
  'metadata': (_interchat_control_v1_HubStaffMemberMetadata__Output | null);
  'spec': (_interchat_control_v1_HubStaffMemberSpec__Output | null);
  'status': (_interchat_control_v1_HubStaffMemberStatus__Output | null);
}
