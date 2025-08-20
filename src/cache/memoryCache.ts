export type CacheEntry = {
  cache_key: string; // max 40 (sha1 hex)
  data: any; // JSON
  created_at: number; // epoch ms
  expires_at: number; // epoch ms
};

class MemoryCache {
  private store = new Map<string, CacheEntry>();

  get<T = any>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    const now = Date.now();
    if (now >= entry.expires_at) {
      this.store.delete(key);
      return null;
    }
    return entry.data as T;
  }

  set(key: string, data: any, ttlMs: number): CacheEntry {
    const now = Date.now();
    const entry: CacheEntry = {
      cache_key: key,
      data,
      created_at: now,
      expires_at: now + Math.max(0, ttlMs),
    };
    this.store.set(key, entry);
    return entry;
  }

  getOrSet<T = any>(
    key: string,
    ttlMs: number,
    fetcher: () => Promise<T>
  ): Promise<T> {
    const cached = this.get<T>(key);
    console.warn("Cache " + (cached !== null ? "hit" : "miss"), key);
    if (cached !== null) return Promise.resolve(cached);
    return fetcher().then((data) => {
      this.set(key, data, ttlMs);
      return data;
    });
  }

  delete(key: string): boolean {
    return this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

export const memoryCache = new MemoryCache();
