import TYPES from '@Redux/actionTypes';

export const requestFetchTask = () => ({
  type: TYPES.REQUEST_FETCH_TASKS,
});

export const requestAddTask = (data: any) => ({
  type: TYPES.REQUEST_ADD_TASK,
  payload: data,
});

export const requestEditTask = (data: any) => ({
  type: TYPES.REQUEST_EDIT_TASK,
  payload: data,
});

export const requestDeleteTask = (data: any) => ({
  type: TYPES.REQUEST_DELETE_TASK,
  payload: data,
});
