import TYPES from '@Redux/actionTypes';
import { BoardLabel, BoardTask } from '@Redux/pmtools/types';

export const setProjectLabels = (labels: BoardLabel[]) => ({
  type: TYPES.BOARD_SET_PROJECT_LABELS,
  labels,
});

export const updateTaskLabels = (labels: BoardLabel[], task: BoardTask) => ({
  type: TYPES.BOARD_UPDATE_TASK_LABELS,
  labels,
  task,
});

export const storeTaskLabels = (labels: BoardLabel[], task: BoardTask) => ({
  type: TYPES.BOARD_STORE_TASK_LABELS,
  labels,
  task,
});

export const addProjectLabel = (label: BoardLabel) => ({
  type: TYPES.BOARD_ADD_PROJECT_LABEL,
  label,
});

export const createProjectLabel = (text: string, colour: string) => ({
  type: TYPES.BOARD_CREATE_PROJECT_LABEL,
  text,
  colour,
});
