import { env } from '../../config/env';

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: string;
}

export interface PaginationResult {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  order: 'ASC' | 'DESC';
}

const ALLOWED_SORT_COLUMNS = new Set([
  'id',
  'createdAt',
  'updatedAt',
  'title',
  'name',
  'email',
  'status',
  'priority',
  'dueDate',
]);

const ALLOWED_SORT_ORDERS = new Set(['ASC', 'DESC']);

export const getPagination = (
  query: PaginationQuery,
  allowedColumns: string[] = [],
): PaginationResult => {
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(env.MAX_PAGE_LIMIT, Math.max(1, query.limit || env.DEFAULT_PAGE_LIMIT));
  const skip = (page - 1) * limit;

  const whitelist = allowedColumns.length > 0
    ? new Set(allowedColumns)
    : ALLOWED_SORT_COLUMNS;

  const sortBy = whitelist.has(query.sortBy || '') ? (query.sortBy as string) : 'createdAt';
  const rawOrder = query.order?.toUpperCase() || '';
  const order: 'ASC' | 'DESC' = ALLOWED_SORT_ORDERS.has(rawOrder) ? (rawOrder as 'ASC' | 'DESC') : 'DESC';

  return { page, limit, skip, sortBy, order };
};
