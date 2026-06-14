import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Platform,
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
  DAILY_GOAL_WORDS,
  FONT_SIZE,
  SPACING,
  USER_ID,
} from "../../src/constants";
import {
  buildDashboardModel,
  TOPIC_DETAILS,
  type DashboardStatsInput,
  type SuggestedTopic,
} from "../../src/dashboard";
import { vocabulary } from "../../src/db/seed";
import { libraryStories } from "../../src/db/stories";
import { TOPICS, type Topic, type VocabWord } from "../../src/types";

let getDb: () => any;
if (Platform.OS === "web") {
  getDb = require("../../src/db/schema.web").getDb;
} else {
  getDb = require("../../src/db/schema").getDb;
}

type UserStatsRow = {
  total_xp: number;
  level: number;
  streak_days: number;
  daily_goal_progress: number;
  daily_goal_target: number;
  words_learned: number;
  quizzes_done: number;
  stories_read: number;
};

type DashboardState = DashboardStatsInput & {
  level: number;
};

type RecentActivity = {
  icon: string;
  text: string;
};

const DEFAULT_STATS: DashboardState = {
  totalXp: 0,
  level: 0,
  streakDays: 0,
  dailyGoalProgress: 0,
  dailyGoalTarget: DAILY_GOAL_WORDS,
  wordsLearned: 0,
  quizzesDone: 0,
  storiesRead: 0,
};

const TOPIC_BACKGROUNDS = [
  "#FFF4D8",
  "#E8F8F5",
  "#FDE8F0",
  "#E9F0FF",
  "#F2ECFF",
  "#EAF7E8",
];

