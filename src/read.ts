import { type Story } from "./types";

export type StoryCard = {
  id: string;
  routeId: string;
  title: string;
  levelLabel: string;
  thumbnail: string;
  color: string;
  emojiPreview: string;
  panelsText: string;
};

export function buildStoryCards(stories: Story[]): StoryCard[] {
  return stories.map((story) => ({
    id: String(story.id),
    routeId: String(story.id),
    title: story.title,
    levelLabel: "Mới",
    thumbnail: story.thumbnail,
    color: story.color,
    emojiPreview: story.panels
      .slice(0, 4)
      .map((panel) => panel.emoji)
      .join(" "),
    panelsText: story.panels.map((panel) => panel.en).join(". "),
  }));
}

export function getStoryByRouteId(
  stories: Story[],
  storyId: string | undefined
): Story | null {
  if (!storyId || !/^\d+$/.test(storyId)) {
    return null;
  }

  const id = Number(storyId);
  return stories.find((s) => s.id === id) ?? null;
}
