import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { BadRequestError } from '../errors';

export const validate = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof Error) {
        next(new BadRequestError(error.message));
      } else {
        next(new BadRequestError('Validation failed'));
      }
    }
  };
};
