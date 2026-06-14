import { StyleSheet, Text, View } from "react-native";

import { COLORS, FONT_SIZE, SPACING } from "../../src/constants";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cá nhân</Text>
      <Text style={styles.subtitle}>Thống kê học tập sẽ được thêm ở bước tiếp theo.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: COLORS.background,
    flex: 1,
    gap: SPACING.sm,
    justifyContent: "center",
    padding: SPACING.lg,
  },
  title: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xl,
    fontWeight: "900",
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    textAlign: "center",
  },
});
