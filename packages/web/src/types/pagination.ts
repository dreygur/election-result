export type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type PaginationInfo = {
  page: number;
  pageSize: number;
  totalPages: number;
  total: number;
};
