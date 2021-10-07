import TYPES from '@Redux/actionTypes';
import { RequestColumn, RequestDeleteColumn } from '@Src/types/pmtools/actions';
import { ColumnData } from '@Src/types/pmtools/types';

// requestFetchBoard
export const requestFetchBoard = (payload: RequestColumn['project']) => ({
  type: TYPES.REQUEST_FETCH_BOARD,
  payload,
});

export const successFetchColumn = (payload: Array<ColumnData>) => ({
  type: TYPES.FETCH_COLUMNS_SUCCESS,
  payload,
});

// requestAddColumn
export const requestAddColumn = (payload: RequestColumn) => ({
  type: TYPES.ADD_COLUMN,
  payload,
});

export const successAddColumn = (payload: ColumnData) => ({
  type: TYPES.ADD_COLUMN_SUCCESS,
  payload,
});

// requestEditColumn
export const requestEditColumn = (payload: RequestColumn) => ({
  type: TYPES.EDIT_COLUMN,
  payload,
});

export const successEditColumn = (payload: ColumnData) => ({
  type: TYPES.EDIT_COLUMN_SUCCESS,
  payload,
});

// requestDeleteColumn
export const requestDeleteColumn = (payload: RequestDeleteColumn) => ({
  type: TYPES.DELETE_COLUMN,
  payload,
});

export const successDeleteColumn = (
  payload: RequestDeleteColumn['columnId'],
) => ({
  type: TYPES.DELETE_COLUMN_SUCCESS,
  payload,
});
