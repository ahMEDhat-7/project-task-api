import { Request, Response, NextFunction } from 'express';
import { AppError } from '../common/errors';
import { sendError } from '../common/utils/response';
import { logger } from '../common/utils/logger';

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  if (err instanceof AppError) {
    if (!err.isOperational) {
      logger.error('Operational error:', err);
    }
    sendError(res, err.message, err.statusCode);
    return;
  }

  logger.error('Unexpected error:', err);
  sendError(res, 'Internal server error', 500);
};
