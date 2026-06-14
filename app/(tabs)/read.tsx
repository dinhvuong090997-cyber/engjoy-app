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
import { stories } from "../../src/db/seed";
import { buildStoryCards, type StoryCard } from "../../src/read";

export default function ReadScreen() {
  const storyCards = useMemo(() => buildStoryCards(stories), []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Truyện EngJoy 📖</Text>
          <Text style={styles.subtitle}>
            Đọc truyện song ngữ với tranh emoji vui nhộn.
          </Text>
        </View>

        {storyCards.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📖</Text>
            <Text style={styles.emptyText}>
              Chưa có truyện nào. Quay lại sau!
            </Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {storyCards.map((story) => (
              <StoryCardItem key={story.id} story={story} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function StoryCardItem({ story }: { story: StoryCard }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(`/read/${story.routeId}`)}
      style={({ pressed }) => [
        styles.storyCard,
        pressed ? styles.pressedCard : null,
      ]}
    >
      <View style={styles.cardHeader}>
        <Text numberOfLines={2} style={styles.storyTitle}>
          {story.title}
        </Text>
        <Text style={styles.levelBadge}>{story.levelLabel}</Text>
      </View>
      <Text numberOfLines={2} style={styles.emojiPreview}>
        {story.emojiPreview}
      </Text>
    </Pressable>
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
    lineHeight: 22,
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
    marginBottom: SPACING.sm,
  },
  emptyText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    fontWeight: "800",
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.md,
  },
  storyCard: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    minHeight: 154,
    padding: SPACING.md,
    width: "47.8%",
  },
  pressedCard: {
    opacity: 0.72,
    transform: [{ scale: 0.98 }],
  },
  cardHeader: {
    gap: SPACING.sm,
  },
  storyTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: "900",
    lineHeight: 24,
    minHeight: 48,
  },
  levelBadge: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.secondaryLight,
    borderRadius: BORDER_RADIUS.pill,
    color: COLORS.secondary,
    fontSize: FONT_SIZE.xs,
    fontWeight: "900",
    overflow: "hidden",
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  emojiPreview: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xxl,
    lineHeight: 42,
    marginTop: "auto",
  },
});
