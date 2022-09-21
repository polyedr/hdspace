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

export const deleteComment = (commentId: number, task: BoardTask) => ({
  type: TYPES.BOARD_TASK_DELETE_COMMENT,
  commentId,
  task,
});

export const removeComment = (commentId: number, task: BoardTask) => ({
  type: TYPES.BOARD_TASK_REMOVE_COMMENT,
  commentId,
  task,
});

export const requestUpdateComment = (
  text: string,
  commentId: number,
  task: BoardTask,
) => ({
  type: TYPES.BOARD_COMMENT_UPDATE_REQUESTED,
  text,
  commentId,
  task,
});

export const commentUpdated = (
  comment: Partial<BoardTaskComment> & { id: number },
  task: BoardTask,
) => ({
  type: TYPES.BOARD_TASK_COMMENT_UPDATED,
  comment,
  task,
});
