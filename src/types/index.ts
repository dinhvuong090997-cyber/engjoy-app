export interface VocabWord {
  id: number;
  word: string;
  meaning_vi: string;
  emoji: string;
  topic: string;
  level: number;
  example_en: string;
  example_vi: string;
  part_of_speech: string;
}

export interface Question {
  id: number;
  content: string;
  options: string[];
  correct_index: number;
  type: "mcq" | "truefalse" | "fill_listen" | "fill_spell";
  topic: string;
  level: number;
  explanation_vi: string;
}

export interface StoryPanel {
  en: string;
  vi: string;
  emoji: string;
}

export interface Story {
  id: number;
  title: string;
  title_vi: string;
  thumbnail: string;
  color: string;
  panels: StoryPanel[];
}

export type QuestionType = Question["type"];

export interface CardProgress {
  userId: string;
  questionId: number;
  repetitions: number;
  easeFactor: number;
  interval: number;
  dueDate: string;
  correctCount: number;
  totalAttempts: number;
}

export interface UserStats {
  userId: string;
  totalXp: number;
  level: number;
  streakDays: number;
  longestStreak: number;
  lastStudyDate: string;
  dailyGoalProgress: number;
  dailyGoalTarget: number;
  wordsLearned: number;
  quizzesDone: number;
  storiesRead: number;
}

export interface QuizSession {
  id: string;
  userId: string;
  questions: Question[];
  answers: Record<number, number>;
  score: number;
  totalQuestions: number;
  passed: boolean;
  topic: string;
  durationSeconds: number;
  completedAt: string;
}

export const TOPICS = [
  "animals", "body", "clothes", "colors", "emotions", "family",
  "food", "fruits", "house", "jobs", "nature", "numbers",
  "school", "shapes", "sports", "toys", "transport",
  "vegetables", "weather", "actions"
] as const;

export type Topic = (typeof TOPICS)[number];

export const LEVEL_NAMES: Record<number, string> = {
  0: "Mới bắt đầu",
  1: "Bắt đầu",
  2: "Cơ bản",
  3: "Trung cấp",
  4: "Khá",
  5: "Nâng cao",
};
