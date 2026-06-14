import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { COLORS, DAILY_GOAL_WORDS, FONT_SIZE, SPACING, BORDER_RADIUS, USER_ID } from "../src/constants";
import { LEVEL_NAMES } from "../src/types";

// Web vs native DB
let getDb: () => any;
if (Platform.OS === "web") {
  getDb = require("../src/db/schema.web").getDb;
} else {
  getDb = require("../src/db/schema").getDb;
}

const LEVEL_EMOJIS: Record<number, string> = {
  0: "🐣",
  1: "🌱",
  2: "🌻",
  3: "🌳",
  4: "⭐",
  5: "👑",
};

export default function OnboardingScreen() {
  const [name, setName] = useState("");
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const levels = useMemo(
    () =>
      Object.entries(LEVEL_NAMES).map(([level, levelName]) => ({
        emoji: LEVEL_EMOJIS[Number(level)],
        level: Number(level),
        name: levelName,
      })),
    []
  );

  function handleStartLearning() {
    try {
      const displayName = name.trim() || "Bạn nhỏ";

      getDb().runSync(
        `INSERT OR REPLACE INTO user_stats (
          user_id,
          display_name,
          total_xp,
          level,
          streak_days,
          longest_streak,
          last_study_date,
          daily_goal_progress,
          daily_goal_target,
          words_learned,
          quizzes_done,
          stories_read
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        USER_ID,
        displayName,
        0,
        selectedLevel,
        0,
        0,
        new Date().toISOString(),
        0,
        DAILY_GOAL_WORDS,
        0,
        0,
        0
      );

      console.log("Created EngJoy learner", {
        displayName,
        selectedLevel,
      });

      router.replace("/(tabs)");
    } catch (error) {
      console.error("Failed to create user stats", error);
      setErrorMessage("Chưa lưu được hồ sơ. Bạn thử lại nhé.");
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Chào mừng đến với EngJoy!</Text>
            <Text style={styles.subtitle}>Cùng học tiếng Anh vui vẻ nhé!</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Chọn trình độ của bạn</Text>
            <View style={styles.levelGrid}>
              {levels.map((item) => {
                const isSelected = selectedLevel === item.level;

                return (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    key={item.level}
                    onPress={() => setSelectedLevel(item.level)}
                    style={[
                      styles.levelCard,
                      isSelected ? styles.levelCardSelected : null,
                    ]}
                  >
                    <Text style={styles.levelEmoji}>{item.emoji}</Text>
                    <Text
                      style={[
                        styles.levelNumber,
                        isSelected ? styles.levelTextSelected : null,
                      ]}
                    >
                      Level {item.level}
                    </Text>
                    <Text
                      style={[
                        styles.levelName,
                        isSelected ? styles.levelTextSelected : null,
                      ]}
                    >
                      {item.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Tên của bạn</Text>
            <TextInput
              autoCapitalize="words"
              onChangeText={setName}
              placeholder="Tên của bạn"
              placeholderTextColor={COLORS.textSecondary}
              returnKeyType="done"
              style={styles.input}
              value={name}
            />
          </View>

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          <Pressable
            accessibilityRole="button"
            onPress={handleStartLearning}
            style={({ pressed }) => [
              styles.startButton,
              pressed ? styles.startButtonPressed : null,
            ]}
          >
            <Text style={styles.startButtonText}>Bắt đầu học</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    gap: SPACING.xl,
    padding: SPACING.lg,
    paddingBottom: SPACING.xl * 2,
  },
  header: {
    gap: SPACING.sm,
    paddingTop: SPACING.xl,
  },
  title: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xxl,
    fontWeight: "900",
    lineHeight: 38,
    textAlign: "center",
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.lg,
    fontWeight: "600",
    textAlign: "center",
  },
  section: {
    gap: SPACING.md,
  },
  label: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: "800",
  },
  levelGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.md,
  },
  levelCard: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    flexBasis: "47%",
    flexGrow: 1,
    gap: SPACING.xs,
    minHeight: 134,
    padding: SPACING.md,
  },
  levelCardSelected: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  levelEmoji: {
    fontSize: 36,
  },
  levelNumber: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    fontWeight: "900",
  },
  levelName: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
    textAlign: "center",
  },
  levelTextSelected: {
    color: COLORS.primary,
  },
  input: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    minHeight: 56,
    paddingHorizontal: SPACING.lg,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    textAlign: "center",
  },
  startButton: {
    alignItems: "center",
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.pill,
    minHeight: 58,
    justifyContent: "center",
    paddingHorizontal: SPACING.xl,
  },
  startButtonPressed: {
    opacity: 0.82,
  },
  startButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.lg,
    fontWeight: "900",
  },
});
