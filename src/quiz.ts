import { type Question } from "./types";

export type QuizMode = "quick" | "topic" | "review";

export type WrongAnswerParam = {
  questionId: number;
  selectedIndex: number;
};

export type ResolvedWrongAnswer = {
  question: Question;
  selectedIndex: number;
  selectedAnswer: string;
  correctAnswer: string;
};

export type QuizQuestionModel = {
  mode: QuizMode;
  questions: Question[];
  emptyMessage: string;
};

export type ResultInput = {
  score: number;
  total: number;
  wrongAnswers: WrongAnswerParam[];
};

export type ResultModel = {
  scoreLabel: string;
  percentage: number;
  passed: boolean;
  statusTitle: string;
  statusMessage: string;
  wrongAnswers: ResolvedWrongAnswer[];
};

const EMPTY_MESSAGE = "Chưa có câu hỏi nào";
const PASS_PERCENTAGE = 70;

export function buildQuizQuestions(
  mode: string | undefined,
  sourceQuestions: Question[],
  options: { topic?: string; questionIds?: number[] } = {}
): QuizQuestionModel {
  const quizMode = toQuizMode(mode);
  let selectedQuestions = sourceQuestions;

  if (quizMode === "topic") {
    selectedQuestions = sourceQuestions.filter(
      (question) => question.topic === options.topic
    );
  }

  if (quizMode === "review") {
    const idSet = new Set(options.questionIds ?? []);
    selectedQuestions = sourceQuestions.filter((question) =>
      idSet.has(question.id)
    );
  }

  if (quizMode === "quick") {
    selectedQuestions = shuffleQuestions(selectedQuestions).slice(0, 10);
  }

  return {
    mode: quizMode,
    questions: selectedQuestions,
    emptyMessage: EMPTY_MESSAGE,
  };
}

export function buildResultModel(
  sourceQuestions: Question[],
  input: ResultInput
): ResultModel {
  const total = Math.max(0, input.total);
  const score = clamp(input.score, 0, total);
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const passed = percentage >= PASS_PERCENTAGE;

  return {
    scoreLabel: `${score}/${total} câu đúng`,
    percentage,
    passed,
    statusTitle: passed ? "Đạt rồi!" : "Cần luyện thêm",
    statusMessage: passed
      ? "Bạn đã vượt qua bài quiz hôm nay."
      : "Ôn lại các câu sai rồi thử lại nhé.",
    wrongAnswers: resolveWrongAnswers(sourceQuestions, input.wrongAnswers),
  };
}

export function parseWrongAnswersParam(
  value: string | string[] | undefined
): WrongAnswerParam[] {
  const rawValue = Array.isArray(value) ? value[0] : value;

  if (!rawValue) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(rawValue);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isWrongAnswerParam);
  } catch {
    return [];
  }
}

export function parseQuestionIdsParam(
  value: string | string[] | undefined
): number[] {
  const rawValue = Array.isArray(value) ? value[0] : value;

  if (!rawValue) {
    return [];
  }

  return rawValue
    .split(",")
    .map((id) => Number(id))
    .filter((id) => Number.isInteger(id));
}

function toQuizMode(mode: string | undefined): QuizMode {
  if (mode === "topic" || mode === "review") {
    return mode;
  }

  return "quick";
}

function shuffleQuestions(sourceQuestions: Question[]): Question[] {
  return [...sourceQuestions].sort(() => Math.random() - 0.5);
}

function resolveWrongAnswers(
  sourceQuestions: Question[],
  wrongAnswers: WrongAnswerParam[]
): ResolvedWrongAnswer[] {
  return wrongAnswers.flatMap((wrongAnswer) => {
    const question = sourceQuestions.find(
      (item) => item.id === wrongAnswer.questionId
    );

    if (!question) {
      return [];
    }

    return [
      {
        question,
        selectedIndex: wrongAnswer.selectedIndex,
        selectedAnswer: question.options[wrongAnswer.selectedIndex] ?? "",
        correctAnswer: question.options[question.correct_index] ?? "",
      },
    ];
  });
}

function isWrongAnswerParam(value: unknown): value is WrongAnswerParam {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    Number.isInteger(candidate.questionId) &&
    Number.isInteger(candidate.selectedIndex)
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
