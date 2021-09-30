import TYPES from '@Redux/actionTypes';
import { RequestAction } from '@Src/types/pmtools/actions';

export const clearHistoryAction = (project: number, access: string) => ({
  type: TYPES.CLEAR_HISTORY,
  payload: { project, access },
});

export const requestGetAction = (project: number, access: string) => ({
  type: TYPES.REQUEST_GET_ACTION,
  payload: { project, access },
});

export const requestAction = (payload: RequestAction) => ({
  type: TYPES.REQUEST_ADD_ACTION,
  payload,
});

// SUCCESS
export const successClearHistoryAction = () => ({
  type: TYPES.CLEAR_HISTORY_SUCCESS,
});

export const successGetAction = (
  payload: Array<RequestAction['action']> | [],
) => ({
  type: TYPES.GET_ACTION,
  payload,
});

export const successAction = (payload: RequestAction) => ({
  type: TYPES.ADD_ACTION,
  payload,
});
