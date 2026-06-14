import assert from "node:assert/strict";
import { test } from "node:test";

import { questions, topics, vocabulary } from "./seed";
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

// Minimum total vocabulary words required per level (0-5).
const levelVocabMinimums: Record<number, number> = {
  0: 150,
  1: 200,
  2: 300,
  3: 250,
  4: 200,
  5: 150,
};

// Minimum total questions required per level (0-5).
const levelQuestionMinimums: Record<number, number> = {
  0: 50,
  1: 60,
  2: 300,
  3: 250,
  4: 200,
  5: 150,
};

const langSenPanelCounts: Record<string, number> = {
  "Little Lotus": 10,
  "Village Life": 12,
  "The Forest Adventure": 14,
  "Across the Mountain": 16,
  "The City": 18,
  "Returning Home": 20,
};

function countByLevel(level: number): number {
  return vocabulary.filter((word) => word.level === level).length;
}

function countByLevelAndTopic(level: number, topic: string): number {
  return vocabulary.filter((word) => word.level === level && word.topic === topic).length;
}

function countQuestionsByLevel(level: number): number {
  return questions.filter((question) => question.level === level).length;
}

test("seed data has complete Level 0 through Level 5 learning content", () => {
  assert.ok(vocabulary.length >= 150);
  assert.deepEqual(
    new Set(vocabulary.map((word) => word.level)),
    new Set([0, 1, 2, 3, 4, 5])
  );
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

  for (const [topic, minimum] of Object.entries(levelOneTopicMinimums)) {
    assert.ok(
      countByLevelAndTopic(1, topic) >= minimum,
      `level 1 ${topic} needs at least ${minimum} words`
    );
  }

  // Per-level vocabulary minimums (Levels 0-5).
  for (const [level, minimum] of Object.entries(levelVocabMinimums)) {
    assert.ok(
      countByLevel(Number(level)) >= minimum,
      `level ${level} needs at least ${minimum} words`
    );
  }

  assert.ok(questions.length >= 50);
  assert.deepEqual(
    new Set(questions.map((question) => question.level)),
    new Set([0, 1, 2, 3, 4, 5])
  );

  // Per-level question minimums (Levels 0-5).
  for (const [level, minimum] of Object.entries(levelQuestionMinimums)) {
    assert.ok(
      countQuestionsByLevel(Number(level)) >= minimum,
      `level ${level} needs at least ${minimum} questions`
    );
  }

  // Every id is unique across the whole question set.
  assert.equal(new Set(questions.map((question) => question.id)).size, questions.length);
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

});
