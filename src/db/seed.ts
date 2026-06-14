import type { SQLiteDatabase } from "expo-sqlite";

import { TOPICS, type Question, type Story, type VocabWord } from "../types";

export const vocabulary: VocabWord[] = [];
export const questions: Question[] = [];
export const stories: Story[] = [];
export const topics: string[] = [...TOPICS];

export async function seedDatabase(_db: SQLiteDatabase): Promise<void> {
  return;
}
