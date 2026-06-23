import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number(),
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string(),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  CORS_ORIGINS: z.string(),
  RATE_LIMIT_WINDOW_MS: z.coerce.number(),
  RATE_LIMIT_MAX: z.coerce.number(),
  BCRYPT_SALT_ROUNDS: z.coerce.number(),
  API_PREFIX: z.string(),
  DOCS_PATH: z.string(),
  HEALTH_PATH: z.string(),
  APP_HOST: z.string(),
  APP_URL: z.string(),
  LOGGER_ERROR_PATH: z.string(),
  LOGGER_COMBINED_PATH: z.string(),
  LOGGER_SERVICE_NAME: z.string(),
  SEED_ADMIN_EMAIL: z.string(),
  SEED_ADMIN_PASSWORD: z.string(),
  SEED_USER_EMAIL: z.string(),
  SEED_USER_PASSWORD: z.string(),
  DEFAULT_PAGE_LIMIT: z.coerce.number(),
  MAX_PAGE_LIMIT: z.coerce.number(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
