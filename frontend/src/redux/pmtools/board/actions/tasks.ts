import { DropResult } from '@hello-pangea/dnd';
import TYPES from '@Redux/actionTypes';
// eslint-disable-next-line import/no-cycle
import { BoardNewTask, BoardTask } from '@Redux/pmtools/types';

export const fetchTask = (taskId: number) => ({
  type: TYPES.BOARD_FETCH_TASK,
  taskId,
});

export const updateTask = (task: BoardTask, fields: Record<string, any>) => ({
  type: TYPES.BOARD_UPDATE_TASK,
  payload: { task, fields },
});

export const updateTasksOrder = (dropResult: DropResult) => ({
  type: TYPES.BOARD_UPDATE_TASKS_ORDER,
  dropResult,
});

export const addTask = (task: BoardTask) => ({
  type: TYPES.BOARD_ADD_TASK,
  task,
});

export const setTask = (task: BoardTask) => ({
  type: TYPES.BOARD_SET_TASK,
  task,
});

export const setTasks = (tasks: BoardTask[]) => ({
  type: TYPES.BOARD_SET_TASKS,
  tasks,
});

export const createTask = (task: BoardNewTask) => ({
  type: TYPES.BOARD_CREATE_TASK,
  task,
});

export const deleteTask = (task: BoardTask) => ({
  type: TYPES.BOARD_DELETE_TASK,
  task,
});

export const removeTask = (task: BoardTask) => ({
  type: TYPES.BOARD_REMOVE_TASK,
  task,
});
