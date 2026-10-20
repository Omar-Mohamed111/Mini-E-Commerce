import { redis } from "./redis.js";

export const getCache = async <T>(key: string): Promise<T | null> => {
  const cachedData = await redis.get(key);
  if (!cachedData) {
    return null;
  }

  return JSON.parse(cachedData) as T;
};

// ==================================================

export const setCache = async (
  key: string,
  data: unknown,
  ttlSeconds: number = 60,
): Promise<void> => {
  await redis.set(key, JSON.stringify(data), "EX", ttlSeconds);
};

// ==================================================

export const deleteCache = async (key: string): Promise<void> => {
  await redis.del(key);
};

// ==================================================

export const deleteCacheByPattern = async (pattern: string): Promise<void> => {
  
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
};
