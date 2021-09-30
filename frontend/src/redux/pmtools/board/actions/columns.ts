import TYPES from '@Redux/actionTypes';
import {
  RequestColumn,
  RequestDeleteColumn,
  RequestFetchColumns,
} from '@Src/types/pmtools/actions';
import { ColumnData } from '@Src/types/pmtools/types';

// requestFetchBoard
export const requestFetchBoard = (payload: RequestFetchColumns) => ({
  type: TYPES.REQUEST_FETCH_BOARD,
  payload,
});

export const successFetchColumn = (payload: Array<ColumnData>) => ({
  type: TYPES.SUCCESS_FETCH_COLUMNS,
  payload,
});

// loading
export const loaderBoard = (payload: boolean) => ({
  type: TYPES.LOADER_BOARD,
  payload,
});

// requestAddColumn
export const requestAddColumn = (payload: RequestColumn) => ({
  type: TYPES.REQUEST_ADD_COLUMN,
  payload,
});

export const successAddColumn = (payload: ColumnData) => ({
  type: TYPES.SUCCESS_ADD_COLUMN,
  payload,
});

// requestEditColumn
export const requestEditColumn = (payload: RequestColumn) => ({
  type: TYPES.REQUEST_EDIT_COLUMN,
  payload,
});

export const successEditColumn = (payload: ColumnData) => ({
  type: TYPES.SUCCESS_EDIT_COLUMN,
  payload,
});

// requestDeleteColumn
export const requestDeleteColumn = (payload: RequestDeleteColumn) => ({
  type: TYPES.REQUEST_DELETE_COLUMN,
  payload,
});

export const successDeleteColumn = (
  payload: RequestDeleteColumn['columnId'],
) => ({
  type: TYPES.SUCCESS_DELETE_COLUMN,
  payload,
});
