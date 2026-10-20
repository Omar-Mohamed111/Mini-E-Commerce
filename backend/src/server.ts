import app from "./app.js";
import { redis } from "./lib/cache/redis.js";
import { env } from "./lib/config/env.js";
import { connectDatabase } from "./lib/database/connection.js";
import { logger } from "./pkg/logger/logger.js";

let initializationPromise: Promise<void> | undefined;

app.use(async (_req, _res, next) => {
  try {
    if (!initializationPromise) {
      initializationPromise = (async () => {
        await connectDatabase();
        await redis.connect();
      })();
    }

    await initializationPromise;
    next();
  } catch (error) {
    initializationPromise = undefined;
    next(error);
  }
});

if (!process.env.VERCEL) {
  app.listen(env.port, () => {
    logger.info(`Server Running In Port ${env.port} ✅`);
  });
}

export default app;
