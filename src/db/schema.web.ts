// Web-compatible schema using localStorage (no expo-sqlite wasm needed)
// For native: expo-sqlite is used instead

const WEB_STORAGE_KEY = "engjoy_db_v1";

interface WebTable {
  user_stats: Record<string, any>;
  [key: string]: any;
}

function getStore(): WebTable {
  try {
    const raw = localStorage.getItem(WEB_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { user_stats: {} };
}

function saveStore(store: WebTable): void {
  try {
    localStorage.setItem(WEB_STORAGE_KEY, JSON.stringify(store));
  } catch {}
}

// Web-compatible DB interface matching expo-sqlite pattern
class WebDatabase {
  private store: WebTable;

  constructor() {
    this.store = getStore();
  }

  getUserStats(userId: string): any {
    return this.store.user_stats[userId] ?? null;
  }

  saveUserStats(userId: string, stats: any): void {
    this.store.user_stats[userId] = { ...stats, user_id: userId };
    saveStore(this.store);
  }

  getAllUserStats(): any[] {
    return Object.values(this.store.user_stats);
  }
}

let webDb: WebDatabase | null = null;

export function getWebDb(): WebDatabase {
  webDb ??= new WebDatabase();
  return webDb;
}

export function initDatabaseWeb(): void {
  // Nothing to init — localStorage is always ready
  getWebDb();
}
