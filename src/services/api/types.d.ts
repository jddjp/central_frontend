export interface ListResponse<T> {
  data: T[];
  meta: {
    pagination: Pagination;
  };
}

export interface SingleResponse<T> {
  data: T;
  meta: {};
}

export type PaginationConfig = { page?: number; pageSize?: number };
