import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
} from "react-native";

import {
  BORDER_RADIUS,
  COLORS,
  DAILY_GOAL_WORDS,
  FONT_SIZE,
  SPACING,
  USER_ID,
} from "../../src/constants";
import {
  buildDashboardModel,
  type DashboardStatsInput,
  type SuggestedTopic,
} from "../../src/dashboard";
import { vocabulary } from "../../src/db/seed";

// Web vs native DB
let getDb: () => any;
if (Platform.OS === "web") {
  getDb = require("../../src/db/schema.web").getDb;
} else {
  getDb = require("../../src/db/schema").getDb;
}

type UserStatsRow = {
  total_xp: number;
  streak_days: number;
  daily_goal_progress: number;
  daily_goal_target: number;
  words_learned: number;
  quizzes_done: number;
  stories_read: number;
};

const DEFAULT_STATS: DashboardStatsInput = {
  totalXp: 0,
  streakDays: 0,
  dailyGoalProgress: 0,
  dailyGoalTarget: DAILY_GOAL_WORDS,
  wordsLearned: 0,
  quizzesDone: 0,
  storiesRead: 0,
};

const STUDY_TIPS = [
  "Ôn 5 từ mới mỗi ngày để nhớ lâu hơn.",
  "Đọc to ví dụ tiếng Anh giúp luyện phát âm.",
  "Chọn một chủ đề yêu thích để bắt đầu nhẹ nhàng.",
];

export default function HomeScreen() {
  const [stats, setStats] = useState<DashboardStatsInput>(DEFAULT_STATS);

  useEffect(() => {
    try {
      const row = (getDb() as any).getFirstSync(
        `SELECT
          total_xp,
          streak_days,
          daily_goal_progress,
          daily_goal_target,
          words_learned,
          quizzes_done,
          stories_read
        FROM user_stats
        WHERE user_id = ?`,
        USER_ID
      );

      if (row) {
        setStats({
          totalXp: row.total_xp,
          streakDays: row.streak_days,
          dailyGoalProgress: row.daily_goal_progress,
          dailyGoalTarget: row.daily_goal_target,
          wordsLearned: row.words_learned,
          quizzesDone: row.quizzes_done,
          storiesRead: row.stories_read,
        });
      }
    } catch (error) {
      console.error("Failed to load dashboard stats", error);
    }
  }, []);

  const model = useMemo(
    () => buildDashboardModel(stats, vocabulary),
    [stats]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>EngJoy 🌟</Text>
          <Text style={styles.subtitle}>Học tiếng Anh mỗi ngày!</Text>
        </View>

        <View style={[styles.card, styles.streakCard]}>
          <View style={styles.streakIconWrap}>
            <Text style={styles.streakIcon}>🔥</Text>
          </View>
          <View style={styles.cardTextWrap}>
            <Text style={styles.streakNumber}>{stats.streakDays} ngày</Text>
            <Text style={styles.cardSubtitle}>{model.streakMessage}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionTitle}>Mục tiêu hôm nay</Text>
            <Text style={styles.xpPill}>+{model.xpToday} XP</Text>
          </View>
          <Text style={styles.cardSubtitle}>{model.dailyGoalLabel}</Text>
          <View
            accessibilityLabel={model.dailyGoalLabel}
            accessibilityRole="progressbar"
            style={styles.progressTrack}
          >
            <View
              style={[
                styles.progressFill,
                { width: `${model.dailyProgressRatio * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.motivationText}>
            {stats.dailyGoalProgress > 0
              ? "Bạn đang đi đúng nhịp. Học thêm một chút nữa nhé!"
              : "Hôm nay mình bắt đầu với vài từ thật dễ nhé."}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tiếp tục học</Text>
          <View style={styles.topicList}>
            {model.suggestedTopics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </View>
        </View>

        <View style={styles.statsRow}>
          <StatCard label="Đã học" value={`${stats.wordsLearned} từ`} />
          <StatCard label="Làm" value={`${stats.quizzesDone} bài quiz`} />
          <StatCard label="Đọc" value={`${stats.storiesRead} truyện`} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gần đây</Text>
          <View style={styles.card}>
            <Text style={styles.emptyActivity}>
              {model.recentActivityMessage}
            </Text>
            <View style={styles.tipList}>
              {STUDY_TIPS.map((tip) => (
                <View key={tip} style={styles.tipItem}>
                  <Text style={styles.tipBullet}>💡</Text>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function TopicCard({ topic }: { topic: SuggestedTopic }) {
  const progressText = topic.isPlaceholder
    ? "Sắp có từ vựng"
    : `${topic.studiedCount}/${topic.totalCount} từ đã học`;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(`/learn/${topic.id}`)}
      style={({ pressed }) => [
        styles.topicCard,
        pressed ? styles.pressedCard : null,
      ]}
    >
      <Text style={styles.topicEmoji}>{topic.emoji}</Text>
      <View style={styles.cardTextWrap}>
        <Text style={styles.topicName}>{topic.name}</Text>
        <Text style={styles.topicProgress}>{progressText}</Text>
      </View>
      <Text style={styles.topicArrow}>›</Text>
    </Pressable>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
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
  card: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    marginBottom: SPACING.md,
    padding: SPACING.lg,
  },
  streakCard: {
    alignItems: "center",
    borderColor: COLORS.primaryLight,
    flexDirection: "row",
    gap: SPACING.md,
  },
  streakIconWrap: {
    alignItems: "center",
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.full,
    height: 58,
    justifyContent: "center",
    width: 58,
  },
  streakIcon: {
    fontSize: FONT_SIZE.xl,
  },
  cardTextWrap: {
    flex: 1,
  },
  streakNumber: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.xl,
    fontWeight: "900",
  },
  cardSubtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    marginTop: SPACING.xs,
  },
  cardHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: SPACING.md,
  },
  section: {
    marginTop: SPACING.sm,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: "900",
    marginBottom: SPACING.sm,
  },
  xpPill: {
    backgroundColor: COLORS.warningLight,
    borderRadius: BORDER_RADIUS.full,
    color: COLORS.text,
    fontSize: FONT_SIZE.sm,
    fontWeight: "800",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  progressTrack: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.full,
    height: 12,
    marginTop: SPACING.md,
    overflow: "hidden",
  },
  progressFill: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.full,
    height: "100%",
  },
  motivationText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.md,
  },
  topicList: {
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  topicCard: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: SPACING.md,
    minHeight: 76,
    padding: SPACING.md,
  },
  pressedCard: {
    opacity: 0.72,
    transform: [{ scale: 0.99 }],
  },
  topicEmoji: {
    fontSize: FONT_SIZE.xl,
    width: 38,
  },
  topicName: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    fontWeight: "900",
  },
  topicProgress: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.xs,
  },
  topicArrow: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.xxl,
    fontWeight: "400",
  },
  statsRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  statCard: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    flex: 1,
    minHeight: 82,
    justifyContent: "center",
    padding: SPACING.md,
  },
  statValue: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.md,
    fontWeight: "900",
    textAlign: "center",
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
    marginTop: SPACING.xs,
    textAlign: "center",
  },
  emptyActivity: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    fontWeight: "800",
    marginBottom: SPACING.md,
  },
  tipList: {
    gap: SPACING.sm,
  },
  tipItem: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: SPACING.sm,
  },
  tipBullet: {
    fontSize: FONT_SIZE.md,
  },
  tipText: {
    color: COLORS.textSecondary,
    flex: 1,
    fontSize: FONT_SIZE.sm,
    lineHeight: 20,
  },
});
