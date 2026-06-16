import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { COLORS } from "../src/constants";

export default function IndexRoute() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const webSchema = require("../src/db/schema.web");
        webSchema.initDatabase();
      }
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
});
