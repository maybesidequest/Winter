export type UserMetadata = {
  id: string;
  name: string | null;
  image: string | null;
  email: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UserSpec = {
  locale: string;
  showBadges: boolean;
  mentionOnReply: boolean;
  showNsfwHubs: boolean;
  voteRemindersEnabled: boolean;
  activityLevel: "LOW" | "MEDIUM" | "HIGH" | null;
  theme: "system" | "night" | "paper";
  compactMode: boolean;
  reducedMotion: boolean;
  soundAlerts: boolean;
};

export type UserStatus = {
  isStaff: boolean;
  badges: string[];
  reputation: number;
  messageCount: number;
  callCount: number;
  hubJoinCount: number;
  currentStreak: number;
  longestStreak: number;
  streakFreezes: number;
  lastStreakDate: string | null;
  lastVoted: string | null;
  voteCount: number;
  hubsCount: number;
  serversCount: number;
  customerId: string | null;
};

export type UserResource = {
  metadata: UserMetadata;
  spec: UserSpec;
  status: UserStatus;
};

export type UserCallRecord = {
  id: string;
  status: "open" | "closed";
  messageCount: number;
  durationSeconds: number | null;
  createdAt: string;
  closedAt: string | null;
  otherPartyName: string;
  otherPartyServer: string;
  channelId: string;
};

export type SupportedLocale = {
  code: string;
  name: string;
  flag: string;
};
