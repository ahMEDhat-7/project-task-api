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

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
