import { Stack, router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { COLORS, FONT_SIZE, SPACING } from "../src/constants";
import { getDb, initDatabase } from "../src/db/schema";

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      initDatabase();
      const stats = (getDb() as any).getFirstSync(
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

  if (errorMessage) {
    return (
      <View style={styles.loading}>
        <View style={styles.errorCard}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.white} />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
  },
  errorCard: {
    maxWidth: 520,
    margin: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    gap: 12,
  },
  errorText: {
    color: COLORS.text,
    fontSize: 14,
  },
});
