import TYPES from '@Redux/actionTypes';
import {
  RequestColumn,
  RequestDeleteColumn,
  RequestFetchColumns,
} from '@Src/types/pmtools/actions';

export const requestFetchBoard = (payload: RequestFetchColumns) => ({
  type: TYPES.REQUEST_FETCH_BOARD,
  payload,
});

export const requestLoaderBoard = (payload: boolean) => ({
  type: TYPES.LOADER_BOARD,
  payload,
});

export const requestAddColumn = (payload: RequestColumn) => ({
  type: TYPES.REQUEST_ADD_COLUMN,
  payload,
});

export const requestEditColumn = (payload: RequestColumn) => ({
  type: TYPES.REQUEST_EDIT_COLUMN,
  payload,
});

export const requestDeleteColumn = (payload: RequestDeleteColumn) => ({
  type: TYPES.REQUEST_DELETE_COLUMN,
  payload,
});
