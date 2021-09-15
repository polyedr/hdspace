import TYPES from '@Redux/actionTypes';

export const clearHistoryAction = (projectId: number) => ({
  type: TYPES.CLEAR_HISTORY,
  payload: projectId,
});

export const requestGetAction = (projectId: number) => ({
  type: TYPES.REQUEST_GET_ACTION,
  payload: projectId,
});

export const requestAction = (data: any) => ({
  type: TYPES.REQUEST_ADD_ACTION,
  payload: data,
});
