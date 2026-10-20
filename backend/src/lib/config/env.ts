import { config } from "dotenv";
import z from "zod";
config();

const envSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  MONGO_URI: z.string().min(1),
  EMAIL_USER: z.string().email(),
  EMAIL_PASS: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  REDIS_URL: z.string(),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error(
    "Invalid environment variables:",
    result.error.flatten().fieldErrors,
  );
  process.exit(1);
}

export const env = {
  port: result.data.PORT,
  dbUrl: result.data.MONGO_URI,
  email: {
    user: result.data.EMAIL_USER,
    pass: result.data.EMAIL_PASS,
  },
  jwtSecret: result.data.JWT_SECRET,
  redisUrl: result.data.REDIS_URL,
};
