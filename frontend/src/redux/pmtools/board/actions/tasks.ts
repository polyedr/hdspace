import TYPES from '@Redux/actionTypes';

export const requestAddTask = (payload: any) => ({
  type: TYPES.REQUEST_ADD_TASK,
  payload,
});

export const requestEditTask = (payload: any) => ({
  type: TYPES.REQUEST_EDIT_TASK,
  payload,
});

export const requestDeleteTask = (payload: any) => ({
  type: TYPES.REQUEST_DELETE_TASK,
  payload,
});
