import TYPES from '@Redux/actionTypes';

export const setColumnsFetching = (fetching = true) => ({
  type: TYPES.BOARD_FETCH_COLUMNS_PENDING,
  fetching,
});

export const fetchBoard = () => ({
  type: TYPES.BOARD_FETCH,
});

export const setColumns = (columns) => ({
  type: TYPES.BOARD_SET_COLUMNS,
  columns,
});
