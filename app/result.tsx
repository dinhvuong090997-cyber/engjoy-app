import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
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
} from "../src/constants";
import { questions } from "../src/db/seed";
import { buildResultModel, parseWrongAnswersParam } from "../src/quiz";

export default function ResultScreen() {
  const { score, total, wrongAnswers } = useLocalSearchParams<{
    score?: string;
    total?: string;
    wrongAnswers?: string;
  }>();
  const model = useMemo(
    () =>
      buildResultModel(questions, {
        score: parseNumberParam(score),
        total: parseNumberParam(total),
        wrongAnswers: parseWrongAnswersParam(wrongAnswers),
      }),
    [score, total, wrongAnswers]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Kết quả</Text>
          <Text style={styles.subtitle}>Hoàn thành bài quiz</Text>
        </View>

        <View style={styles.summaryCard}>
          <View
            style={[
              styles.percentageCircle,
              model.passed ? styles.passCircle : styles.failCircle,
            ]}
          >
            <Text
              style={[
                styles.percentageText,
                model.passed ? styles.passText : styles.failText,
              ]}
            >
              {model.percentage}%
            </Text>
          </View>

          <Text style={styles.scoreLabel}>{model.scoreLabel}</Text>
          <Text
            style={[
              styles.statusTitle,
              model.passed ? styles.passText : styles.failText,
            ]}
          >
            {model.statusTitle}
          </Text>
          <Text style={styles.statusMessage}>{model.statusMessage}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Câu sai</Text>
          {model.wrongAnswers.length === 0 ? (
            <View style={styles.emptyWrongCard}>
              <Text style={styles.emptyWrongIcon}>🎉</Text>
              <Text style={styles.emptyWrongText}>
                Không có câu sai nào trong bài này.
              </Text>
            </View>
          ) : (
            <View style={styles.wrongList}>
              {model.wrongAnswers.map((wrongAnswer) => (
                <View
                  key={`${wrongAnswer.question.id}-${wrongAnswer.selectedIndex}`}
                  style={styles.wrongCard}
                >
                  <Text style={styles.wrongQuestion}>
                    {wrongAnswer.question.content}
                  </Text>
                  <Text style={styles.wrongSelected}>
                    Bạn chọn: {wrongAnswer.selectedAnswer || "Không rõ"}
                  </Text>
                  <Text style={styles.wrongCorrect}>
                    Đáp án đúng: {wrongAnswer.correctAnswer}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.actionButton,
              styles.retryButton,
              pressed ? styles.pressedButton : null,
            ]}
          >
            <Text style={styles.retryButtonText}>Làm lại</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.replace("/(tabs)")}
            style={({ pressed }) => [
              styles.actionButton,
              styles.homeButton,
              pressed ? styles.pressedButton : null,
            ]}
          >
            <Text style={styles.homeButtonText}>Về trang chủ</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function parseNumberParam(value: string | string[] | undefined): number {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const parsed = Number(rawValue);

  return Number.isFinite(parsed) ? parsed : 0;
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
    marginBottom: SPACING.lg,
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
  summaryCard: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.xl,
  },
  percentageCircle: {
    alignItems: "center",
    borderRadius: BORDER_RADIUS.pill,
    borderWidth: 10,
    height: 150,
    justifyContent: "center",
    width: 150,
  },
  passCircle: {
    backgroundColor: COLORS.successLight,
    borderColor: COLORS.success,
  },
  failCircle: {
    backgroundColor: COLORS.dangerLight,
    borderColor: COLORS.danger,
  },
  percentageText: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: "900",
  },
  passText: {
    color: COLORS.success,
  },
  failText: {
    color: COLORS.danger,
  },
  scoreLabel: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xl,
    fontWeight: "900",
    marginTop: SPACING.lg,
  },
  statusTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "900",
    marginTop: SPACING.sm,
  },
  statusMessage: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    lineHeight: 22,
    marginTop: SPACING.xs,
    textAlign: "center",
  },
  section: {
    marginTop: SPACING.lg,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: "900",
    marginBottom: SPACING.md,
  },
  emptyWrongCard: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.lg,
  },
  emptyWrongIcon: {
    fontSize: FONT_SIZE.xxl,
  },
  emptyWrongText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    marginTop: SPACING.sm,
    textAlign: "center",
  },
  wrongList: {
    gap: SPACING.md,
  },
  wrongCard: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.lg,
  },
  wrongQuestion: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    fontWeight: "900",
    lineHeight: 22,
  },
  wrongSelected: {
    color: COLORS.danger,
    fontSize: FONT_SIZE.sm,
    fontWeight: "800",
    marginTop: SPACING.sm,
  },
  wrongCorrect: {
    color: COLORS.success,
    fontSize: FONT_SIZE.sm,
    fontWeight: "800",
    marginTop: SPACING.xs,
  },
  actions: {
    flexDirection: "row",
    gap: SPACING.md,
    marginTop: SPACING.xl,
  },
  actionButton: {
    alignItems: "center",
    borderRadius: BORDER_RADIUS.md,
    flex: 1,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: SPACING.md,
  },
  retryButton: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
  homeButton: {
    backgroundColor: COLORS.primary,
  },
  retryButtonText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.md,
    fontWeight: "900",
  },
  homeButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: "900",
  },
  pressedButton: {
    opacity: 0.72,
  },
});
