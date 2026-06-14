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
import { buildPracticeModel, type PracticeGame } from "../../src/practice";

export default function PracticeScreen() {
  const model = useMemo(() => buildPracticeModel(vocabulary), []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Luyện tập</Text>
          <Text style={styles.subtitle}>
            Chơi mini game để nhớ từ vựng lâu hơn.
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryIconWrap}>
            <Text style={styles.summaryIcon}>🎮</Text>
          </View>
          <View style={styles.summaryTextWrap}>
            <Text style={styles.summaryTitle}>3 trò chơi nhỏ</Text>
            <Text style={styles.summarySubtitle}>
              {model.vocabularyCount} từ vựng sẵn sàng luyện tập
            </Text>
          </View>
        </View>

        {!model.hasVocabulary ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyTitle}>{model.emptyState.title}</Text>
            <Text style={styles.emptyMessage}>{model.emptyState.message}</Text>
          </View>
        ) : null}

        <View style={styles.gameList}>
          {model.games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function GameCard({ game }: { game: PracticeGame }) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={game.isLocked}
      style={({ pressed }) => [
        styles.gameCard,
        game.isLocked ? styles.lockedCard : null,
        pressed && !game.isLocked ? styles.pressedCard : null,
      ]}
    >
      <View style={styles.gameHeader}>
        <View
          style={[
            styles.gameIconWrap,
            { backgroundColor: `${game.accentColor}22` },
          ]}
        >
          <Text style={styles.gameIcon}>{game.emoji}</Text>
        </View>
        <View style={styles.gameTitleWrap}>
          <Text style={styles.gameTitle}>{game.title}</Text>
          <Text style={styles.gameDescription}>{game.description}</Text>
        </View>
        <Text style={styles.gameArrow}>{game.isLocked ? "🔒" : "›"}</Text>
      </View>

      <View style={styles.previewRow}>
        {game.previewWords.length > 0 ? (
          game.previewWords.map((word) => (
            <Text
              key={`${game.id}-${word}`}
              numberOfLines={1}
              style={[
                styles.previewPill,
                { borderColor: game.accentColor, color: game.accentColor },
              ]}
            >
              {word}
            </Text>
          ))
        ) : (
          <Text style={styles.lockedText}>Cần có từ vựng để mở trò chơi</Text>
        )}
      </View>
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
    marginTop: SPACING.xs,
  },
  summaryCard: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderColor: COLORS.secondaryLight,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: SPACING.md,
    marginBottom: SPACING.md,
    padding: SPACING.lg,
  },
  summaryIconWrap: {
    alignItems: "center",
    backgroundColor: COLORS.secondaryLight,
    borderRadius: BORDER_RADIUS.full,
    height: 58,
    justifyContent: "center",
    width: 58,
  },
  summaryIcon: {
    fontSize: FONT_SIZE.xl,
  },
  summaryTextWrap: {
    flex: 1,
  },
  summaryTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: "900",
  },
  summarySubtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.xs,
  },
  emptyCard: {
    alignItems: "center",
    backgroundColor: COLORS.warningLight,
    borderColor: COLORS.warning,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    marginBottom: SPACING.md,
    padding: SPACING.lg,
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
  gameList: {
    gap: SPACING.md,
  },
  gameCard: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.lg,
  },
  lockedCard: {
    opacity: 0.72,
  },
  pressedCard: {
    opacity: 0.72,
    transform: [{ scale: 0.98 }],
  },
  gameHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: SPACING.md,
  },
  gameIconWrap: {
    alignItems: "center",
    borderRadius: BORDER_RADIUS.full,
    height: 54,
    justifyContent: "center",
    width: 54,
  },
  gameIcon: {
    fontSize: FONT_SIZE.xl,
  },
  gameTitleWrap: {
    flex: 1,
  },
  gameTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: "900",
  },
  gameDescription: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    lineHeight: 20,
    marginTop: SPACING.xs,
  },
  gameArrow: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xl,
    fontWeight: "900",
  },
  previewRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  previewPill: {
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    fontSize: FONT_SIZE.sm,
    fontWeight: "800",
    maxWidth: "100%",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  lockedText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
  },
});
