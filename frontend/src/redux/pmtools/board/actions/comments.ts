import TYPES from '@Redux/actionTypes';
import { BoardTask, BoardTaskComment } from '@Redux/pmtools/types';

export const createComment = (text: string, task: BoardTask) => ({
  type: TYPES.BOARD_TASK_CREATE_COMMENT,
  text,
  task,
});

export const addComment = (comment: BoardTaskComment, task: BoardTask) => ({
  type: TYPES.BOARD_TASK_ADD_COMMENT,
  comment,
  task,
});

export const addComments = (comments) => ({
  type: TYPES.BOARD_TASK_ADD_COMMENTS,
  comments,
});

export const editComment = (text: string, comment: BoardTaskComment) => ({
  type: TYPES.BOARD_TASK_EDIT_COMMENT,
  payload: { text, comment },
});

export const updateComment = (comment) => ({
  type: TYPES.BOARD_TASK_UPDATE_COMMENT,
  comment,
});

export const deleteComment = (comment: BoardTaskComment) => ({
  type: TYPES.BOARD_TASK_DELETE_COMMENT,
  comment,
});
