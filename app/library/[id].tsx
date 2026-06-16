import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
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
import { libraryStories } from "../../src/db/stories";
import { getStoryByRouteId } from "../../src/read";

let Speech: any = null;
try {
  Speech = require("expo-speech");
} catch {}

export default function StoryReaderScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const story = useMemo(() => getStoryByRouteId(libraryStories, id), [id]);
  const [pageIndex, setPageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const speakStory = useCallback(() => {
    if (!story || !Speech?.speak) return;
    setIsPlaying(true);
    Speech.speak(story.panels.map((p) => p.en).join(". "), {
      onDone: () => setIsPlaying(false),
    });
  }, [story]);

  const speakPanel = useCallback(
    (text: string) => {
      if (!Speech?.speak) return;
      Speech.speak(text);
    },
    []
  );

  if (!story) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Header title="" />
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

  const totalPages = story.panels.length;
  const currentPanel = story.panels[pageIndex];
  const progressPercent =
    totalPages === 0 ? 0 : ((pageIndex + 1) / totalPages) * 100;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header title={story.title} onSpeakAll={speakStory} isPlaying={isPlaying} />

        <View style={[styles.storyBanner, { backgroundColor: story.color }]}>
          <Text style={styles.bannerEmoji}>{story.thumbnail}</Text>
          <View style={styles.bannerTextGroup}>
            <Text numberOfLines={1} style={styles.bannerTitle}>
              {story.title}
            </Text>
            <Text numberOfLines={1} style={styles.bannerSubtitle}>
              {story.title_vi}
            </Text>
          </View>
        </View>

        <View style={styles.pageCard}>
          <Text style={styles.panelEmoji}>{currentPanel.emoji}</Text>
          <Text
            style={styles.panelEnglish}
            onPress={() => speakPanel(currentPanel.en)}
          >
            {currentPanel.en}
          </Text>
          <Text style={styles.panelVietnamese}>{currentPanel.vi}</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>
              Trang {pageIndex + 1} / {totalPages}
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
          <View style={styles.navigationRow}>
            <Pressable
              accessibilityRole="button"
              disabled={pageIndex === 0}
              onPress={() => setPageIndex((p) => Math.max(0, p - 1))}
              style={({ pressed }) => [
                styles.navButton,
                pageIndex === 0 ? styles.disabledButton : null,
                pressed ? styles.pressedButton : null,
              ]}
            >
              <Text style={styles.navButtonText}>‹</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              disabled={pageIndex >= totalPages - 1}
              onPress={() =>
                setPageIndex((p) => Math.min(totalPages - 1, p + 1))
              }
              style={({ pressed }) => [
                styles.navButton,
                pageIndex >= totalPages - 1 ? styles.disabledButton : null,
                pressed ? styles.pressedButton : null,
              ]}
            >
              <Text style={styles.navButtonText}>›</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function Header({
  title,
  onSpeakAll,
  isPlaying,
}: {
  title: string;
  onSpeakAll?: () => void;
  isPlaying?: boolean;
}) {
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
      {onSpeakAll ? (
        <Pressable
          accessibilityRole="button"
          onPress={onSpeakAll}
          style={({ pressed }) => [
            styles.speakButton,
            pressed ? styles.pressedButton : null,
          ]}
        >
          <Text style={styles.speakButtonText}>
            {isPlaying ? "⏹️" : "🔊"}
          </Text>
        </Pressable>
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
    borderRadius: BORDER_RADIUS.pill,
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
  speakButton: {
    alignItems: "center",
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.pill,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  speakButtonText: {
    fontSize: FONT_SIZE.xl,
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
  storyBanner: {
    alignItems: "center",
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: SPACING.md,
    marginBottom: SPACING.md,
    padding: SPACING.md,
  },
  bannerEmoji: {
    fontSize: 48,
    lineHeight: 58,
  },
  bannerTextGroup: {
    flex: 1,
  },
  bannerTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: "900",
    lineHeight: 26,
  },
  bannerSubtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    fontWeight: "800",
    lineHeight: 22,
    marginTop: SPACING.xs,
  },
  pageCard: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    flex: 1,
    justifyContent: "center",
    padding: SPACING.xl,
  },
  panelEmoji: {
    fontSize: 60,
    lineHeight: 72,
    marginBottom: SPACING.lg,
    textAlign: "center",
  },
  panelEnglish: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xxl,
    fontWeight: "900",
    lineHeight: 40,
    textAlign: "center",
  },
  panelVietnamese: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    lineHeight: 28,
    marginTop: SPACING.md,
    textAlign: "center",
  },
  footer: {
    backgroundColor: COLORS.background,
    paddingTop: SPACING.md,
  },
  progressHeader: {
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  progressText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    fontWeight: "900",
  },
  progressTrack: {
    backgroundColor: COLORS.border,
    borderRadius: BORDER_RADIUS.pill,
    height: 8,
    overflow: "hidden",
  },
  progressFill: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.pill,
    height: "100%",
  },
  navigationRow: {
    flexDirection: "row",
    gap: SPACING.md,
    justifyContent: "space-between",
    marginTop: SPACING.md,
  },
  navButton: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.pill,
    borderWidth: 1,
    flex: 1,
    height: 52,
    justifyContent: "center",
  },
  navButtonText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xxl,
    fontWeight: "900",
    lineHeight: 36,
  },
  disabledButton: {
    opacity: 0.35,
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
