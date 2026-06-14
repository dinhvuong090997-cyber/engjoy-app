import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  BORDER_RADIUS,
  COLORS,
  FONT_SIZE,
  SPACING,
} from "../../src/constants";
import { questions } from "../../src/db/seed";
import {
  buildQuizQuestions,
  parseQuestionIdsParam,
  type WrongAnswerParam,
} from "../../src/quiz";

export default function QuizScreen() {
  const { mode, topic, questionIds } = useLocalSearchParams<{
    mode?: string;
    topic?: string;
    questionIds?: string;
  }>();
  const model = useMemo(
    () =>
      buildQuizQuestions(mode, questions, {
        topic,
        questionIds: parseQuestionIdsParam(questionIds),
      }),
    [mode, questionIds, topic]
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswerParam[]>([]);

  const currentQuestion = model.questions[currentIndex] ?? null;
  const hasQuestions = model.questions.length > 0;

  function handleSelect(optionIndex: number) {
    if (!currentQuestion || selectedIndex !== null) {
      return;
    }

    const isCorrect = optionIndex === currentQuestion.correct_index;
    const nextScore = isCorrect ? score + 1 : score;
    const nextWrongAnswers = isCorrect
      ? wrongAnswers
      : [
          ...wrongAnswers,
          { questionId: currentQuestion.id, selectedIndex: optionIndex },
        ];

    setSelectedIndex(optionIndex);
    setScore(nextScore);
    setWrongAnswers(nextWrongAnswers);

    setTimeout(() => {
      const nextQuestionIndex = currentIndex + 1;

      if (nextQuestionIndex >= model.questions.length) {
        router.replace({
          pathname: "/result",
          params: {
            score: String(nextScore),
            total: String(model.questions.length),
            wrongAnswers: JSON.stringify(nextWrongAnswers),
          },
        });
        return;
      }

      setCurrentIndex(nextQuestionIndex);
      setSelectedIndex(null);
    }, 1000);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              pressed ? styles.pressedButton : null,
            ]}
          >
            <Text style={styles.backButtonText}>‹</Text>
          </Pressable>
          <View style={styles.headerTextWrap}>
            <Text style={styles.title}>Quiz</Text>
            <Text style={styles.subtitle}>{getModeLabel(model.mode)}</Text>
          </View>
        </View>

        {!hasQuestions ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Text style={styles.emptyTitle}>{model.emptyMessage}</Text>
            <Text style={styles.emptyMessage}>
              Thêm câu hỏi vào seed data để bắt đầu làm quiz.
            </Text>
          </View>
        ) : null}

        {currentQuestion ? (
          <View style={styles.quizCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>
                Câu {currentIndex + 1}/{model.questions.length}
              </Text>
              <Text style={styles.scorePill}>{score} đúng</Text>
            </View>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${
                      ((currentIndex + 1) / model.questions.length) * 100
                    }%`,
                  },
                ]}
              />
            </View>

            <Text style={styles.questionText}>{currentQuestion.content}</Text>

            <View style={styles.optionList}>
              {currentQuestion.options.map((option, optionIndex) => {
                const state = getOptionState({
                  correctIndex: currentQuestion.correct_index,
                  optionIndex,
                  selectedIndex,
                });

                return (
                  <Pressable
                    accessibilityRole="button"
                    disabled={selectedIndex !== null}
                    key={`${currentQuestion.id}-${option}`}
                    onPress={() => handleSelect(optionIndex)}
                    style={({ pressed }) => [
                      styles.optionButton,
                      state === "correct" ? styles.correctOption : null,
                      state === "wrong" ? styles.wrongOption : null,
                      pressed ? styles.pressedButton : null,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        state === "correct" ? styles.correctOptionText : null,
                        state === "wrong" ? styles.wrongOptionText : null,
                      ]}
                    >
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function getModeLabel(mode: string): string {
  if (mode === "topic") {
    return "Theo chủ đề";
  }

  if (mode === "review") {
    return "Ôn câu sai";
  }

  return "Nhanh 10 câu";
}

function getOptionState({
  correctIndex,
  optionIndex,
  selectedIndex,
}: {
  correctIndex: number;
  optionIndex: number;
  selectedIndex: number | null;
}): "idle" | "correct" | "wrong" {
  if (selectedIndex === null) {
    return "idle";
  }

  if (optionIndex === correctIndex) {
    return "correct";
  }

  if (optionIndex === selectedIndex) {
    return "wrong";
  }

  return "idle";
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xl + 80,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  backButton: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.pill,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  backButtonText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xl,
    fontWeight: "900",
    lineHeight: FONT_SIZE.xl,
  },
  headerTextWrap: {
    flex: 1,
  },
  title: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xxl,
    fontWeight: "900",
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    marginTop: SPACING.xs,
  },
  emptyCard: {
    alignItems: "center",
    backgroundColor: COLORS.warningLight,
    borderColor: COLORS.warning,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.xl,
  },
  emptyIcon: {
    fontSize: FONT_SIZE.xxl,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: "900",
    marginTop: SPACING.sm,
    textAlign: "center",
  },
  emptyMessage: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    lineHeight: 20,
    marginTop: SPACING.xs,
    textAlign: "center",
  },
  quizCard: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.lg,
  },
  progressHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    fontWeight: "800",
  },
  scorePill: {
    backgroundColor: COLORS.secondaryLight,
    borderRadius: BORDER_RADIUS.pill,
    color: COLORS.secondary,
    fontSize: FONT_SIZE.sm,
    fontWeight: "900",
    overflow: "hidden",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  progressTrack: {
    backgroundColor: COLORS.border,
    borderRadius: BORDER_RADIUS.pill,
    height: 10,
    marginTop: SPACING.md,
    overflow: "hidden",
  },
  progressFill: {
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.pill,
    height: "100%",
  },
  questionText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xl,
    fontWeight: "900",
    lineHeight: 30,
    marginTop: SPACING.xl,
  },
  optionList: {
    gap: SPACING.md,
    marginTop: SPACING.xl,
  },
  optionButton: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    padding: SPACING.lg,
  },
  optionText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    fontWeight: "800",
  },
  correctOption: {
    backgroundColor: COLORS.successLight,
    borderColor: COLORS.success,
  },
  correctOptionText: {
    color: COLORS.success,
  },
  wrongOption: {
    backgroundColor: COLORS.dangerLight,
    borderColor: COLORS.danger,
  },
  wrongOptionText: {
    color: COLORS.danger,
  },
  pressedButton: {
    opacity: 0.72,
  },
});
