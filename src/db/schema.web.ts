// Web-only schema — uses localStorage
const WEB_KEY = "engjoy_db_v1";

interface WebStore {
  user_stats: Record<string, any>;
}

function getStore(): WebStore {
  try {
    const raw = localStorage.getItem(WEB_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { user_stats: {} };
}

function saveStore(s: WebStore): void {
  try { localStorage.setItem(WEB_KEY, JSON.stringify(s)); } catch {}
}

export function getDb(): any {
  return {
    getFirstSync(_sql: string): any {
      const store = getStore();
      const all = Object.values(store.user_stats);
      return all.length > 0 ? all[0] : null;
    },
    getAllUserStats(): any[] {
      return Object.values(getStore().user_stats);
    },
    runSync(sql: string, ...params: any[]): void {
      const store = getStore();
      if (sql.includes("user_stats") && params[0]) {
        store.user_stats[params[0]] = {
          user_id: params[0],
          display_name: params[1] || "Bạn nhỏ",
          total_xp: params[2] || 0,
          level: params[3] || 0,
          streak_days: params[4] || 0,
          longest_streak: params[5] || 0,
          last_study_date: params[6] || null,
          daily_goal_progress: params[7] || 0,
          daily_goal_target: params[8] || 5,
          words_learned: params[9] || 0,
          quizzes_done: params[10] || 0,
          stories_read: params[11] || 0,
        };
        saveStore(store);
      }
    },
    execSync(_sql: string): void {},
  };
}

export function initDatabase(): void {
  // localStorage always ready, nothing to init
}
