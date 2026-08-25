// Original file: ../interchat-protobuf/control/v1/models.proto

export const HubVisibility = {
  HUB_VISIBILITY_UNSPECIFIED: 'HUB_VISIBILITY_UNSPECIFIED',
  HUB_VISIBILITY_PUBLIC: 'HUB_VISIBILITY_PUBLIC',
  HUB_VISIBILITY_PRIVATE: 'HUB_VISIBILITY_PRIVATE',
  HUB_VISIBILITY_UNLISTED: 'HUB_VISIBILITY_UNLISTED',
} as const;

export type HubVisibility =
  | 'HUB_VISIBILITY_UNSPECIFIED'
  | 0
  | 'HUB_VISIBILITY_PUBLIC'
  | 1
  | 'HUB_VISIBILITY_PRIVATE'
  | 2
  | 'HUB_VISIBILITY_UNLISTED'
  | 3

export type HubVisibility__Output = typeof HubVisibility[keyof typeof HubVisibility]
