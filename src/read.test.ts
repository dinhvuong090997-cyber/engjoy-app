import assert from "node:assert/strict";
import { test } from "node:test";

import {
  buildStoryCards,
  getStoryByRouteId,
  type StoryCard,
} from "./read";
import { type Story } from "./types";

const sampleStories: Story[] = [
  {
    title: "Tom and the Sun",
    title_vi: "Tom và mặt trời",
    panels: [
      { emoji: "👦", en: "Tom wakes up.", vi: "Tom thức dậy." },
      { emoji: "☀️", en: "The sun is bright.", vi: "Mặt trời sáng." },
      { emoji: "😊", en: "Tom is happy.", vi: "Tom vui vẻ." },
    ],
    level: 1,
    unlock_level: 0,
    questions: [
      {
        content: "Who wakes up?",
        options: ["Tom", "Mom", "Dad"],
        correct_index: 0,
      },
    ],
  },
];

test("builds story cards with index, level badge, and emoji preview", () => {
  const cards: StoryCard[] = buildStoryCards(sampleStories);

  assert.deepEqual(cards, [
    {
      id: "0",
      routeId: "0",
      title: "Tom and the Sun",
      levelLabel: "Level 1",
      emojiPreview: "👦 ☀️ 😊",
    },
  ]);
});

test("gets story by numeric route id and rejects invalid ids", () => {
  assert.equal(getStoryByRouteId(sampleStories, "0"), sampleStories[0]);
  assert.equal(getStoryByRouteId(sampleStories, "abc"), null);
  assert.equal(getStoryByRouteId(sampleStories, "10"), null);
});
