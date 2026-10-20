import mongoose from "mongoose";
import { env } from "../config/env.js";
import { logger } from "../../pkg/logger/logger.js";

export const connectDatabase = async () => {
  await mongoose.connect(env.dbUrl);

  logger.info("MongoDB Connected Successfully ✅ ");
};
