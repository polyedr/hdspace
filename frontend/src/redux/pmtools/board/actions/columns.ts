import TYPES from '@Redux/actionTypes';
import { IBoardForUI, IColumnData } from '@Src/types/pmtools/board';
import {
  ActionTypePM,
  CreatorColumnType,
  UpdateCardIndexType,
  UpdateColumnIndexTypeSuccess,
} from '@Src/types/pmtools/types';

export const successSavedBoard = (name: IBoardForUI) => ({
  type: TYPES.BOARD_SAVED_SUCCESS,
  payload: name,
});

// requestFetchBoard
export const requestFetchBoard = (payload: CreatorColumnType['project']) => ({
  type: TYPES.REQUEST_FETCH_BOARD,
  payload,
});

export const successFetchColumn = (payload: Array<IColumnData>) => ({
  type: TYPES.FETCH_COLUMNS_SUCCESS,
  payload,
});

// requestAddColumn
export const requestAddColumn = (
  payload: CreatorColumnType & { action: ActionTypePM },
) => ({
  type: TYPES.ADD_COLUMN,
  payload,
});

export const successAddColumn = (payload: IColumnData) => ({
  type: TYPES.ADD_COLUMN_SUCCESS,
  payload,
});

export const requestUpdateColumnIndex = ({
  destination,
  source,
}: UpdateCardIndexType) => ({
  type: TYPES.UPDATE_COLUMN_INDEX,
  payload: { destination, source },
});

export const successUpdateColumnIndex = (
  payload: UpdateColumnIndexTypeSuccess,
) => ({
  type: TYPES.UPDATE_COLUMN_INDEX_SUCCESS,
  payload,
});

export const successUpdateCardIndex = (
  payload: UpdateColumnIndexTypeSuccess,
) => ({
  type: TYPES.UPDATE_COLUMN_INDEX_SUCCESS,
  payload,
});

// requestEditColumn
export const requestEditColumn = (
  payload: CreatorColumnType & { action: ActionTypePM },
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
  payload: { columnId: IColumnData['id'] } & { action: ActionTypePM },
) => ({
  type: TYPES.DELETE_COLUMN,
  payload,
});

export const successDeleteColumn = (payload: IColumnData['id']) => ({
  type: TYPES.DELETE_COLUMN_SUCCESS,
  payload,
});
