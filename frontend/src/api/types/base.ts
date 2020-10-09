export type Normalized<T extends { id: string | number }> = {
  [id in string | number]: T;
};

type PaginatedBase<T> = {
  next: string | null;
  previous: string | null;
  pageSize: number;
  loading: boolean;
};

export type PaginatedArray<T> = PaginatedBase<T> & {
  results: T[];
};

export type PaginatedData<T extends { id: string | number }> = PaginatedBase<
  T
> & {
  results: Normalized<T>;
};
