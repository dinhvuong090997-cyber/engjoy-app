import assert from "node:assert/strict";
import { test } from "node:test";

import { questions, stories, topics, vocabulary } from "./seed";
import { TOPICS } from "../types";

const levelZeroTopicMinimums: Record<string, number> = {
  animals: 30,
  colors: 15,
  family: 15,
  food: 15,
  body: 15,
  toys: 10,
  shapes: 10,
  numbers: 10,
};

test("seed data has complete Level 0 learning content", () => {
  assert.ok(vocabulary.length >= 150);
  assert.deepEqual(new Set(vocabulary.map((word) => word.level)), new Set([0]));
  assert.deepEqual(topics, [...TOPICS]);

  for (const word of vocabulary) {
    assert.ok(Number.isInteger(word.id));
    assert.ok(word.word.trim().length > 0);
    assert.ok(word.meaning_vi.trim().length > 0);
    assert.ok(word.emoji.trim().length > 0);
    assert.ok(word.example_en.trim().length > 0);
    assert.ok(word.example_vi.trim().length > 0);
    assert.ok(word.part_of_speech.trim().length > 0);
    assert.ok(TOPICS.includes(word.topic as (typeof TOPICS)[number]));
  }

  for (const [topic, minimum] of Object.entries(levelZeroTopicMinimums)) {
    assert.ok(
      vocabulary.filter((word) => word.topic === topic).length >= minimum,
      `${topic} needs at least ${minimum} words`
    );
  }

  assert.ok(questions.length >= 50);
  assert.deepEqual(new Set(questions.map((question) => question.level)), new Set([0]));
  for (const question of questions) {
    assert.ok(Number.isInteger(question.id));
    assert.ok(question.content.trim().length > 0);
    assert.equal(question.type, "mcq");
    assert.ok(question.options.length >= 3);
    assert.ok(question.options.every((option) => option.trim().length > 0));
    assert.ok(question.correct_index >= 0);
    assert.ok(question.correct_index < question.options.length);
    assert.ok(question.explanation_vi.trim().length > 0);
    assert.ok(TOPICS.includes(question.topic as (typeof TOPICS)[number]));
  }

  assert.ok(stories.length >= 2);
  assert.deepEqual(new Set(stories.map((story) => story.level)), new Set([0]));
  assert.deepEqual(new Set(stories.map((story) => story.unlock_level)), new Set([0]));
  for (const story of stories) {
    assert.ok(story.title.trim().length > 0);
    assert.ok(story.title_vi.trim().length > 0);
    assert.ok(story.panels.length >= 4);
    assert.ok(story.panels.length <= 12);
    assert.equal(story.questions.length, 3);
    assert.ok(
      story.panels.every(
        (panel) =>
          panel.emoji.trim().length > 0 &&
          panel.en.trim().length > 0 &&
          panel.vi.trim().length > 0
      )
    );
    assert.ok(
      story.questions.every(
        (question) =>
          question.content.trim().length > 0 &&
          question.options.length >= 3 &&
          question.correct_index >= 0 &&
          question.correct_index < question.options.length
      )
    );
  }
});
