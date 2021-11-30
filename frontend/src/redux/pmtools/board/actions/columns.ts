import TYPES from '@Redux/actionTypes';
import { RequestColumn } from '@Src/types/pmtools/actions';
import { IBoardForUI, IColumnData } from '@Src/types/pmtools/trelloTypes';
import { ActionTypePM } from '@Src/types/pmtools/types';

export const successSavedBoard = (name: IBoardForUI) => ({
  type: TYPES.BOARD_SAVED_SUCCESS,
  payload: name,
});

// requestFetchBoard
export const requestFetchBoard = (payload: RequestColumn['project']) => ({
  type: TYPES.REQUEST_FETCH_BOARD,
  payload,
});

export const successFetchColumn = (payload: Array<IColumnData>) => ({
  type: TYPES.FETCH_COLUMNS_SUCCESS,
  payload,
});

// requestAddColumn
export const requestAddColumn = (
  payload: RequestColumn & { action: ActionTypePM },
) => ({
  type: TYPES.ADD_COLUMN,
  payload,
});

export const successAddColumn = (payload: IColumnData) => ({
  type: TYPES.ADD_COLUMN_SUCCESS,
  payload,
});

// requestEditColumn
export const requestEditColumn = (
  payload: RequestColumn & { action: ActionTypePM },
) => ({
  type: TYPES.EDIT_COLUMN,
  payload,
});

export const successEditColumn = (payload: IColumnData) => ({
  type: TYPES.EDIT_COLUMN_SUCCESS,
  payload,
});

// requestDeleteColumn
export const requestDeleteColumn = (
  payload: { columnId: number } & { action: ActionTypePM },
) => ({
  type: TYPES.DELETE_COLUMN,
  payload,
});

export const successDeleteColumn = (payload: number) => ({
  type: TYPES.DELETE_COLUMN_SUCCESS,
  payload,
});
