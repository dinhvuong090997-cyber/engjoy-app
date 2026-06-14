import assert from "node:assert/strict";
import { test } from "node:test";

import { buildPracticeModel } from "./practice";
import { type VocabWord } from "./types";

const sampleVocabulary: VocabWord[] = [
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
  {
    id: 3,
    word: "run",
    meaning_vi: "chạy",
    emoji: "🏃",
    topic: "actions",
    level: 0,
    example_en: "I run fast.",
    example_vi: "Tôi chạy nhanh.",
    part_of_speech: "verb",
  },
];

test("builds Vietnamese empty state when there is no vocabulary", () => {
  const model = buildPracticeModel([]);

  assert.equal(model.hasVocabulary, false);
  assert.equal(model.vocabularyCount, 0);
  assert.equal(model.games.length, 3);
  assert.ok(model.games.every((game) => game.isLocked));
  assert.equal(model.emptyState.title, "Chưa có từ vựng để luyện tập");
});

test("builds three mini games from seeded vocabulary", () => {
  const model = buildPracticeModel(sampleVocabulary);

  assert.equal(model.hasVocabulary, true);
  assert.equal(model.vocabularyCount, 3);
  assert.deepEqual(
    model.games.map((game) => game.title),
    ["Nghe và chọn", "Điền chữ cái", "Ghép cặp"]
  );
  assert.ok(model.games.every((game) => !game.isLocked));
  assert.deepEqual(
    model.games.map((game) => game.previewWords),
    [
      ["cat", "red", "run"],
      ["c_t", "r_d", "r_n"],
      ["cat - con mèo", "red - màu đỏ", "run - chạy"],
    ]
  );
});
