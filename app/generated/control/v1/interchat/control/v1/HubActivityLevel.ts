// Original file: ../interchat-protobuf/control/v1/models.proto

export const HubActivityLevel = {
  HUB_ACTIVITY_LEVEL_UNSPECIFIED: 'HUB_ACTIVITY_LEVEL_UNSPECIFIED',
  HUB_ACTIVITY_LEVEL_LOW: 'HUB_ACTIVITY_LEVEL_LOW',
  HUB_ACTIVITY_LEVEL_MEDIUM: 'HUB_ACTIVITY_LEVEL_MEDIUM',
  HUB_ACTIVITY_LEVEL_HIGH: 'HUB_ACTIVITY_LEVEL_HIGH',
} as const;

export type HubActivityLevel =
  | 'HUB_ACTIVITY_LEVEL_UNSPECIFIED'
  | 0
  | 'HUB_ACTIVITY_LEVEL_LOW'
  | 1
  | 'HUB_ACTIVITY_LEVEL_MEDIUM'
  | 2
  | 'HUB_ACTIVITY_LEVEL_HIGH'
  | 3

export type HubActivityLevel__Output = typeof HubActivityLevel[keyof typeof HubActivityLevel]
