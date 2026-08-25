// Original file: ../interchat-protobuf/control/v1/models.proto

export const BlockTargetType = {
  BLOCK_TARGET_TYPE_UNSPECIFIED: 'BLOCK_TARGET_TYPE_UNSPECIFIED',
  BLOCK_TARGET_TYPE_USER: 'BLOCK_TARGET_TYPE_USER',
  BLOCK_TARGET_TYPE_SERVER: 'BLOCK_TARGET_TYPE_SERVER',
} as const;

export type BlockTargetType =
  | 'BLOCK_TARGET_TYPE_UNSPECIFIED'
  | 0
  | 'BLOCK_TARGET_TYPE_USER'
  | 1
  | 'BLOCK_TARGET_TYPE_SERVER'
  | 2

export type BlockTargetType__Output = typeof BlockTargetType[keyof typeof BlockTargetType]
