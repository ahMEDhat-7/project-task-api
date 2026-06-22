import { env } from '../../config/env';

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
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
  const order = (query.order?.toUpperCase() as 'ASC' | 'DESC') || 'DESC';

  return { page, limit, skip, sortBy, order };
};
