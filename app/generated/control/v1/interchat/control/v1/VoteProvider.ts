// Original file: ../interchat-protobuf/control/v1/models.proto

export const VoteProvider = {
  VOTE_PROVIDER_UNSPECIFIED: 'VOTE_PROVIDER_UNSPECIFIED',
  VOTE_PROVIDER_TOPGG: 'VOTE_PROVIDER_TOPGG',
  VOTE_PROVIDER_DISCORD_BOT_LIST: 'VOTE_PROVIDER_DISCORD_BOT_LIST',
} as const;

export type VoteProvider =
  | 'VOTE_PROVIDER_UNSPECIFIED'
  | 0
  | 'VOTE_PROVIDER_TOPGG'
  | 1
  | 'VOTE_PROVIDER_DISCORD_BOT_LIST'
  | 2

export type VoteProvider__Output = typeof VoteProvider[keyof typeof VoteProvider]
