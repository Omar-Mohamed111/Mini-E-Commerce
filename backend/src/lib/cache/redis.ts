import { Redis } from "ioredis";
import { logger } from "../../pkg/logger/logger.js";
import { env } from "../config/env.js";

export const redis = new Redis(env.redisUrl, {
  lazyConnect: true,
});

redis.on("error", (error: Error) => {
  logger.error("Redis Client Error", error);
});

redis.on("ready", () => {
  logger.info("Redis Connected Successfully ✅");
});
