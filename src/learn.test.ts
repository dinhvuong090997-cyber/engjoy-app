import assert from "node:assert/strict";
import { test } from "node:test";

import { buildLearnTopicProgress } from "./learn";
import { TOPICS, type VocabWord } from "./types";

test("builds empty progress for every topic when there is no vocabulary", () => {
  const progress = buildLearnTopicProgress([]);

  assert.equal(progress.length, TOPICS.length);
  assert.ok(progress.every((topic) => topic.learnedCount === 0));
  assert.ok(progress.every((topic) => topic.totalCount === 0));
  assert.deepEqual(
    progress.map((topic) => topic.id),
    [...TOPICS]
  );
});

test("counts vocabulary by topic and ignores unknown topics", () => {
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
      word: "dog",
      meaning_vi: "con chó",
      emoji: "🐶",
      topic: "animals",
      level: 0,
      example_en: "A dog runs.",
      example_vi: "Một con chó chạy.",
      part_of_speech: "noun",
    },
    {
      id: 3,
      word: "blue",
      meaning_vi: "màu xanh dương",
      emoji: "🔵",
      topic: "colors",
      level: 0,
      example_en: "The sky is blue.",
      example_vi: "Bầu trời màu xanh dương.",
      part_of_speech: "adjective",
    },
    {
      id: 4,
      word: "unknown",
      meaning_vi: "không rõ",
      emoji: "❓",
      topic: "made-up",
      level: 0,
      example_en: "Unknown.",
      example_vi: "Không rõ.",
      part_of_speech: "noun",
    },
  ];

  const progress = buildLearnTopicProgress(vocabulary);
  const animals = progress.find((topic) => topic.id === "animals");
  const colors = progress.find((topic) => topic.id === "colors");
  const body = progress.find((topic) => topic.id === "body");

  assert.equal(animals?.totalCount, 2);
  assert.equal(colors?.totalCount, 1);
  assert.equal(body?.totalCount, 0);
});
