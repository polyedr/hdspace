import TYPES from '@Redux/actionTypes';
import { ActionTypePM } from '@Src/types/pmtools/types';
import { ServerProject } from '@Src/types';

export const clearHistoryAction = (project: ServerProject['id']) => ({
  type: TYPES.CLEAR_HISTORY,
  payload: project,
});

export const requestGetAction = (project: ServerProject['id']) => ({
  type: TYPES.GET_ACTION,
  payload: project,
});

export const requestAddHistory = (
  payload: ActionTypePM & { project: ServerProject['id'] },
) => ({
  type: TYPES.ADD_ACTION,
  payload,
});

// SUCCESS
export const successClearHistoryAction = () => ({
  type: TYPES.CLEAR_HISTORY_SUCCESS,
});

export const successGetAction = (
  payload: Array<ActionTypePM['action']> | [],
) => ({
  type: TYPES.GET_ACTION_SUCCESS,
  payload,
});

export const successAction = (payload: ActionTypePM) => ({
  type: TYPES.ADD_ACTION_SUCCESS,
  payload,
});
