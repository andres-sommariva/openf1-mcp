import { GoodDB, JSONDriver } from "good.db";

export interface CacheEntry {
  data: any;
  created_at: number;
  expires_at: number;
}

class DbCache {
  private db = new GoodDB(new JSONDriver({ path: "./db/cache.data.json" }), {
    table: "cache",
    nestedIsEnabled: false,
    cache: {
      isEnabled: true,
      capacity: 1024,
    },
  });

  async get<T = any>(key: string): Promise<T | null> {
    const entry = await this.db.get(key);
    if (!entry) return null;
    const now = Date.now();
    if (now >= entry.expires_at) {
      this.db.delete(key);
      return null;
    }
    return entry.data as T;
  }

  set(key: string, data: any, ttlMs: number): CacheEntry {
    const now = Date.now();
    const entry = {
      data,
      created_at: now,
      expires_at: now + Math.max(0, ttlMs),
    };
    this.db.set(key, entry);
    return entry;
  }

  async getOrSet<T = any>(
    key: string,
    ttlMs: number,
    fetcher: () => Promise<T>
  ): Promise<T> {
    const cached = await this.get<T>(key);
    console.warn("Cache " + (cached !== null ? "hit" : "miss"), key);
    if (cached !== null) return cached;
    const data = await fetcher();
    this.set(key, data, ttlMs);
    return data;
  }

  delete(key: string): boolean {
    return this.db.delete(key);
  }

  clear(): void {
    this.db.clear();
  }
}

export const dbCache = new DbCache();
