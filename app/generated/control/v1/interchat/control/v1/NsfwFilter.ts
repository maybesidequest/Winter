// Original file: ../interchat-protobuf/control/v1/models.proto

export const NsfwFilter = {
  NSFW_FILTER_UNSPECIFIED: 'NSFW_FILTER_UNSPECIFIED',
  NSFW_FILTER_SFW_ONLY: 'NSFW_FILTER_SFW_ONLY',
  NSFW_FILTER_NSFW_ONLY: 'NSFW_FILTER_NSFW_ONLY',
  NSFW_FILTER_ALL: 'NSFW_FILTER_ALL',
} as const;

export type NsfwFilter =
  | 'NSFW_FILTER_UNSPECIFIED'
  | 0
  | 'NSFW_FILTER_SFW_ONLY'
  | 1
  | 'NSFW_FILTER_NSFW_ONLY'
  | 2
  | 'NSFW_FILTER_ALL'
  | 3

export type NsfwFilter__Output = typeof NsfwFilter[keyof typeof NsfwFilter]
