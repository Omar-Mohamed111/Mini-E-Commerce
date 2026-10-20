import { Redis } from "ioredis";
import { logger } from "../../pkg/logger/logger.js";

export const redis = new Redis({
  host: "127.0.0.1",
  port: 6379,
  lazyConnect: true,
});

redis.on("error", (error: Error) => {
  logger.error("Redis Client Error", error);
});

redis.on("ready", () => {
  logger.info("Redis Connected Successfully ✅");
});
