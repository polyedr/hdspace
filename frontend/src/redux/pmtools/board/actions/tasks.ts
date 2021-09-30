import TYPES from '@Redux/actionTypes';
import { RequestDeleteTask, RequestTask } from '@Src/types/pmtools/actions';

export const requestAddTask = (payload: RequestTask) => ({
  type: TYPES.REQUEST_ADD_TASK,
  payload,
});

export const requestEditTask = (payload: RequestTask) => ({
  type: TYPES.REQUEST_EDIT_TASK,
  payload,
});

export const requestDeleteTask = (payload: RequestDeleteTask) => ({
  type: TYPES.REQUEST_DELETE_TASK,
  payload,
});

// SUCCESS
export const successFetchTask = (payload: any) => ({
  type: TYPES.SUCCESS_FETCH_TASKS,
  payload,
});

export const successAddTask = (payload: any) => ({
  type: TYPES.SUCCESS_ADD_TASK,
  payload,
});

export const successEditTask = (payload: any) => ({
  type: TYPES.SUCCESS_EDIT_TASK,
  payload,
});

export const successDeleteTask = (payload: any) => ({
  type: TYPES.SUCCESS_DELETE_TASK,
  payload,
});
