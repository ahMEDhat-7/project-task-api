import { app } from './app';
import { env } from './config/env';
import { AppDataSource } from './config/data-source';
import { logger } from './common/utils/logger';

const startServer = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    logger.info('Database connected successfully');

    app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT}`);
      logger.info(`API documentation available at http://localhost:${env.PORT}/docs`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
