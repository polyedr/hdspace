import TYPES from '@Redux/actionTypes';
import { BoardTask, BoardTaskCheckListItem } from '@Redux/pmtools/types';

export const requestCreateChecklistItem = (text: string, task: BoardTask) => ({
  type: TYPES.BOARD_CHECKLIST_ITEM_CREATE_REQUESTED,
  text,
  task,
});

export const checklistItemCreated = (
  item: BoardTaskCheckListItem,
  task: BoardTask,
) => ({
  type: TYPES.BOARD_CHECKLIST_ITEM_CREATED,
  item,
  task,
});

export const requestUpdateChecklistItem = (
  item: Partial<BoardTaskCheckListItem> & { id: number },
  task: BoardTask,
) => ({
  type: TYPES.BOARD_CHECKLIST_ITEM_UPDATE_REQUESTED,
  item,
  task,
});

export const checklistItemUpdated = (
  item: Partial<BoardTaskCheckListItem> & { id: number },
  task: BoardTask,
) => ({
  type: TYPES.BOARD_CHECKLIST_ITEM_UPDATED,
  item,
  task,
});

export const requestDeleteChecklistItem = (
  itemId: number,
  task: BoardTask,
) => ({
  type: TYPES.BOARD_CHECKLIST_ITEM_DELETE_REQUESTED,
  itemId,
  task,
});

export const checklistItemDeleted = (itemId: number, task: BoardTask) => ({
  type: TYPES.BOARD_CHECKLIST_ITEM_DELETED,
  itemId,
  task,
});

export const requestDeleteChecklist = (task: BoardTask) => ({
  type: TYPES.BOARD_CHECKLIST_DELETE_REQUESTED,
  task,
});

export const checklistDeleted = (task: BoardTask) => ({
  type: TYPES.BOARD_CHECKLIST_DELETED,
  task,
});
