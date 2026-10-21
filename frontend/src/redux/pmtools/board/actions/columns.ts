import { DropResult } from '@hello-pangea/dnd';
import TYPES from '@Redux/actionTypes';
// eslint-disable-next-line import/no-cycle
import { BoardColumn, BoardNewColumn } from '@Redux/pmtools/types';

export const setColumnsFetching = (fetching = true) => ({
  type: TYPES.BOARD_FETCH_COLUMNS_PENDING,
  fetching,
});

export const fetchBoard = (projectId: number) => ({
  type: TYPES.BOARD_FETCH,
  projectId,
});

export const updateColumnsOrder = (
  dropResult: DropResult,
  projectId: number,
) => ({
  type: TYPES.BOARD_UPDATE_COLUMNS_ORDER,
  payload: {
    dropResult,
    projectId,
  },
});

export const setColumns = (columns) => ({
  type: TYPES.BOARD_SET_COLUMNS,
  columns,
});

export const createColumn = (column: BoardNewColumn) => ({
  type: TYPES.BOARD_CREATE_COLUMN,
  column,
});

export const updateColumn = (column: BoardNewColumn, columnId: number) => ({
  type: TYPES.BOARD_UPDATE_COLUMN,
  column,
  columnId,
});

export const updateColumnOnState = (
  column: BoardNewColumn,
  columnId: number,
) => ({
  type: TYPES.BOARD_UPDATE_COLUMN_ON_STATE,
  column,
  columnId,
});

export const addColumn = (column: BoardColumn) => ({
  type: TYPES.BOARD_ADD_COLUMN,
  column,
});

export const deleteColumn = (columnId: number) => ({
  type: TYPES.BOARD_DELETE_COLUMN,
  columnId,
});

export const deleteColumnFromState = (columnId: number) => ({
  type: TYPES.BOARD_DELETE_COLUMN_FROM_STATE,
  columnId,
});
