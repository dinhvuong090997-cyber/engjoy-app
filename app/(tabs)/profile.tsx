import { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  BORDER_RADIUS,
  COLORS,
  FONT_SIZE,
  SPACING,
  USER_ID,
} from "../../src/constants";
import { getDb } from "../../src/db/schema";
import {
  buildProfileModel,
  type Achievement,
  type ProfileStatsInput,
} from "../../src/profile";

type UserStatsRow = {
  display_name: string;
  total_xp: number;
  level: number;
  streak_days: number;
  longest_streak: number;
  words_learned: number;
  quizzes_done: number;
  stories_read: number;
};

export default function ProfileScreen() {
  const [stats, setStats] = useState<ProfileStatsInput | null>(null);

  useEffect(() => {
    try {
      const row = (getDb() as any).getFirstSync(
        `SELECT
          display_name,
          total_xp,
          level,
          streak_days,
          longest_streak,
          words_learned,
          quizzes_done,
          stories_read
        FROM user_stats
        WHERE user_id = ?`,
        USER_ID
      );

      if (row) {
        setStats({
          displayName: row.display_name,
          totalXp: row.total_xp,
          level: row.level,
          streakDays: row.streak_days,
          longestStreak: row.longest_streak,
          wordsLearned: row.words_learned,
          quizzesDone: row.quizzes_done,
          storiesRead: row.stories_read,
        });
      }
    } catch (error) {
      console.error("Failed to load profile stats", error);
    }
  }, []);

  const model = useMemo(
    () => (stats ? buildProfileModel(stats) : null),
    [stats]
  );

  if (!stats || !model) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🌱</Text>
          <Text style={styles.emptyTitle}>Cá nhân</Text>
          <Text style={styles.emptyText}>
            Chưa có dữ liệu. Hãy bắt đầu học!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>🌟</Text>
            <Text style={styles.avatarLetter}>{model.avatarLetter}</Text>
          </View>
          <View style={styles.headerTextWrap}>
            <Text style={styles.displayName}>{model.displayName}</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>
                Level {stats.level} · {model.levelName}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <StatCard label="Đã học" value={stats.wordsLearned} suffix="từ" />
          <StatCard label="Quiz" value={stats.quizzesDone} suffix="bài" />
          <StatCard label="Truyện" value={stats.storiesRead} suffix="truyện" />
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>XP & Level</Text>
            <Text style={styles.xpTotal}>{stats.totalXp} XP</Text>
          </View>
          <Text style={styles.cardSubtitle}>{model.xpProgressLabel}</Text>
          <View
            accessibilityLabel={model.xpProgressLabel}
            accessibilityRole="progressbar"
            style={styles.progressTrack}
          >
            <View
              style={[
                styles.progressFill,
                { width: `${model.xpProgressRatio * 100}%` },
              ]}
            />
          </View>
        </View>

        <View style={[styles.card, styles.streakCard]}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <View style={styles.cardTextWrap}>
            <Text style={styles.streakTitle}>
              Học liên tiếp {stats.streakDays} ngày
            </Text>
            <Text style={styles.cardSubtitle}>
              Dài nhất: {stats.longestStreak} ngày
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thành tích</Text>
          <View style={styles.achievementGrid}>
            {model.achievements.map((achievement) => (
              <AchievementBadge
                achievement={achievement}
                key={achievement.name}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({
  label,
  suffix,
  value,
}: {
  label: string;
  suffix: string;
  value: number;
}) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statSuffix}>{suffix}</Text>
    </View>
  );
}

function AchievementBadge({ achievement }: { achievement: Achievement }) {
  return (
    <View
      style={[
        styles.achievementBadge,
        achievement.isUnlocked ? styles.achievementUnlocked : null,
      ]}
    >
      <Text
        style={[
          styles.achievementEmoji,
          achievement.isUnlocked ? null : styles.achievementLockedEmoji,
        ]}
      >
        {achievement.emoji}
      </Text>
      <Text
        style={[
          styles.achievementName,
          achievement.isUnlocked ? null : styles.achievementLockedText,
        ]}
      >
        {achievement.name}
      </Text>
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
  emptyContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: SPACING.lg,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xl,
    fontWeight: "900",
    marginBottom: SPACING.sm,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    textAlign: "center",
  },
  profileHeader: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    flexDirection: "row",
    gap: SPACING.md,
    marginBottom: SPACING.lg,
    padding: SPACING.lg,
  },
  avatar: {
    alignItems: "center",
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.full,
    height: 76,
    justifyContent: "center",
    position: "relative",
    width: 76,
  },
  avatarEmoji: {
    fontSize: 24,
    opacity: 0.9,
    position: "absolute",
    right: 8,
    top: 7,
  },
  avatarLetter: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.xxl,
    fontWeight: "900",
  },
  headerTextWrap: {
    flex: 1,
    gap: SPACING.sm,
  },
  displayName: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xl,
    fontWeight: "900",
  },
  levelBadge: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.secondaryLight,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  levelBadgeText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.sm,
    fontWeight: "800",
  },
  statsRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  statCard: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    flex: 1,
    minHeight: 104,
    justifyContent: "center",
    padding: SPACING.md,
  },
  statValue: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xl,
    fontWeight: "900",
  },
  statLabel: {
    color: COLORS.text,
    fontSize: FONT_SIZE.sm,
    fontWeight: "800",
    marginTop: SPACING.xs,
  },
  statSuffix: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    marginTop: 2,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
    padding: SPACING.lg,
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: "900",
  },
  xpTotal: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.md,
    fontWeight: "900",
  },
  cardSubtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
  },
  progressTrack: {
    backgroundColor: COLORS.border,
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
  streakCard: {
    alignItems: "center",
    backgroundColor: COLORS.warningLight,
    flexDirection: "row",
    gap: SPACING.md,
  },
  streakEmoji: {
    fontSize: 44,
  },
  streakTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: "900",
  },
  cardTextWrap: {
    flex: 1,
  },
  section: {
    gap: SPACING.md,
  },
  achievementGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },
  achievementBadge: {
    alignItems: "center",
    backgroundColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    minHeight: 110,
    padding: SPACING.md,
    width: "48%",
  },
  achievementUnlocked: {
    backgroundColor: COLORS.successLight,
  },
  achievementEmoji: {
    fontSize: 34,
    marginBottom: SPACING.sm,
  },
  achievementLockedEmoji: {
    opacity: 0.35,
  },
  achievementName: {
    color: COLORS.text,
    fontSize: FONT_SIZE.sm,
    fontWeight: "800",
    textAlign: "center",
  },
  achievementLockedText: {
    color: COLORS.textSecondary,
  },
});
