import assert from "node:assert/strict";
import { test } from "node:test";

import { buildDashboardModel } from "./dashboard";
import { DAILY_GOAL_WORDS } from "./constants";
import { TOPICS, type VocabWord } from "./types";

const emptyStats = {
  totalXp: 0,
  streakDays: 0,
  dailyGoalProgress: 0,
  dailyGoalTarget: DAILY_GOAL_WORDS,
  wordsLearned: 0,
  quizzesDone: 0,
  storiesRead: 0,
};

test("builds a motivating empty dashboard state", () => {
  const model = buildDashboardModel(emptyStats, []);

  assert.equal(model.streakMessage, "Hãy bắt đầu học hôm nay!");
  assert.equal(model.dailyGoalLabel, "Đã học 0 từ vựng / 5 từ");
  assert.equal(model.dailyProgressRatio, 0);
  assert.equal(model.suggestedTopics.length, 3);
  assert.deepEqual(
    model.suggestedTopics.map((topic) => topic.id),
    TOPICS.slice(0, 3)
  );
  assert.ok(model.suggestedTopics.every((topic) => topic.isPlaceholder));
  assert.equal(model.recentActivityMessage, "Chưa có hoạt động. Bắt đầu học ngay!");
});

test("uses seeded vocabulary topics before placeholders", () => {
  const vocabulary: VocabWord[] = [
    {
      id: 1,
      word: "cat",
      meaning_vi: "con mèo",
      emoji: "🐱",
      topic: "animals",
      level: 0,
      example_en: "A cat sleeps.",
      example_vi: "Một con mèo ngủ.",
      part_of_speech: "noun",
    },
    {
      id: 2,
      word: "red",
      meaning_vi: "màu đỏ",
      emoji: "🔴",
      topic: "colors",
      level: 0,
      example_en: "The apple is red.",
      example_vi: "Quả táo màu đỏ.",
      part_of_speech: "adjective",
    },
  ];

  const model = buildDashboardModel(
    {
      ...emptyStats,
      streakDays: 4,
      dailyGoalProgress: 7,
      wordsLearned: 12,
      quizzesDone: 2,
      storiesRead: 1,
    },
    vocabulary
  );

  assert.equal(model.streakMessage, "Học liên tiếp 4 ngày");
  assert.equal(model.dailyProgressRatio, 1);
  assert.deepEqual(
    model.suggestedTopics.map((topic) => topic.id),
    ["animals", "colors"]
  );
  assert.ok(model.suggestedTopics.every((topic) => !topic.isPlaceholder));
});
