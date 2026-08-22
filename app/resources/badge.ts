import type { UserStatus } from "./user";

export interface BadgeInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const BADGE_DEFINITIONS: Record<string, BadgeInfo> = {
  VOTER: {
    id: "VOTER",
    name: "Voter",
    description: "Voted for InterChat on Top.gg in the last 12 hours",
    icon: "/images/badges/Voter.png",
  },
  SUPPORTER: {
    id: "SUPPORTER",
    name: "Supporter",
    description: "Donator and supporter of InterChat",
    icon: "/images/badges/Supporter.png",
  },
  TRANSLATOR: {
    id: "TRANSLATOR",
    name: "Translator",
    description: "Helped translate InterChat into other languages",
    icon: "/images/badges/Translator.png",
  },
  DEVELOPER: {
    id: "DEVELOPER",
    name: "Developer",
    description: "InterChat Core Developer",
    icon: "/images/badges/Developer.png",
  },
  STAFF: {
    id: "STAFF",
    name: "Staff",
    description: "InterChat Staff Member",
    icon: "/images/badges/Staff.png",
  },
  BETA_TESTER: {
    id: "BETA_TESTER",
    name: "Beta Tester",
    description: "Tested pre-release versions of InterChat",
    icon: "/images/badges/BetaTester.png",
  },
  HUB_OWNER: {
    id: "HUB_OWNER",
    name: "Hub Owner",
    description: "Owner of an InterChat Hub",
    icon: "/images/badges/HubOwner.png",
  },
  HUB_MANAGER: {
    id: "HUB_MANAGER",
    name: "Hub Manager",
    description: "Manager of an InterChat Hub",
    icon: "/images/badges/HubManager.png",
  },
  HUB_MODERATOR: {
    id: "HUB_MODERATOR",
    name: "Hub Moderator",
    description: "Moderator of an InterChat Hub",
    icon: "/images/badges/HubModerator.png",
  },
  TOP_CHATTER: {
    id: "TOP_CHATTER",
    name: "Top Chatter",
    description: "Top chatter across InterChat hubs",
    icon: "/images/badges/TopChatter.png",
  },
  STREAK_5: {
    id: "STREAK_5",
    name: "5 Day Streak",
    description: "Active message streak for 5 consecutive days",
    icon: "/images/badges/Streak5.png",
  },
  STREAK_10: {
    id: "STREAK_10",
    name: "10 Day Streak",
    description: "Active message streak for 10 consecutive days",
    icon: "/images/badges/Streak10.png",
  },
  STREAK_15: {
    id: "STREAK_15",
    name: "15 Day Streak",
    description: "Active message streak for 15 consecutive days",
    icon: "/images/badges/Streak15.png",
  },
  STREAK_20: {
    id: "STREAK_20",
    name: "20 Day Streak",
    description: "Active message streak for 20 consecutive days",
    icon: "/images/badges/Streak20.png",
  },
  STREAK_25: {
    id: "STREAK_25",
    name: "25 Day Streak",
    description: "Active message streak for 25 consecutive days",
    icon: "/images/badges/Streak25.png",
  },
};

export function getBadgeInfo(badgeKey: string): BadgeInfo | null {
  if (!badgeKey) return null;
  const normalized = badgeKey.toUpperCase().replace(/[\s-]+/g, "_");
  return BADGE_DEFINITIONS[normalized] || null;
}

export function getStreakBadgeTier(
  lastStreakDate: string | null | undefined,
  currentStreak: number,
  streakFreezes: number = 0,
  referenceDate: Date = new Date()
): BadgeInfo | null {
  if (currentStreak < 5) return null;

  if (lastStreakDate) {
    const last = new Date(lastStreakDate);
    const today = new Date(
      Date.UTC(
        referenceDate.getUTCFullYear(),
        referenceDate.getUTCMonth(),
        referenceDate.getUTCDate()
      )
    );
    const lastDay = new Date(
      Date.UTC(
        last.getUTCFullYear(),
        last.getUTCMonth(),
        last.getUTCDate()
      )
    );
    const diffMs = today.getTime() - lastDay.getTime();
    const gapDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    const isActive = gapDays <= 1 || (gapDays === 2 && streakFreezes > 0);
    if (!isActive) return null;
  }

  if (currentStreak >= 25) return BADGE_DEFINITIONS.STREAK_25;
  if (currentStreak >= 20) return BADGE_DEFINITIONS.STREAK_20;
  if (currentStreak >= 15) return BADGE_DEFINITIONS.STREAK_15;
  if (currentStreak >= 10) return BADGE_DEFINITIONS.STREAK_10;
  if (currentStreak >= 5) return BADGE_DEFINITIONS.STREAK_5;

  return null;
}

export function resolveUserBadges(status?: Partial<UserStatus> | null): BadgeInfo[] {
  if (!status) return [];

  const badgesMap = new Map<string, BadgeInfo>();

  // 1. Inferred Staff Badge
  if (status.isStaff && BADGE_DEFINITIONS.STAFF) {
    badgesMap.set("STAFF", BADGE_DEFINITIONS.STAFF);
  }

  // 2. Database explicit badges
  if (Array.isArray(status.badges)) {
    for (const rawBadge of status.badges) {
      const info = getBadgeInfo(rawBadge);
      if (info) {
        badgesMap.set(info.id, info);
      }
    }
  }

  // 3. Inferred Streak Badge
  const streakBadge = getStreakBadgeTier(
    status.lastStreakDate,
    status.currentStreak ?? 0,
    status.streakFreezes ?? 0
  );
  if (streakBadge) {
    badgesMap.set(streakBadge.id, streakBadge);
  }

  return Array.from(badgesMap.values());
}
