import { COLORS } from "./constants";
import { type VocabWord } from "./types";

export type PracticeGame = {
  id: "listen-choose" | "fill-letter" | "match-pairs";
  title: string;
  description: string;
  emoji: string;
  accentColor: string;
  previewWords: string[];
  isLocked: boolean;
};

export type PracticeModel = {
  hasVocabulary: boolean;
  vocabularyCount: number;
  games: PracticeGame[];
  emptyState: {
    title: string;
    message: string;
  };
};

const GAME_COPY: Array<Omit<PracticeGame, "previewWords" | "isLocked">> = [
  {
    id: "listen-choose",
    title: "Nghe và chọn",
    description: "Nghe từ tiếng Anh rồi chọn nghĩa đúng.",
    emoji: "🔊",
    accentColor: COLORS.primary,
  },
  {
    id: "fill-letter",
    title: "Điền chữ cái",
    description: "Nhìn gợi ý và điền chữ còn thiếu.",
    emoji: "✏️",
    accentColor: COLORS.secondary,
  },
  {
    id: "match-pairs",
    title: "Ghép cặp",
    description: "Ghép từ tiếng Anh với nghĩa tiếng Việt.",
    emoji: "🧩",
    accentColor: COLORS.warning,
  },
];

export function buildPracticeModel(vocabulary: VocabWord[]): PracticeModel {
  const previewVocabulary = vocabulary.slice(0, 3);
  const hasVocabulary = vocabulary.length > 0;

  return {
    hasVocabulary,
    vocabularyCount: vocabulary.length,
    games: GAME_COPY.map((game) => ({
      ...game,
      previewWords: buildPreviewWords(game.id, previewVocabulary),
      isLocked: !hasVocabulary,
    })),
    emptyState: {
      title: "Chưa có từ vựng để luyện tập",
      message:
        "Hãy thêm dữ liệu từ vựng trong seed để mở các trò chơi luyện tập.",
    },
  };
}

function buildPreviewWords(
  gameId: PracticeGame["id"],
  vocabulary: VocabWord[]
): string[] {
  if (gameId === "fill-letter") {
    return vocabulary.map((word) => maskMiddleLetter(word.word));
  }

  if (gameId === "match-pairs") {
    return vocabulary.map((word) => `${word.word} - ${word.meaning_vi}`);
  }

  return vocabulary.map((word) => word.word);
}

function maskMiddleLetter(word: string): string {
  if (word.length < 3) {
    return `${word[0] ?? ""}_`;
  }

  const middleIndex = Math.floor(word.length / 2);
  return `${word.slice(0, middleIndex)}_${word.slice(middleIndex + 1)}`;
}
