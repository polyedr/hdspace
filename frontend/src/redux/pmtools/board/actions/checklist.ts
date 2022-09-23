import TYPES from '@Redux/actionTypes';
import { BoardTask } from '@Redux/pmtools/types';

export const requestCreateChecklistItem = (text: string, task: BoardTask) => ({
  type: TYPES.BOARD_CHECKLIST_ITEM_CREATE_REQUESTED,
  text,
  task,
});

export const checklistItemCreated = (item: any, task: BoardTask) => ({
  type: TYPES.BOARD_CHECKLIST_ITEM_CREATED,
  item,
  task,
});

export const requestUpdateChecklistItem = (item: any, task: BoardTask) => ({
  type: TYPES.BOARD_CHECKLIST_ITEM_UPDATE_REQUESTED,
  item,
  task,
});

export const checklistIteUpdated = (item: string, task: BoardTask) => ({
  type: TYPES.BOARD_CHECKLIST_ITEM_CREATED,
  item,
  task,
});

export const requestDeleteChecklistItem = (item: any, task: BoardTask) => ({
  type: TYPES.BOARD_CHECKLIST_ITEM_UPDATE_REQUESTED,
  item,
  task,
});

export const checklistIteDeleted = (itemId: number, task: BoardTask) => ({
  type: TYPES.BOARD_CHECKLIST_ITEM_CREATED,
  itemId,
  task,
});
