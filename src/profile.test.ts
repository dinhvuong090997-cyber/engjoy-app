import assert from "node:assert/strict";
import { test } from "node:test";

import { buildProfileModel } from "./profile";

const emptyStats = {
  displayName: "Bạn nhỏ",
  totalXp: 0,
  level: 0,
  streakDays: 0,
  longestStreak: 0,
  wordsLearned: 0,
  quizzesDone: 0,
  storiesRead: 0,
};

test("builds locked achievements and empty xp progress", () => {
  const model = buildProfileModel(emptyStats);

  assert.equal(model.displayName, "Bạn nhỏ");
  assert.equal(model.avatarLetter, "B");
  assert.equal(model.levelName, "Mới bắt đầu");
  assert.equal(model.xpProgressLabel, "0 / 180 XP đến level tiếp theo");
  assert.equal(model.xpProgressRatio, 0);
  assert.ok(model.achievements.every((achievement) => !achievement.isUnlocked));
});

test("unlocks achievements from learning stats", () => {
  const model = buildProfileModel({
    ...emptyStats,
    displayName: "An",
    totalXp: 220,
    level: 1,
    streakDays: 7,
    longestStreak: 9,
    wordsLearned: 50,
    quizzesDone: 10,
    storiesRead: 5,
  });

  assert.equal(model.displayName, "An");
  assert.equal(model.avatarLetter, "A");
  assert.equal(model.levelName, "Bắt đầu");
  assert.equal(model.xpProgressLabel, "40 / 180 XP đến level tiếp theo");
  assert.equal(model.xpProgressRatio, 40 / 180);
  assert.ok(model.achievements.every((achievement) => achievement.isUnlocked));
});
