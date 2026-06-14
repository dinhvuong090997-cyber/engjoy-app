import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  BORDER_RADIUS,
  COLORS,
  FONT_SIZE,
  SPACING,
} from "../../src/constants";
import { vocabulary } from "../../src/db/seed";
import { TOPIC_DETAILS } from "../../src/dashboard";
import { buildLearnTopicProgress } from "../../src/learn";

const TOPIC_COLORS = [
  "#FFE8E8",
  "#E0F7F4",
  "#FEF3C7",
  "#EDE9FE",
  "#DBEAFE",
  "#DCFCE7",
  "#FCE7F3",
  "#FFEDD5",
  "#E0E7FF",
  "#CCFBF1",
];

export default function LearnScreen() {
  const [searchText, setSearchText] = useState("");
  const topics = useMemo(() => buildLearnTopicProgress(vocabulary), []);
  const filteredTopics = useMemo(() => {
    const query = searchText.trim().toLocaleLowerCase("vi-VN");

    if (!query) {
      return topics;
    }

    return topics.filter((topic) => {
      const details = TOPIC_DETAILS[topic.id];
      return (
        details.name.toLocaleLowerCase("vi-VN").includes(query) ||
        topic.id.includes(query)
      );
    });
  }, [searchText, topics]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setSearchText}
            placeholder="Tìm chủ đề..."
            placeholderTextColor={COLORS.textTertiary}
            style={styles.searchInput}
            value={searchText}
          />
        </View>

        <Text style={styles.title}>Học từ vựng 📚</Text>

        <View style={styles.grid}>
          {filteredTopics.map((topic, index) => {
            const details = TOPIC_DETAILS[topic.id];
            const accentColor = TOPIC_COLORS[index % TOPIC_COLORS.length];

            return (
              <Pressable
                accessibilityRole="button"
                key={topic.id}
                onPress={() => router.push(`/learn/${topic.id}`)}
                style={({ pressed }) => [
                  styles.topicCard,
                  pressed ? styles.pressedCard : null,
                ]}
              >
                <View
                  style={[
                    styles.topicEmojiWrap,
                    { backgroundColor: accentColor },
                  ]}
                >
                  <Text style={styles.topicEmoji}>{details.emoji}</Text>
                </View>
                <Text numberOfLines={1} style={styles.topicName}>
                  {details.name}
                </Text>
                <Text style={styles.wordCount}>{topic.totalCount} từ</Text>
              </Pressable>
            );
          })}
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
  searchBar: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderColor: COLORS.borderLight,
    borderRadius: BORDER_RADIUS.pill,
    borderWidth: 1,
    flexDirection: "row",
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  searchIcon: {
    fontSize: FONT_SIZE.lg,
  },
  searchInput: {
    color: COLORS.text,
    flex: 1,
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    padding: 0,
  },
  title: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xxl,
    fontWeight: "900",
    marginBottom: SPACING.lg,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.md,
  },
  topicCard: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderColor: COLORS.borderLight,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    minHeight: 156,
    padding: SPACING.md,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    width: "47.8%",
    elevation: 2,
  },
  pressedCard: {
    opacity: 0.72,
    transform: [{ scale: 0.98 }],
  },
  topicEmojiWrap: {
    alignItems: "center",
    borderRadius: BORDER_RADIUS.lg,
    height: 72,
    justifyContent: "center",
    marginBottom: SPACING.md,
    width: "100%",
  },
  topicEmoji: {
    fontSize: FONT_SIZE.xxxl,
  },
  topicName: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    fontWeight: "900",
    textAlign: "center",
    width: "100%",
  },
  wordCount: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
    marginTop: SPACING.xs,
  },
});
