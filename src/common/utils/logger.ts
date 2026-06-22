import winston from 'winston';
import { env } from '../../config/env';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return `${timestamp as string} [${level as string}]: ${(stack || message) as string}`;
  }),
);

export const logger = winston.createLogger({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  defaultMeta: { service: env.LOGGER_SERVICE_NAME },
  transports: [
    new winston.transports.File({ filename: env.LOGGER_ERROR_PATH, level: 'error' }),
    new winston.transports.File({ filename: env.LOGGER_COMBINED_PATH }),
  ],
});

if (env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
    }),
  );
}
