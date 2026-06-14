// Universal schema — uses localStorage on web, expo-sqlite on native
import { Platform } from "react-native";
import * as SQLite from "expo-sqlite";

const DATABASE_NAME = "engjoy.db";
let db: any = null;
const WEB_KEY = "engjoy_db_v1";

// ===== WEB STORAGE =====
function getWebStore(): any {
  try {
    const raw = localStorage.getItem(WEB_KEY);
    return raw ? JSON.parse(raw) : { user_stats: {} };
  } catch {
    return { user_stats: {} };
  }
}

function saveWebStore(store: any): void {
  try {
    localStorage.setItem(WEB_KEY, JSON.stringify(store));
  } catch {}
}

// ===== PUBLIC API =====
export function getDb(): any {
  if (Platform.OS === "web") {
    return {
      getFirstSync(sql: string, params?: any[]): any {
        const store = getWebStore();
        if (sql.includes("user_stats")) {
          const all = Object.values(store.user_stats) as any[];
          return all.length > 0 ? all[0] : null;
        }
        return null;
      },
      runSync(sql: string, ...params: any[]): void {
        const store = getWebStore();
        if (sql.includes("INSERT") && sql.includes("user_stats")) {
          store.user_stats[params[0]] = {
            user_id: params[0],
            display_name: params[1],
            total_xp: params[2],
            level: params[3],
            streak_days: params[4],
            longest_streak: params[5],
            last_study_date: params[6],
            daily_goal_progress: params[7],
            daily_goal_target: params[8],
            words_learned: params[9],
            quizzes_done: params[10],
            stories_read: params[11],
          };
          saveWebStore(store);
        }
      },
      execSync(_sql: string): void {},
    };
  }
  db ??= SQLite.openDatabaseSync(DATABASE_NAME);
  return db;
}

export function initDatabase(): void {
  if (Platform.OS === "web") return;
  getDb().execSync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY NOT NULL,
      chapter INTEGER NOT NULL DEFAULT 1,
      content TEXT NOT NULL,
      options TEXT NOT NULL,
      answer INTEGER NOT NULL,
      explanation TEXT,
      is_diem_liet INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS card_progress (
      user_id TEXT NOT NULL,
      question_id INTEGER NOT NULL,
      repetitions INTEGER NOT NULL DEFAULT 0,
      ease_factor REAL NOT NULL DEFAULT 2.5,
      interval INTEGER NOT NULL DEFAULT 0,
      due_date TEXT NOT NULL,
      correct_count INTEGER NOT NULL DEFAULT 0,
      total_attempts INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (user_id, question_id)
    );
    CREATE TABLE IF NOT EXISTS studied_questions (
      user_id TEXT NOT NULL,
      question_id INTEGER NOT NULL,
      studied_at TEXT NOT NULL,
      PRIMARY KEY (user_id, question_id)
    );
    CREATE TABLE IF NOT EXISTS exam_sessions (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      license_class TEXT NOT NULL,
      answers TEXT NOT NULL,
      score INTEGER NOT NULL,
      total_questions INTEGER NOT NULL,
      passed INTEGER NOT NULL,
      failed_diem_liet INTEGER NOT NULL,
      duration_seconds INTEGER NOT NULL,
      completed_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS user_stats (
      user_id TEXT PRIMARY KEY NOT NULL,
      display_name TEXT NOT NULL DEFAULT '',
      total_xp INTEGER NOT NULL DEFAULT 0,
      level INTEGER NOT NULL DEFAULT 0,
      streak_days INTEGER NOT NULL DEFAULT 0,
      longest_streak INTEGER NOT NULL DEFAULT 0,
      last_study_date TEXT,
      daily_goal_progress INTEGER NOT NULL DEFAULT 0,
      daily_goal_target INTEGER NOT NULL DEFAULT 5,
      words_learned INTEGER NOT NULL DEFAULT 0,
      quizzes_done INTEGER NOT NULL DEFAULT 0,
      stories_read INTEGER NOT NULL DEFAULT 0
    );
  `);
}
