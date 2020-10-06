export type Normalized<T extends { id: string | number }> = {
  [id in string | number]: T;
};

export type Paginated<T> = {
  next: string | null;
  previous: string | null;
  pageSize?: number;
  currentPage?: number;
  loading?: boolean;
  results: T[];
};

export type Patch<T> = Omit<T, 'id'>; // check if we need it
