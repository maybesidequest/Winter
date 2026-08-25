// Original file: ../interchat-protobuf/control/v1/models.proto

export const ActorType = {
  ACTOR_TYPE_UNSPECIFIED: 'ACTOR_TYPE_UNSPECIFIED',
  ACTOR_TYPE_HUMAN: 'ACTOR_TYPE_HUMAN',
  ACTOR_TYPE_SERVICE: 'ACTOR_TYPE_SERVICE',
} as const;

export type ActorType =
  | 'ACTOR_TYPE_UNSPECIFIED'
  | 0
  | 'ACTOR_TYPE_HUMAN'
  | 1
  | 'ACTOR_TYPE_SERVICE'
  | 2

export type ActorType__Output = typeof ActorType[keyof typeof ActorType]
