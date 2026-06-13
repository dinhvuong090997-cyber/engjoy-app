import assert from 'node:assert/strict';
import test from 'node:test';

import { stories, topics, vocabulary, questions } from './seed';

test('seed data includes required vocabulary volume across all requested topics', () => {
  assert.equal(topics.length, 20);
  assert.ok(vocabulary.length >= 400);

  for (const topic of topics) {
    const topicWords = vocabulary.filter((word) => word.topic === topic.id);
    assert.ok(topicWords.length >= 10, `${topic.id} has ${topicWords.length} words`);
  }
});

test('seed data includes required question and story volume', () => {
  assert.ok(questions.length >= 200);
  assert.equal(stories.length, 15);

  for (const story of stories) {
    assert.ok(story.panels.length >= 4);
    assert.ok(story.panels.length <= 12);
    assert.ok(story.questions.length >= 3);
    assert.ok(story.questions.length <= 5);
  }
});

test('seed data has no empty learning content fields', () => {
  for (const word of vocabulary) {
    assert.ok(word.word.trim());
    assert.ok(word.meaning_vi.trim());
    assert.ok(word.emoji.trim());
    assert.ok(word.example_en.trim());
    assert.ok(word.example_vi.trim());
    assert.ok(word.part_of_speech.trim());
  }

  for (const question of questions) {
    assert.ok(question.content.trim());
    assert.ok(question.options.length >= 2);
    assert.ok(question.correct_index >= 0);
    assert.ok(question.correct_index < question.options.length);
    assert.ok(question.explanation_vi.trim());
  }
});
