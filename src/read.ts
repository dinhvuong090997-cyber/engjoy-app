import { type Story } from "./types";

export type StoryCard = {
  id: string;
  routeId: string;
  title: string;
  levelLabel: string;
  emojiPreview: string;
};

export function buildStoryCards(stories: Story[]): StoryCard[] {
  return stories.map((story, index) => ({
    id: String(index),
    routeId: String(index),
    title: story.title,
    levelLabel: `Level ${story.level}`,
    emojiPreview: story.panels
      .slice(0, 4)
      .map((panel) => panel.emoji)
      .join(" "),
  }));
}

export function getStoryByRouteId(
  stories: Story[],
  storyId: string | undefined
): Story | null {
  if (!storyId || !/^\d+$/.test(storyId)) {
    return null;
  }

  return stories[Number(storyId)] ?? null;
}
