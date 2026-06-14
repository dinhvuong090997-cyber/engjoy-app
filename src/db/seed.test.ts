import assert from "node:assert/strict";
import { test } from "node:test";

import { questions, stories, topics, vocabulary } from "./seed";
import { TOPICS } from "../types";

test("seed data has complete real learning content", () => {
  assert.ok(vocabulary.length >= 100);
  assert.ok(new Set(vocabulary.map((word) => word.topic)).size >= 12);
  assert.deepEqual(topics, [...TOPICS]);

  for (const word of vocabulary) {
    assert.ok(word.word.trim().length > 0);
    assert.ok(word.meaning_vi.trim().length > 0);
    assert.ok(word.example_en.trim().length > 0);
    assert.ok(word.example_vi.trim().length > 0);
    assert.ok(TOPICS.includes(word.topic as (typeof TOPICS)[number]));
  }

  assert.ok(questions.length >= 50);
  for (const question of questions) {
    assert.equal(question.type, "mcq");
    assert.ok(question.options.length >= 3);
    assert.ok(question.correct_index >= 0);
    assert.ok(question.correct_index < question.options.length);
    assert.ok(question.explanation_vi.trim().length > 0);
    assert.ok(TOPICS.includes(question.topic as (typeof TOPICS)[number]));
  }

  assert.ok(stories.length >= 10);
  for (const story of stories) {
    assert.ok(story.panels.length >= 4);
    assert.ok(story.panels.length <= 12);
    assert.equal(story.questions.length, 3);
    assert.ok(story.panels.every((panel) => panel.emoji && panel.en && panel.vi));
  }
});
