import app from "./app.js";
import { redis } from "./lib/cache/redis.js";
import { env } from "./lib/config/env.js";
import { connectDatabase } from "./lib/database/connection.js";
import { logger } from "./pkg/logger/logger.js";

const startServer = async () => {
  await connectDatabase();

  await redis.connect();

  app.listen(env.port, () => {
    logger.info(`Server Running In Port ${env.port} ✅ `);
  });
};

startServer().catch((error) => {
  logger.error("Failed to start server");
  console.error(error);
  process.exit(1);
});
