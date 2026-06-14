import { Stack, router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { COLORS, FONT_SIZE, SPACING } from "../src/constants";
import { getDb, initDatabase } from "../src/db/schema";

type UserStatsRow = {
  user_id: string;
};

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      initDatabase();

      const stats = getDb().getFirstSync<UserStatsRow>(
        "SELECT user_id FROM user_stats LIMIT 1"
      );

      router.replace(stats ? "/(tabs)" : "/onboarding");
    } catch (error) {
      console.error("Failed to initialize database", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Không thể mở dữ liệu học tập."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false }} />

      {isLoading ? (
        <View style={styles.overlay}>
          <ActivityIndicator color={COLORS.primary} size="large" />
          <Text style={styles.loadingText}>Đang chuẩn bị bài học...</Text>
        </View>
      ) : null}

      {errorMessage ? (
        <View style={styles.overlay}>
          <Text style={styles.errorTitle}>Có lỗi xảy ra</Text>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    backgroundColor: COLORS.background,
    justifyContent: "center",
    padding: SPACING.xl,
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    marginTop: SPACING.md,
  },
  errorTitle: {
    color: COLORS.danger,
    fontSize: FONT_SIZE.xl,
    fontWeight: "800",
    marginBottom: SPACING.sm,
    textAlign: "center",
  },
  errorText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    textAlign: "center",
  },
});
