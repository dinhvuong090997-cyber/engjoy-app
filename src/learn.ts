import { TOPICS, type Topic, type VocabWord } from "./types";

export type LearnTopicProgress = {
  id: Topic;
  learnedCount: number;
  totalCount: number;
};

export function buildLearnTopicProgress(
  vocabulary: VocabWord[]
): LearnTopicProgress[] {
  const totals = new Map<Topic, number>();

  for (const word of vocabulary) {
    if (!isTopic(word.topic)) {
      continue;
    }

    totals.set(word.topic, (totals.get(word.topic) ?? 0) + 1);
  }

  return TOPICS.map((topic) => ({
    id: topic,
    learnedCount: 0,
    totalCount: totals.get(topic) ?? 0,
  }));
}

export function getVocabularyByTopic(
  vocabulary: VocabWord[],
  topicId: string
): VocabWord[] {
  if (!isTopic(topicId)) {
    return [];
  }

  return vocabulary.filter((word) => word.topic === topicId);
}

export function isTopic(value: string): value is Topic {
  return TOPICS.includes(value as Topic);
}
