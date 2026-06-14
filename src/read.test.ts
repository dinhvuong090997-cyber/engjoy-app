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
    id: 1,
    title: "Tom and the Sun",
    title_vi: "Tom và mặt trời",
    panels: [
      { emoji: "👦", en: "Tom wakes up.", vi: "Tom thức dậy." },
      { emoji: "☀️", en: "The sun is bright.", vi: "Mặt trời sáng." },
      { emoji: "😊", en: "Tom is happy.", vi: "Tom vui vẻ." },
    ],
  },
];

test("builds story cards with index and emoji preview", () => {
  const cards: StoryCard[] = buildStoryCards(sampleStories);

  assert.deepEqual(cards, [
    {
      id: "1",
      routeId: "1",
      title: "Tom and the Sun",
      levelLabel: "Mới",
      emojiPreview: "👦 ☀️ 😊",
    },
  ]);
});

test("gets story by numeric route id and rejects invalid ids", () => {
  assert.equal(getStoryByRouteId(sampleStories, "1"), sampleStories[0]);
  assert.equal(getStoryByRouteId(sampleStories, "abc"), null);
  assert.equal(getStoryByRouteId(sampleStories, "999"), null);
});
