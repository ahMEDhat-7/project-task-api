import { Response } from 'express';
import { ValidationError, SuccessResponse, ErrorResponse, PaginatedResponse } from '../types';

export { ValidationError, SuccessResponse, ErrorResponse, PaginatedResponse } from '../types';

export const sendSuccess = <T>(res: Response, data: T, statusCode = 200): void => {
  const response: SuccessResponse<T> = { success: true, data };
  res.status(statusCode).json(response);
};

export const sendError = (res: Response, message: string, statusCode = 500, errors?: ValidationError[]): void => {
  const response: ErrorResponse = { success: false, message, errors };
  res.status(statusCode).json(response);
};

export const sendPaginated = <T>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number,
  statusCode = 200,
): void => {
  const response: PaginatedResponse<T> = {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
  res.status(statusCode).json(response);
};
