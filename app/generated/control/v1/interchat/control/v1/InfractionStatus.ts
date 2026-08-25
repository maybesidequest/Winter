// Original file: ../interchat-protobuf/control/v1/models.proto

export const InfractionStatus = {
  INFRACTION_STATUS_UNSPECIFIED: 'INFRACTION_STATUS_UNSPECIFIED',
  INFRACTION_STATUS_ACTIVE: 'INFRACTION_STATUS_ACTIVE',
  INFRACTION_STATUS_EXPIRED: 'INFRACTION_STATUS_EXPIRED',
  INFRACTION_STATUS_REVOKED: 'INFRACTION_STATUS_REVOKED',
} as const;

export type InfractionStatus =
  | 'INFRACTION_STATUS_UNSPECIFIED'
  | 0
  | 'INFRACTION_STATUS_ACTIVE'
  | 1
  | 'INFRACTION_STATUS_EXPIRED'
  | 2
  | 'INFRACTION_STATUS_REVOKED'
  | 3

export type InfractionStatus__Output = typeof InfractionStatus[keyof typeof InfractionStatus]
