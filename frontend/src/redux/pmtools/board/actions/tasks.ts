import TYPES from '@Redux/actionTypes';
import { RequestDeleteTask, RequestTask } from '@Src/types/pmtools/actions';
import { ActionTypePM } from '@Src/types/pmtools/types';

export const requestAddTask = (payload: RequestTask & ActionTypePM) => ({
  type: TYPES.ADD_TASK,
  payload,
});

export const requestEditTask = (payload: RequestTask & ActionTypePM) => ({
  type: TYPES.EDIT_TASK,
  payload,
});

export const requestDeleteTask = (payload: RequestDeleteTask) => ({
  type: TYPES.DELETE_TASK,
  payload,
});

// SUCCESS
export const successFetchTask = (payload: any) => ({
  type: TYPES.FETCH_TASKS_SUCCESS,
  payload,
});

export const successAddTask = (payload: any) => ({
  type: TYPES.ADD_TASK_SUCCESS,
  payload,
});

export const successEditTask = (payload: any) => ({
  type: TYPES.EDIT_TASK_SUCCESS,
  payload,
});

export const successDeleteTask = (payload: any) => ({
  type: TYPES.DELETE_TASK_SUCCESS,
  payload,
});
