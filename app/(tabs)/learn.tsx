import { router } from "expo-router";
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
} from "../../src/constants";
import { vocabulary } from "../../src/db/seed";
import { buildLearnTopicProgress } from "../../src/learn";
import { type Topic } from "../../src/types";

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

export default function LearnScreen() {
  const topics = useMemo(() => buildLearnTopicProgress(vocabulary), []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Học từ vựng</Text>
          <Text style={styles.subtitle}>Chọn chủ đề để bắt đầu học.</Text>
        </View>

        <View style={styles.grid}>
          {topics.map((topic) => {
            const details = TOPIC_DETAILS[topic.id];
            const progressRatio =
              topic.totalCount > 0 ? topic.learnedCount / topic.totalCount : 0;

            return (
              <Pressable
                accessibilityRole="button"
                key={topic.id}
                onPress={() => router.push(`/learn/${topic.id}`)}
                style={({ pressed }) => [
                  styles.topicCard,
                  pressed ? styles.pressedCard : null,
                ]}
              >
                <Text style={styles.topicEmoji}>{details.emoji}</Text>
                <Text numberOfLines={1} style={styles.topicName}>
                  {details.name}
                </Text>
                <Text style={styles.progressText}>
                  {topic.learnedCount}/{topic.totalCount} từ đã học
                </Text>
                <View
                  accessibilityLabel={`${topic.learnedCount}/${topic.totalCount} từ đã học`}
                  accessibilityRole="progressbar"
                  style={styles.progressTrack}
                >
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${progressRatio * 100}%` },
                    ]}
                  />
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.md,
  },
  topicCard: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    minHeight: 152,
    padding: SPACING.md,
    width: "47.8%",
  },
  pressedCard: {
    opacity: 0.72,
    transform: [{ scale: 0.98 }],
  },
  topicEmoji: {
    fontSize: FONT_SIZE.xxl,
    marginBottom: SPACING.sm,
  },
  topicName: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: "900",
  },
  progressText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.xs,
  },
  progressTrack: {
    backgroundColor: COLORS.border,
    borderRadius: BORDER_RADIUS.full,
    height: 8,
    marginTop: SPACING.md,
    overflow: "hidden",
  },
  progressFill: {
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.full,
    height: "100%",
  },
});
