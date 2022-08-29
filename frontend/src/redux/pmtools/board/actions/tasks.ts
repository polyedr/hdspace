import TYPES from '@Redux/actionTypes';
// eslint-disable-next-line import/no-cycle
import { BoardNewTask, BoardTask } from '@Redux/pmtools/types';

export const addTask = (task: BoardTask) => ({
  type: TYPES.BOARD_ADD_TASK,
  task,
});

export const setTasks = (tasks) => ({
  type: TYPES.BOARD_SET_TASKS,
  tasks,
});

export const createTask = (task: BoardNewTask) => ({
  type: TYPES.BOARD_CREATE_TASK,
  task,
});
