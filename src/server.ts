import pg from 'pg';
import { app } from './app';
import { env } from './config/env';
import { AppDataSource } from './config/data-source';
import { logger } from './common/utils/logger';

const ensureDatabase = async (): Promise<void> => {
  const client = new pg.Client({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: 'postgres',
  });

  try {
    await client.connect();

    const result = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [env.DB_NAME],
    );

    if (result.rowCount === 0) {
      await client.query(`CREATE DATABASE "${env.DB_NAME}"`);
      logger.info(`Database "${env.DB_NAME}" created`);
    }
  } finally {
    await client.end();
  }
};

const startServer = async (): Promise<void> => {
  try {
    await ensureDatabase();
    await AppDataSource.initialize();
    logger.info('Database connected successfully');

    app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT}`);
      logger.info(`API documentation available at ${env.APP_URL}:${env.PORT}${env.DOCS_PATH}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

void startServer();
