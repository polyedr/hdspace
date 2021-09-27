import TYPES from '@Redux/actionTypes';

export const requestFetchBoard = (payload: any) => ({
  type: TYPES.REQUEST_FETCH_BOARD,
  payload,
});

export const requestLoaderBoard = (load: boolean) => ({
  type: TYPES.LOADER_BOARD,
  payload: load,
});

export const requestAddColumn = (data: any) => ({
  type: TYPES.REQUEST_ADD_COLUMN,
  payload: data,
});

export const requestEditColumn = (data: any) => ({
  type: TYPES.REQUEST_EDIT_COLUMN,
  payload: data,
});

export const requestDeleteColumn = (data: any) => ({
  type: TYPES.REQUEST_DELETE_COLUMN,
  payload: data,
});

export const errorBoard = (errMsg: string) => ({
  type: TYPES.BOARD_ERROR,
  payload: errMsg,
});
