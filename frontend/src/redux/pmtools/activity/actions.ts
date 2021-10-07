import TYPES from '@Redux/actionTypes';
import { RequestAction } from '@Src/types/pmtools/actions';

export const clearHistoryAction = (project: RequestAction['project']) => ({
  type: TYPES.CLEAR_HISTORY,
  payload: project,
});

export const requestGetAction = (project: RequestAction['project']) => ({
  type: TYPES.GET_ACTION,
  payload: project,
});

export const requestAction = (payload: RequestAction) => ({
  type: TYPES.ADD_ACTION,
  payload,
});

// SUCCESS
export const successClearHistoryAction = () => ({
  type: TYPES.CLEAR_HISTORY_SUCCESS,
});

export const successGetAction = (
  payload: Array<RequestAction['action']> | [],
) => ({
  type: TYPES.GET_ACTION_SUCCESS,
  payload,
});

export const successAction = (payload: RequestAction) => ({
  type: TYPES.ADD_ACTION_SUCCESS,
  payload,
});
