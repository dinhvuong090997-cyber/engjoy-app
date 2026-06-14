import * as Speech from "expo-speech";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
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
import { vocabulary } from "../../src/db/seed";
import { getVocabularyByTopic, isTopic } from "../../src/learn";
import { type Topic, type VocabWord } from "../../src/types";

type LearnTab = "vocabulary" | "flashcard";

const TOPIC_DETAILS: Record<Topic, { emoji: string; name: string }> = {
  animals: { emoji: "🐶", name: "Động vật" },
  body: { emoji: "👋", name: "Cơ thể" },
  clothes: { emoji: "👕", name: "Quần áo" },
  colors: { emoji: "🎨", name: "Màu sắc" },
  emotions: { emoji: "😊", name: "Cảm xúc" },
  family: { emoji: "👨‍👩‍👧", name: "Gia đình" },
  food: { emoji: "🍽️", name: "Đồ ăn" },
  fruits: { emoji: "🍎", name: "Trái cây" },
  house: { emoji: "🏠", name: "Ngôi nhà" },
  jobs: { emoji: "👩‍🏫", name: "Nghề nghiệp" },
  nature: { emoji: "🌳", name: "Thiên nhiên" },
  numbers: { emoji: "🔢", name: "Số đếm" },
  school: { emoji: "🎒", name: "Trường học" },
  shapes: { emoji: "🔷", name: "Hình dạng" },
  sports: { emoji: "⚽", name: "Thể thao" },
  toys: { emoji: "🧸", name: "Đồ chơi" },
  transport: { emoji: "🚗", name: "Giao thông" },
  vegetables: { emoji: "🥕", name: "Rau củ" },
  weather: { emoji: "☀️", name: "Thời tiết" },
  actions: { emoji: "🏃", name: "Hành động" },
};

export default function TopicDetailScreen() {
  const { topicId } = useLocalSearchParams<{ topicId?: string }>();
  const topicParam = topicId ?? "";
  const selectedTopic: Topic | null = isTopic(topicParam) ? topicParam : null;
  const details = selectedTopic
    ? TOPIC_DETAILS[selectedTopic]
    : { emoji: "📚", name: "Chủ đề" };
  const words = useMemo(
    () => getVocabularyByTopic(vocabulary, selectedTopic ?? ""),
    [selectedTopic]
  );
  const [activeTab, setActiveTab] = useState<LearnTab>("vocabulary");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentWord = words[currentIndex] ?? null;

  function speak(word: string) {
    Speech.stop();
    Speech.speak(word, {
      language: "en-US",
      rate: 0.85,
    });
  }

  function goToNextCard() {
    if (words.length === 0) {
      return;
    }

    setCurrentIndex((index) => (index + 1) % words.length);
    setIsFlipped(false);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
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
            <Text style={styles.topicEmoji}>{details.emoji}</Text>
            <View style={styles.headerTitleWrap}>
              <Text style={styles.title}>{details.name}</Text>
              <Text style={styles.subtitle}>{words.length} từ vựng</Text>
            </View>
          </View>
        </View>

        <View style={styles.tabSelector}>
          <TabButton
            isActive={activeTab === "vocabulary"}
            label="Từ vựng"
            onPress={() => setActiveTab("vocabulary")}
          />
          <TabButton
            isActive={activeTab === "flashcard"}
            label="Flashcard"
            onPress={() => setActiveTab("flashcard")}
          />
        </View>

        {words.length === 0 ? (
          <EmptyState />
        ) : activeTab === "vocabulary" ? (
          <FlatList
            contentContainerStyle={styles.listContent}
            data={words}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <VocabularyItem item={item} onSpeak={() => speak(item.word)} />
            )}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.flashcardContent}>
            {currentWord ? (
              <>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setIsFlipped((value) => !value)}
                  style={({ pressed }) => [
                    styles.flashcard,
                    pressed ? styles.pressedCard : null,
                  ]}
                >
                  <Text style={styles.flashcardEmoji}>{currentWord.emoji}</Text>
                  <Text style={styles.flashcardWord}>
                    {isFlipped ? currentWord.meaning_vi : currentWord.word}
                  </Text>
                  <Text style={styles.flashcardHint}>
                    {isFlipped ? "Chạm để xem tiếng Anh" : "Chạm để xem nghĩa"}
                  </Text>
                </Pressable>

                <View style={styles.flashcardActions}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={goToNextCard}
                    style={({ pressed }) => [
                      styles.reviewButton,
                      styles.needReviewButton,
                      pressed ? styles.pressedButton : null,
                    ]}
                  >
                    <Text style={styles.needReviewButtonText}>Cần ôn</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    onPress={goToNextCard}
                    style={({ pressed }) => [
                      styles.reviewButton,
                      styles.knownButton,
                      pressed ? styles.pressedButton : null,
                    ]}
                  >
                    <Text style={styles.knownButtonText}>Đã thuộc</Text>
                  </Pressable>
                </View>

                <Text style={styles.cardCounter}>
                  {currentIndex + 1}/{words.length}
                </Text>
              </>
            ) : null}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

