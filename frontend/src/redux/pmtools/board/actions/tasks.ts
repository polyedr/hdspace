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
