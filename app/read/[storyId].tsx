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
import { stories } from "../../src/db/seed";
import { getStoryByRouteId } from "../../src/read";
import { type StoryQuestion } from "../../src/types";

export default function StoryReaderScreen() {
  const { storyId } = useLocalSearchParams<{ storyId?: string }>();
  const story = useMemo(() => getStoryByRouteId(stories, storyId), [storyId]);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  if (!story) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Header title="Truyện EngJoy" />
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📖</Text>
            <Text style={styles.emptyTitle}>Chưa có truyện nào.</Text>
            <Text style={styles.emptyText}>
              Truyện này chưa sẵn sàng. Hãy quay lại thư viện sau nhé!
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header title={story.title} />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {story.panels.map((panel, index) => (
            <View key={`${panel.en}-${index}`} style={styles.panelCard}>
              <Text style={styles.panelEmoji}>{panel.emoji}</Text>
              <Text style={styles.panelEnglish}>{panel.en}</Text>
              <Text style={styles.panelVietnamese}>{panel.vi}</Text>
            </View>
          ))}

          <View style={styles.questionsSection}>
            <Text style={styles.sectionTitle}>Câu hỏi đọc hiểu</Text>
            {story.questions.length === 0 ? (
              <View style={styles.emptyQuestionCard}>
                <Text style={styles.emptyText}>
                  Truyện này chưa có câu hỏi đọc hiểu.
                </Text>
              </View>
            ) : (
              story.questions.map((question, index) => (
                <QuestionCard
                  answer={answers[index]}
                  key={`${question.content}-${index}`}
                  onAnswer={(optionIndex) =>
                    setAnswers((currentAnswers) => ({
                      ...currentAnswers,
                      [index]: optionIndex,
                    }))
                  }
                  question={question}
                  questionNumber={index + 1}
                />
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function Header({ title }: { title: string }) {
  return (
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
      <Text numberOfLines={2} style={styles.title}>
        {title}
      </Text>
    </View>
  );
}

function QuestionCard({
  answer,
  onAnswer,
  question,
  questionNumber,
}: {
  answer: number | undefined;
  onAnswer: (optionIndex: number) => void;
  question: StoryQuestion;
  questionNumber: number;
}) {
  const isAnswered = answer !== undefined;
  const isCorrect = answer === question.correct_index;

  return (
    <View style={styles.questionCard}>
      <Text style={styles.questionTitle}>
        {questionNumber}. {question.content}
      </Text>
      <View style={styles.optionList}>
        {question.options.map((option, index) => {
          const isSelected = answer === index;
          const showCorrect = isAnswered && index === question.correct_index;

          return (
            <Pressable
              accessibilityRole="button"
              key={`${option}-${index}`}
              onPress={() => onAnswer(index)}
              style={({ pressed }) => [
                styles.optionButton,
                showCorrect ? styles.correctOption : null,
                isSelected && !isCorrect ? styles.wrongOption : null,
                pressed ? styles.pressedButton : null,
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  showCorrect ? styles.correctOptionText : null,
                  isSelected && !isCorrect ? styles.wrongOptionText : null,
                ]}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {isAnswered ? (
        <Text
          style={[
            styles.feedbackText,
            isCorrect ? styles.correctFeedback : styles.wrongFeedback,
          ]}
        >
          {isCorrect ? "Đúng rồi!" : "Chưa đúng, xem đáp án màu xanh nhé."}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  container: {
    flex: 1,
    padding: SPACING.lg,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  backButton: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  backButtonText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xxl,
    fontWeight: "900",
    lineHeight: 34,
  },
  pressedButton: {
    opacity: 0.72,
  },
  title: {
    color: COLORS.text,
    flex: 1,
    fontSize: FONT_SIZE.xl,
    fontWeight: "900",
    lineHeight: 30,
  },
  content: {
    paddingBottom: SPACING.xl,
  },
  panelCard: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    marginBottom: SPACING.md,
    padding: SPACING.lg,
  },
  panelEmoji: {
    fontSize: 72,
    lineHeight: 88,
    marginBottom: SPACING.md,
    textAlign: "center",
  },
  panelEnglish: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xl,
    fontWeight: "900",
    lineHeight: 30,
    textAlign: "center",
  },
  panelVietnamese: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    lineHeight: 22,
    marginTop: SPACING.sm,
    textAlign: "center",
  },
  questionsSection: {
    marginTop: SPACING.sm,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: "900",
    marginBottom: SPACING.md,
  },
  questionCard: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    marginBottom: SPACING.md,
    padding: SPACING.lg,
  },
  questionTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    fontWeight: "900",
    lineHeight: 22,
  },
  optionList: {
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  optionButton: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    padding: SPACING.md,
  },
  correctOption: {
    backgroundColor: COLORS.successLight,
    borderColor: COLORS.success,
  },
  wrongOption: {
    backgroundColor: COLORS.dangerLight,
    borderColor: COLORS.danger,
  },
  optionText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    fontWeight: "800",
  },
  correctOptionText: {
    color: COLORS.success,
  },
  wrongOptionText: {
    color: COLORS.danger,
  },
  feedbackText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "900",
    marginTop: SPACING.md,
  },
  correctFeedback: {
    color: COLORS.success,
  },
  wrongFeedback: {
    color: COLORS.danger,
  },
  emptyCard: {
    alignItems: "center",
    backgroundColor: COLORS.warningLight,
    borderColor: COLORS.warning,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.xl,
  },
  emptyQuestionCard: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.lg,
  },
  emptyIcon: {
    fontSize: FONT_SIZE.xxl,
    marginBottom: SPACING.sm,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: "900",
    marginBottom: SPACING.xs,
    textAlign: "center",
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    lineHeight: 22,
    textAlign: "center",
  },
});
