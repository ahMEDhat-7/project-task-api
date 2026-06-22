import { Request, Response, NextFunction } from 'express';

type AsyncHandler = (req: Request, res: Response) => Promise<void>;

export const asyncWrapper = (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res)).catch(next);
};