function TabButton({
  isActive,
  label,
  onPress,
}: {
  isActive: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.tabButton, isActive ? styles.activeTabButton : null]}
    >
      <Text style={[styles.tabText, isActive ? styles.activeTabText : null]}>
        {label}
      </Text>
    </Pressable>
  );
}

function VocabularyItem({
  item,
  onSpeak,
}: {
  item: VocabWord;
  onSpeak: () => void;
}) {
  return (
    <View style={styles.wordItem}>
      <Text style={styles.wordEmoji}>{item.emoji}</Text>
      <View style={styles.wordTextWrap}>
        <Text style={styles.word}>{item.word}</Text>
        <Text style={styles.meaning}>{item.meaning_vi}</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={onSpeak}
        style={({ pressed }) => [
          styles.soundButton,
          pressed ? styles.pressedButton : null,
        ]}
      >
        <Text style={styles.soundButtonText}>🔊</Text>
      </Pressable>
    </View>
  );
}

function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>📭</Text>
      <Text style={styles.emptyText}>
        Chưa có dữ liệu từ vựng cho chủ đề này
      </Text>
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
    marginBottom: SPACING.lg,
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
    lineHeight: 34,
  },
  headerTextWrap: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: SPACING.md,
  },
  topicEmoji: {
    fontSize: FONT_SIZE.xxl,
  },
  headerTitleWrap: {
    flex: 1,
  },
  title: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xl,
    fontWeight: "900",
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.xs,
  },
  tabSelector: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    flexDirection: "row",
    gap: SPACING.xs,
    marginBottom: SPACING.lg,
    padding: SPACING.xs,
  },
  tabButton: {
    alignItems: "center",
    borderRadius: BORDER_RADIUS.full,
    flex: 1,
    justifyContent: "center",
    minHeight: 42,
  },
  activeTabButton: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    fontWeight: "800",
  },
  activeTabText: {
    color: COLORS.white,
  },
  listContent: {
    paddingBottom: SPACING.xl,
  },
  wordItem: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: SPACING.md,
    marginBottom: SPACING.md,
    padding: SPACING.md,
  },
  wordEmoji: {
    fontSize: FONT_SIZE.xxl,
  },
  wordTextWrap: {
    flex: 1,
  },
  word: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: "900",
  },
  meaning: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    marginTop: SPACING.xs,
  },
  soundButton: {
    alignItems: "center",
    backgroundColor: COLORS.secondaryLight,
    borderRadius: BORDER_RADIUS.full,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  soundButtonText: {
    fontSize: FONT_SIZE.lg,
  },
  emptyState: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    flex: 1,
    justifyContent: "center",
    padding: SPACING.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    textAlign: "center",
  },
  flashcardContent: {
    flex: 1,
  },
  flashcard: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 320,
    padding: SPACING.xl,
  },
  pressedCard: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
  flashcardEmoji: {
    fontSize: 72,
    marginBottom: SPACING.lg,
  },
  flashcardWord: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xxl,
    fontWeight: "900",
    textAlign: "center",
  },
  flashcardHint: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.md,
    textAlign: "center",
  },
  flashcardActions: {
    flexDirection: "row",
    gap: SPACING.md,
    marginTop: SPACING.lg,
  },
  reviewButton: {
    alignItems: "center",
    borderRadius: BORDER_RADIUS.lg,
    flex: 1,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: SPACING.md,
  },
  needReviewButton: {
    backgroundColor: COLORS.dangerLight,
  },
  knownButton: {
    backgroundColor: COLORS.success,
  },
  needReviewButtonText: {
    color: COLORS.danger,
    fontSize: FONT_SIZE.md,
    fontWeight: "900",
  },
  knownButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: "900",
  },
  cardCounter: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.md,
    textAlign: "center",
  },
  pressedButton: {
    opacity: 0.72,
  },
});
