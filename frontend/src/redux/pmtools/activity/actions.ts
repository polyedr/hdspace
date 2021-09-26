import TYPES from '@Redux/actionTypes';

export const clearHistoryAction = (data: any) => ({
  type: TYPES.CLEAR_HISTORY,
  payload: data,
});

export const requestGetAction = (project: number, access: string) => ({
  type: TYPES.REQUEST_GET_ACTION,
  payload: { project, access },
});

export const requestAction = (data: any) => ({
  type: TYPES.REQUEST_ADD_ACTION,
  payload: data,
});
