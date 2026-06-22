import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import jwt from 'jsonwebtoken';
import { QueryFailedError } from 'typeorm';
import { AppError } from '../common/errors';
import { sendError } from '../common/utils/response';
import { logger } from '../common/utils/logger';
import { env } from '../config/env';

interface PgDriverError {
  code: string;
  detail?: string;
}

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode);
    return;
  }

  if (err instanceof ZodError) {
    const errors = err.issues.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    sendError(res, 'Validation failed', 400, errors);
    return;
  }

  if (err instanceof jwt.TokenExpiredError) {
    sendError(res, 'Token expired', 401);
    return;
  }

  if (err instanceof jwt.JsonWebTokenError) {
    sendError(res, 'Invalid token', 401);
    return;
  }

  if (err instanceof QueryFailedError) {
    const driverError = err.driverError as PgDriverError;

    if (driverError.code === '23505') {
      const detail = driverError.detail || 'Unique constraint violation';
      sendError(res, detail, 409);
      return;
    }

    if (driverError.code === '23503') {
      sendError(res, 'Referenced record not found', 400);
      return;
    }

    logger.error('Database error:', err);
    sendError(res, 'Database error', 500);
    return;
  }

  if (err instanceof SyntaxError && 'body' in err) {
    sendError(res, 'Malformed JSON in request body', 400);
    return;
  }

  logger.error('Unexpected error:', err);

  const message = env.NODE_ENV === 'production' ? 'Internal server error' : err.message;
  sendError(res, message, 500);
};
