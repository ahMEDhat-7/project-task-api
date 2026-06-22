import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(5432),
  DB_USER: z.string().default('postgres'),
  DB_PASSWORD: z.string().default('postgres'),
  DB_NAME: z.string().default('project_task_db'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  BCRYPT_SALT_ROUNDS: z.coerce.number().default(10),
  API_PREFIX: z.string().default('/api/v1'),
  DOCS_PATH: z.string().default('/docs'),
  HEALTH_PATH: z.string().default('/health'),
  APP_HOST: z.string().default('localhost'),
  APP_URL: z.string().default('http://localhost'),

  LOGGER_ERROR_PATH: z.string().default('logs/error.log'),
  LOGGER_COMBINED_PATH: z.string().default('logs/combined.log'),
  LOGGER_SERVICE_NAME: z.string().default('project-task-api'),

  SEED_ADMIN_EMAIL: z.string().default('admin@example.com'),
  SEED_ADMIN_PASSWORD: z.string().default('admin123'),
  SEED_USER_EMAIL: z.string().default('user@example.com'),
  SEED_USER_PASSWORD: z.string().default('user123'),

  DEFAULT_PAGE_LIMIT: z.coerce.number().default(10),
  MAX_PAGE_LIMIT: z.coerce.number().default(100),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
