// Original file: ../interchat-protobuf/control/v1/models.proto


export interface UserPreferences {
  'userId'?: (string);
  'language'?: (string);
  'replyMention'?: (boolean);
  'badgeVisibility'?: (boolean);
  'streakReminders'?: (boolean);
  'voteReminders'?: (boolean);
}

export interface UserPreferences__Output {
  'userId': (string);
  'language': (string);
  'replyMention': (boolean);
  'badgeVisibility': (boolean);
  'streakReminders': (boolean);
  'voteReminders': (boolean);
}
