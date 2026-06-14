import * as SQLite from "expo-sqlite";

const DATABASE_NAME = "engjoy.db";

let db: SQLite.SQLiteDatabase | null = null;

export function getDb(): SQLite.SQLiteDatabase {
  db ??= SQLite.openDatabaseSync(DATABASE_NAME);
  return db;
}

export function initDatabase(): void {
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
      total_xp INTEGER NOT NULL DEFAULT 0,
      license_class TEXT NOT NULL DEFAULT 'B',
      streak_days INTEGER NOT NULL DEFAULT 0,
      longest_streak INTEGER NOT NULL DEFAULT 0,
      last_study_date TEXT
    );
  `);
}
