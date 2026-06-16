import { Redirect, router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Platform, StyleSheet, Text, View } from "react-native";

import { COLORS } from "../src/constants";

let initDatabase: () => void;
let getDb: () => any;

// Choose correct schema based on platform
if (Platform.OS === "web") {
  const webSchema = require("../src/db/schema.web");
  initDatabase = webSchema.initDatabase;
  getDb = webSchema.getDb;
} else {
  const nativeSchema = require("../src/db/schema");
  initDatabase = nativeSchema.initDatabase;
  getDb = nativeSchema.getDb;
}

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      initDatabase();

      if (Platform.OS === "web") {
        const allStats = (getDb() as any).getAllUserStats();
        if (allStats.length === 0) {
          router.replace("/onboarding");
        }
      } else {
        const stats = (getDb() as any).getFirstSync(
          "SELECT user_id FROM user_stats LIMIT 1"
        );
        if (!stats) {
          router.replace("/onboarding");
        }
      }
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

  return <Redirect href="/(tabs)" />;
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
