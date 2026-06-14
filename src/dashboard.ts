import { DAILY_GOAL_WORDS } from "./constants";
import { TOPICS, type Topic, type VocabWord } from "./types";

export type DashboardStatsInput = {
  totalXp: number;
  streakDays: number;
  dailyGoalProgress: number;
  dailyGoalTarget: number;
  wordsLearned: number;
  quizzesDone: number;
  storiesRead: number;
};

export type SuggestedTopic = {
  id: Topic;
  emoji: string;
  name: string;
  studiedCount: number;
  totalCount: number;
  isPlaceholder: boolean;
};

export type DashboardModel = {
  streakMessage: string;
  dailyGoalLabel: string;
  dailyProgressRatio: number;
  xpToday: number;
  suggestedTopics: SuggestedTopic[];
  recentActivityMessage: string;
};

export const TOPIC_DETAILS: Record<Topic, { emoji: string; name: string }> = {
  animals: { emoji: "🐶", name: "Động vật" },
  body: { emoji: "👋", name: "Cơ thể" },
  clothes: { emoji: "👕", name: "Quần áo" },
  colors: { emoji: "🎨", name: "Màu sắc" },
  emotions: { emoji: "😊", name: "Cảm xúc" },
  family: { emoji: "👨‍👩‍👧", name: "Gia đình" },
  food: { emoji: "🍽️", name: "Đồ ăn" },
  fruits: { emoji: "🍎", name: "Trái cây" },
  house: { emoji: "🏠", name: "Ngôi nhà" },
  jobs: { emoji: "👩‍🏫", name: "Nghề nghiệp" },
  nature: { emoji: "🌳", name: "Thiên nhiên" },
  numbers: { emoji: "🔢", name: "Số đếm" },
  school: { emoji: "🎒", name: "Trường học" },
  shapes: { emoji: "🔷", name: "Hình dạng" },
  sports: { emoji: "⚽", name: "Thể thao" },
  toys: { emoji: "🧸", name: "Đồ chơi" },
  transport: { emoji: "🚗", name: "Giao thông" },
  vegetables: { emoji: "🥕", name: "Rau củ" },
  weather: { emoji: "☀️", name: "Thời tiết" },
  actions: { emoji: "🏃", name: "Hành động" },
};

export function buildDashboardModel(
  stats: DashboardStatsInput,
  vocabulary: VocabWord[]
): DashboardModel {
  const dailyGoalTarget = stats.dailyGoalTarget || DAILY_GOAL_WORDS;
  const dailyProgressRatio = Math.min(
    stats.dailyGoalProgress / dailyGoalTarget,
    1
  );
  const suggestedTopics = buildSuggestedTopics(vocabulary);

  return {
    streakMessage:
      stats.streakDays > 0
        ? `Học liên tiếp ${stats.streakDays} ngày`
        : "Hãy bắt đầu học hôm nay!",
    dailyGoalLabel: `Đã học ${stats.dailyGoalProgress} từ vựng / ${dailyGoalTarget} từ`,
    dailyProgressRatio,
    xpToday: stats.dailyGoalProgress * 10,
    suggestedTopics,
    recentActivityMessage: hasActivity(stats)
      ? "Giữ nhịp học đều mỗi ngày nhé!"
      : "Chưa có hoạt động. Bắt đầu học ngay!",
  };
}

function buildSuggestedTopics(vocabulary: VocabWord[]): SuggestedTopic[] {
  const vocabByTopic = new Map<Topic, VocabWord[]>();

  for (const word of vocabulary) {
    if (isTopic(word.topic)) {
      const words = vocabByTopic.get(word.topic) ?? [];
      words.push(word);
      vocabByTopic.set(word.topic, words);
    }
  }

  if (vocabByTopic.size === 0) {
    return TOPICS.slice(0, 3).map((topic) => toSuggestedTopic(topic, 0, true));
  }

  return TOPICS.filter((topic) => vocabByTopic.has(topic))
    .slice(0, 3)
    .map((topic) =>
      toSuggestedTopic(topic, vocabByTopic.get(topic)?.length ?? 0, false)
    );
}

function toSuggestedTopic(
  topic: Topic,
  totalCount: number,
  isPlaceholder: boolean
): SuggestedTopic {
  const details = TOPIC_DETAILS[topic];

  return {
    id: topic,
    emoji: details.emoji,
    name: details.name,
    studiedCount: 0,
    totalCount,
    isPlaceholder,
  };
}

function isTopic(value: string): value is Topic {
  return TOPICS.includes(value as Topic);
}

function hasActivity(stats: DashboardStatsInput): boolean {
  return (
    stats.wordsLearned > 0 ||
    stats.quizzesDone > 0 ||
    stats.storiesRead > 0 ||
    stats.dailyGoalProgress > 0
  );
}
