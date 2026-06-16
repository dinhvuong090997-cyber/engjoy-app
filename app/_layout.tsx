import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { COLORS } from "../src/constants";

let initDatabase: () => void;

if (typeof window !== "undefined") {
  try {
    const webSchema = require("../src/db/schema.web");
    initDatabase = webSchema.initDatabase;
  } catch {}
} else {
  try {
    const nativeSchema = require("../src/db/schema");
    initDatabase = nativeSchema.initDatabase;
  } catch {}
}

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      if (initDatabase) initDatabase();
    } catch (error) {
      console.error("Failed to init DB", error);
    } finally {
      setIsReady(true);
    }
  }, []);

  if (!isReady) {
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
