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
import { libraryStories } from "../../src/db/stories";
import { buildStoryCards, type StoryCard } from "../../src/read";

let Speech: any = null;
try {
  Speech = require("expo-speech");
} catch {}

export default function LibraryScreen() {
  const storyCards = useMemo(() => buildStoryCards(libraryStories), []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Thư Viện 📚</Text>
          <Text style={styles.subtitle}>
            Đọc và nghe những câu chuyện ngụ ngôn kinh điển bằng tiếng Anh.
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
    <View style={styles.storyCard}>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push(`/library/${story.routeId}`)}
        style={({ pressed }) => [
          styles.storyBody,
          pressed ? styles.pressedCard : null,
        ]}
      >
        <View style={styles.storyMainRow}>
          <View
            style={[
              styles.thumbnailTile,
              {
                backgroundColor: story.color,
                borderColor: story.color,
              },
            ]}
          >
            <Text style={styles.thumbnailEmoji}>{story.thumbnail}</Text>
          </View>
          <View style={styles.cardHeader}>
            <Text numberOfLines={2} style={styles.storyTitle}>
              {story.title}
            </Text>
            <Text style={styles.levelBadge}>{story.levelLabel}</Text>
          </View>
        </View>
      </Pressable>
      <View style={styles.actionRow}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push(`/library/${story.routeId}`)}
          style={({ pressed }) => [
            styles.actionButton,
            pressed ? styles.pressedCard : null,
          ]}
        >
          <Text style={styles.actionText}>📖 Đọc</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            Speech?.speak?.(story.panelsText);
          }}
          style={({ pressed }) => [
            styles.actionButton,
            pressed ? styles.pressedCard : null,
          ]}
        >
          <Text style={styles.actionText}>🎧 Nghe</Text>
        </Pressable>
      </View>
    </View>
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
    overflow: "hidden",
    width: "100%",
  },
  storyBody: {
    minHeight: 112,
    padding: SPACING.md,
  },
  pressedCard: {
    opacity: 0.72,
  },
  storyMainRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: SPACING.md,
  },
  thumbnailTile: {
    alignItems: "center",
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    height: 80,
    justifyContent: "center",
    width: 80,
  },
  thumbnailEmoji: {
    fontSize: 48,
    lineHeight: 58,
  },
  cardHeader: {
    flex: 1,
    gap: SPACING.sm,
  },
  storyTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: "900",
    lineHeight: 24,
    minHeight: 0,
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
  actionRow: {
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    flexDirection: "row",
  },
  actionButton: {
    alignItems: "center",
    flex: 1,
    paddingVertical: SPACING.sm,
  },
  actionText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.md,
    fontWeight: "900",
  },
});
