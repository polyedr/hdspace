import TYPES from '@Redux/actionTypes';
import { DropResult } from 'react-beautiful-dnd';

export const setColumnsFetching = (fetching = true) => ({
  type: TYPES.BOARD_FETCH_COLUMNS_PENDING,
  fetching,
});

export const fetchBoard = (projectId: number) => ({
  type: TYPES.BOARD_FETCH,
  projectId,
});

export const updateColumnsOrder = (dropResult: DropResult) => ({
  type: TYPES.BOARD_UPDATE_COLUMNS_ORDER,
  dropResult,
});

export const updateTasksOrder = (dropResult: DropResult) => ({
  type: TYPES.BOARD_UPDATE_TASKS_ORDER,
  dropResult,
});

export const setColumns = (columns) => ({
  type: TYPES.BOARD_SET_COLUMNS,
  columns,
});

export const setTasks = (tasks) => ({
  type: TYPES.BOARD_SET_TASKS,
  tasks,
});
