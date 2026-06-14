import {
  XP_PER_QUIZ,
  XP_PER_STORY,
  XP_PER_WORD,
} from "./constants";
import { LEVEL_NAMES } from "./types";

export type ProfileStatsInput = {
  displayName: string;
  totalXp: number;
  level: number;
  streakDays: number;
  longestStreak: number;
  wordsLearned: number;
  quizzesDone: number;
  storiesRead: number;
};

export type Achievement = {
  emoji: string;
  name: string;
  isUnlocked: boolean;
};

export type ProfileModel = {
  displayName: string;
  avatarLetter: string;
  levelName: string;
  xpForLevel: number;
  xpProgress: number;
  xpProgressLabel: string;
  xpProgressRatio: number;
  achievements: Achievement[];
};

export const XP_PER_LEVEL =
  XP_PER_WORD * 10 + XP_PER_QUIZ + XP_PER_STORY;

export function buildProfileModel(stats: ProfileStatsInput): ProfileModel {
  const xpProgress = stats.totalXp % XP_PER_LEVEL;
  const displayName = stats.displayName.trim() || "Bạn nhỏ";

  return {
    displayName,
    avatarLetter: Array.from(displayName)[0]?.toUpperCase() ?? "B",
    levelName: LEVEL_NAMES[stats.level] ?? LEVEL_NAMES[0],
    xpForLevel: XP_PER_LEVEL,
    xpProgress,
    xpProgressLabel: `${xpProgress} / ${XP_PER_LEVEL} XP đến level tiếp theo`,
    xpProgressRatio: Math.min(1, xpProgress / XP_PER_LEVEL),
    achievements: [
      {
        emoji: "🏆",
        name: "Nhà thám hiểm",
        isUnlocked: stats.wordsLearned >= 1,
      },
      {
        emoji: "🔥",
        name: "Chăm chỉ",
        isUnlocked: stats.streakDays >= 7 || stats.longestStreak >= 7,
      },
      {
        emoji: "📚",
        name: "Học giả",
        isUnlocked: stats.wordsLearned >= 50,
      },
      {
        emoji: "🥇",
        name: "Nhà vô địch",
        isUnlocked: stats.quizzesDone >= 10,
      },
      {
        emoji: "📖",
        name: "Mọt sách",
        isUnlocked: stats.storiesRead >= 5,
      },
    ],
  };
}
