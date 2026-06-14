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

const levelOneTopicMinimums: Record<string, number> = {
  animals: 40,
  food: 25,
  school: 25,
  weather: 15,
  clothes: 15,
  emotions: 15,
  house: 15,
  sports: 15,
  jobs: 15,
  actions: 20,
  fruits: 15,
  vegetables: 15,
  transport: 15,
};

function countByLevelAndTopic(level: number, topic: string): number {
  return vocabulary.filter((word) => word.level === level && word.topic === topic).length;
}

test("seed data has complete Level 0 and Level 1 learning content", () => {
  assert.ok(vocabulary.length >= 150);
  assert.deepEqual(new Set(vocabulary.map((word) => word.level)), new Set([0, 1]));
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

  // Every id is unique across the whole vocabulary set.
  assert.equal(new Set(vocabulary.map((word) => word.id)).size, vocabulary.length);

  for (const [topic, minimum] of Object.entries(levelZeroTopicMinimums)) {
    assert.ok(
      countByLevelAndTopic(0, topic) >= minimum,
      `level 0 ${topic} needs at least ${minimum} words`
    );
  }

  assert.ok(
    vocabulary.filter((word) => word.level === 1).length >= 200,
    "Level 1 needs at least 200 words"
  );
  for (const [topic, minimum] of Object.entries(levelOneTopicMinimums)) {
    assert.ok(
      countByLevelAndTopic(1, topic) >= minimum,
      `level 1 ${topic} needs at least ${minimum} words`
    );
  }

  assert.ok(questions.length >= 50);
  assert.deepEqual(new Set(questions.map((question) => question.level)), new Set([0, 1]));
  assert.ok(
    questions.filter((question) => question.level === 1).length >= 60,
    "Level 1 needs at least 60 questions"
  );
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

  assert.ok(stories.length >= 4);
  assert.deepEqual(new Set(stories.map((story) => story.level)), new Set([0, 1]));
  assert.deepEqual(new Set(stories.map((story) => story.unlock_level)), new Set([0, 1]));
  assert.ok(
    stories.filter((story) => story.level === 1).length >= 2,
    "Level 1 needs at least 2 stories"
  );
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
