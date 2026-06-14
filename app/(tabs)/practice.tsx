import { router } from "expo-router";
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

type GameCard = {
  emoji: string;
  title: string;
  description: string;
  mode: "listen-choose" | "fill-letter" | "match-pairs";
};

const GAME_CARDS: GameCard[] = [
  {
    emoji: "🎧",
    title: "Nghe và chọn",
    description: "Nghe từ tiếng Anh và chọn đáp án đúng",
    mode: "listen-choose",
  },
  {
    emoji: "✏️",
    title: "Điền chữ",
    description: "Nhìn hình và điền chữ cái còn thiếu",
    mode: "fill-letter",
  },
  {
    emoji: "🧩",
    title: "Ghép cặp",
    description: "Nối từ tiếng Anh với nghĩa tiếng Việt",
    mode: "match-pairs",
  },
];

export default function PracticeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Luyện tập 🎮</Text>

        <View style={styles.gameList}>
          {GAME_CARDS.map((game) => (
            <Pressable
              accessibilityRole="button"
              key={game.mode}
              onPress={() => router.push(`/quiz/${game.mode}`)}
              style={({ pressed }) => [
                styles.gameCard,
                pressed ? styles.pressedCard : null,
              ]}
            >
              <View style={styles.gameIconWrap}>
                <Text style={styles.gameIcon}>{game.emoji}</Text>
              </View>
              <View style={styles.gameTextWrap}>
                <Text style={styles.gameTitle}>{game.title}</Text>
                <Text style={styles.gameDescription}>{game.description}</Text>
              </View>
              <Text style={styles.gameArrow}>›</Text>
            </Pressable>
          ))}
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
  title: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xxl,
    fontWeight: "900",
    marginBottom: SPACING.lg,
  },
  gameList: {
    gap: SPACING.md,
  },
  gameCard: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderColor: COLORS.borderLight,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    flexDirection: "row",
    gap: SPACING.md,
    minHeight: 124,
    padding: SPACING.lg,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  pressedCard: {
    opacity: 0.72,
    transform: [{ scale: 0.98 }],
  },
  gameIconWrap: {
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.xl,
    height: 72,
    justifyContent: "center",
    width: 72,
  },
  gameIcon: {
    fontSize: FONT_SIZE.xxxl,
  },
  gameTextWrap: {
    flex: 1,
  },
  gameTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xl,
    fontWeight: "900",
  },
  gameDescription: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    lineHeight: 22,
    marginTop: SPACING.xs,
  },
  gameArrow: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.xxxl,
    fontWeight: "900",
  },
});
