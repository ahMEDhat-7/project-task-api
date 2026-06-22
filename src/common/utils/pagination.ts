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

export const getPagination = (query: PaginationQuery): PaginationResult => {
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(100, Math.max(1, query.limit || 10));
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy || 'createdAt';
  const order = (query.order?.toUpperCase() as 'ASC' | 'DESC') || 'DESC';

  return { page, limit, skip, sortBy, order };
};
