// Original file: ../interchat-protobuf/control/v1/models.proto

export const AppealStatus = {
  APPEAL_STATUS_UNSPECIFIED: 'APPEAL_STATUS_UNSPECIFIED',
  APPEAL_STATUS_PENDING: 'APPEAL_STATUS_PENDING',
  APPEAL_STATUS_APPROVED: 'APPEAL_STATUS_APPROVED',
  APPEAL_STATUS_REJECTED: 'APPEAL_STATUS_REJECTED',
} as const;

export type AppealStatus =
  | 'APPEAL_STATUS_UNSPECIFIED'
  | 0
  | 'APPEAL_STATUS_PENDING'
  | 1
  | 'APPEAL_STATUS_APPROVED'
  | 2
  | 'APPEAL_STATUS_REJECTED'
  | 3

export type AppealStatus__Output = typeof AppealStatus[keyof typeof AppealStatus]