export default function HomeScreen() {
  const [stats, setStats] = useState<DashboardState>(DEFAULT_STATS);

  useEffect(() => {
    try {
      const row = (getDb() as any).getFirstSync(
        `SELECT
          total_xp,
          level,
          streak_days,
          daily_goal_progress,
          daily_goal_target,
          words_learned,
          quizzes_done,
          stories_read
        FROM user_stats
        WHERE user_id = ?`,
        USER_ID
      ) as UserStatsRow | null;

      if (row) {
        setStats({
          totalXp: row.total_xp,
          level: row.level,
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

  const levelVocabulary = useMemo(
    () => vocabulary.filter((word) => word.level === stats.level),
    [stats.level]
  );

  const model = useMemo(
    () => buildDashboardModel(stats, levelVocabulary),
    [stats, levelVocabulary]
  );

  const topicsForLevel = useMemo(
    () => buildTopicsForLevel(levelVocabulary),
    [levelVocabulary]
  );

  const quickStats = useMemo(
    () => buildQuickStats(stats.level),
    [stats.level]
  );

  const recentActivity = useMemo(
    () => buildRecentActivity(stats),
    [stats]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.heroGlow} />
          <View style={styles.heroTopRow}>
            <View style={styles.streakCluster}>
              <Text style={styles.streakEmoji}>🔥</Text>
              <View>
                <Text style={styles.streakNumber}>{stats.streakDays}</Text>
                <Text style={styles.streakUnit}>ngày</Text>
              </View>
            </View>
            <View style={styles.xpBadge}>
              <Text style={styles.xpBadgeLabel}>Hôm nay</Text>
              <Text style={styles.xpBadgeValue}>+{model.xpToday} XP</Text>
            </View>
          </View>

          <Text style={styles.heroMessage}>{model.streakMessage}</Text>
          <View style={styles.goalRow}>
            <Text style={styles.goalLabel}>
              Đã học {stats.dailyGoalProgress} / {stats.dailyGoalTarget} từ hôm nay
            </Text>
          </View>
          <View
            accessibilityLabel={`Đã học ${stats.dailyGoalProgress} trên ${stats.dailyGoalTarget} từ hôm nay`}
            accessibilityRole="progressbar"
            style={styles.heroProgressTrack}
          >
            <View
              style={[
                styles.heroProgressFill,
                { width: `${model.dailyProgressRatio * 100}%` },
              ]}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tiếp tục học ➡</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.topicScrollContent}
          >
            {topicsForLevel.map((topic, index) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                backgroundColor={
                  TOPIC_BACKGROUNDS[index % TOPIC_BACKGROUNDS.length]
                }
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.statsRow}>
          <StatCard emoji="📚" number={quickStats.words} label="từ" />
          <StatCard emoji="📝" number={quickStats.questions} label="câu" />
          <StatCard emoji="📖" number={quickStats.stories} label="truyện" />
        </View>

        <View style={styles.levelSelectorCard}>
          <Text style={styles.levelSelectorLabel}>Trình độ hiện tại:</Text>
          <View style={styles.levelChips}>
            {[0,1,2,3,4,5].map((lv) => (
              <Pressable
                key={lv}
                onPress={() => {
                  try {
                    (getDb() as any).runSync(
                      "UPDATE user_stats SET level = ? WHERE user_id = ?",
                      lv, USER_ID
                    );
                    setStats((prev) => ({ ...prev, level: lv }));
                  } catch (_e) {}
                }}
                style={[
                  styles.levelChip,
                  stats.level === lv ? styles.levelChipActive : null,
                ]}
              >
                <Text style={[
                  styles.levelChipText,
                  stats.level === lv ? styles.levelChipTextActive : null,
                ]}>
                  {lv}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.levelSelectorHint}>
            Chọn level phù hợp — nội dung hiển thị theo level đã chọn
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hoạt động gần đây</Text>
          <View style={styles.activityCard}>
            {recentActivity.length === 0 ? (
              <Text style={styles.emptyActivity}>
                Chưa có hoạt động. Bắt đầu học ngay! 🌟
              </Text>
            ) : (
              recentActivity.map((item) => (
                <View key={item.text} style={styles.activityItem}>
                  <Text style={styles.activityIcon}>{item.icon}</Text>
                  <Text style={styles.activityText}>{item.text}</Text>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function TopicCard({
  topic,
  backgroundColor,
}: {
  topic: SuggestedTopic;
  backgroundColor: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(`/learn/${topic.id}`)}
      style={({ pressed }) => [
        styles.topicCard,
        { backgroundColor },
        pressed ? styles.pressedCard : null,
      ]}
    >
      <Text style={styles.topicEmoji}>{topic.emoji}</Text>
      <Text style={styles.topicName}>{topic.name}</Text>
    </Pressable>
  );
}

function StatCard({
  emoji,
  number,
  label,
}: {
  emoji: string;
  number: number;
  label: string;
}) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={styles.statValue}>
        {number} {label}
      </Text>
    </View>
  );
}

function buildQuickStats(level: number) {
  return {
    words: vocabulary.filter((word) => word.level === level).length,
    questions: vocabulary.filter((word) => word.level === level).length,
    stories: libraryStories.filter((story) => story.panels.length > 0).length,
  };
}

function buildTopicsForLevel(words: VocabWord[]): SuggestedTopic[] {
  const countByTopic = new Map<Topic, number>();

  for (const word of words) {
    if (isTopic(word.topic)) {
      countByTopic.set(word.topic, (countByTopic.get(word.topic) ?? 0) + 1);
    }
  }

  return TOPICS.filter((topic) => countByTopic.has(topic)).map((topic) => {
    const details = TOPIC_DETAILS[topic];

    return {
      id: topic,
      emoji: details.emoji,
      name: details.name,
      studiedCount: 0,
      totalCount: countByTopic.get(topic) ?? 0,
      isPlaceholder: false,
    };
  });
}

function isTopic(value: string): value is Topic {
  return TOPICS.includes(value as Topic);
}

function buildRecentActivity(stats: DashboardState): RecentActivity[] {
  const items: RecentActivity[] = [];

  if (stats.wordsLearned > 0) {
    items.push({
      icon: "📚",
      text: `Đã học ${stats.wordsLearned} từ vựng`,
    });
  }

  if (stats.quizzesDone > 0) {
    items.push({
      icon: "📝",
      text: `Đã hoàn thành ${stats.quizzesDone} câu luyện tập`,
    });
  }

  if (stats.storiesRead > 0) {
    items.push({
      icon: "📖",
      text: `Đã đọc ${stats.storiesRead} truyện`,
    });
  }

  if (stats.dailyGoalProgress > 0) {
    items.push({
      icon: "🎯",
      text: `Hôm nay đã học ${stats.dailyGoalProgress} / ${stats.dailyGoalTarget} từ`,
    });
  }

  return items.slice(0, 4);
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  content: {
    paddingBottom: SPACING.xl + 80,
  },
  heroCard: {
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: BORDER_RADIUS.lg,
    borderBottomRightRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.xl,
    overflow: "hidden",
    padding: SPACING.xl,
    paddingBottom: SPACING.xxl,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 2,
  },
  heroGlow: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 92,
    height: 184,
    opacity: 0.28,
    position: "absolute",
    right: -48,
    top: -72,
    width: 184,
  },
  heroTopRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: SPACING.lg,
  },
  streakCluster: {
    alignItems: "center",
    flexDirection: "row",
    gap: SPACING.md,
  },
  streakEmoji: {
    fontSize: FONT_SIZE.display,
  },
  streakNumber: {
    color: COLORS.white,
    fontSize: FONT_SIZE.display,
    fontWeight: "900",
    lineHeight: 44,
  },
  streakUnit: {
    color: COLORS.white,
    fontSize: FONT_SIZE.sm,
    fontWeight: "800",
    opacity: 0.9,
  },
  xpBadge: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.22)",
    borderColor: "rgba(255, 255, 255, 0.34)",
    borderRadius: BORDER_RADIUS.pill,
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  xpBadgeLabel: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
    opacity: 0.9,
  },
  xpBadgeValue: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: "900",
    marginTop: 2,
  },
  heroMessage: {
    color: COLORS.white,
    fontSize: FONT_SIZE.lg,
    fontWeight: "900",
    marginTop: SPACING.lg,
  },
  goalRow: {
    marginTop: SPACING.lg,
  },
  goalLabel: {
    color: COLORS.white,
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
    opacity: 0.95,
  },
  heroProgressTrack: {
    backgroundColor: "rgba(255, 255, 255, 0.28)",
    borderRadius: BORDER_RADIUS.pill,
    height: 8,
    marginTop: SPACING.sm,
    overflow: "hidden",
  },
  heroProgressFill: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.pill,
    height: "100%",
  },
  section: {
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: "900",
    marginBottom: SPACING.md,
  },
  topicScrollContent: {
    gap: SPACING.md,
    paddingRight: SPACING.lg,
  },
  topicCard: {
    alignItems: "center",
    borderColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    justifyContent: "center",
    minHeight: 132,
    padding: SPACING.lg,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    width: 122,
    elevation: 2,
  },
  pressedCard: {
    opacity: 0.76,
    transform: [{ scale: 0.98 }],
  },
  topicEmoji: {
    fontSize: FONT_SIZE.xxxl,
    marginBottom: SPACING.md,
  },
  topicName: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    fontWeight: "900",
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  statCard: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    flex: 1,
    justifyContent: "center",
    minHeight: 94,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.md,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  statEmoji: {
    fontSize: FONT_SIZE.xl,
    marginBottom: SPACING.xs,
  },
  statValue: {
    color: COLORS.text,
    fontSize: FONT_SIZE.sm,
    fontWeight: "900",
    textAlign: "center",
  },
  activityCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    minHeight: 112,
    padding: SPACING.lg,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyActivity: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    fontWeight: "800",
    lineHeight: 22,
    marginTop: SPACING.lg,
    textAlign: "center",
  },
  activityItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  activityIcon: {
    fontSize: FONT_SIZE.xl,
    width: 30,
  },
  activityText: {
    color: COLORS.text,
    flex: 1,
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    lineHeight: 22,
  },
  levelSelectorCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.xl,
    marginHorizontal: SPACING.lg,
    padding: SPACING.lg,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  levelSelectorLabel: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    fontWeight: "800",
    marginBottom: SPACING.md,
  },
  levelChips: {
    flexDirection: "row",
    gap: SPACING.sm,
    justifyContent: "center",
  },
  levelChip: {
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.pill,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  levelChipActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  levelChipText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    fontWeight: "800",
  },
  levelChipTextActive: {
    color: COLORS.primary,
  },
  levelSelectorHint: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.xs,
    marginTop: SPACING.md,
    textAlign: "center",
  },
});
