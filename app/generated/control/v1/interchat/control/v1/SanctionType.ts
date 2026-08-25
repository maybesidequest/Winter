// Original file: ../interchat-protobuf/control/v1/models.proto

export const SanctionType = {
  SANCTION_TYPE_UNSPECIFIED: 'SANCTION_TYPE_UNSPECIFIED',
  SANCTION_TYPE_WARN: 'SANCTION_TYPE_WARN',
  SANCTION_TYPE_MUTE: 'SANCTION_TYPE_MUTE',
  SANCTION_TYPE_BAN: 'SANCTION_TYPE_BAN',
} as const;

export type SanctionType =
  | 'SANCTION_TYPE_UNSPECIFIED'
  | 0
  | 'SANCTION_TYPE_WARN'
  | 1
  | 'SANCTION_TYPE_MUTE'
  | 2
  | 'SANCTION_TYPE_BAN'
  | 3

export type SanctionType__Output = typeof SanctionType[keyof typeof SanctionType]
