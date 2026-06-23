import { Request } from 'express';
import { UserRole } from '../types';
import { UnauthorizedError } from '../errors';

export const getUserContext = (req: Request): { userId: string; isAdmin: boolean } => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new UnauthorizedError('User not authenticated');
  }
  return {
    userId,
    isAdmin: req.user?.role === UserRole.ADMIN,
  };
};
