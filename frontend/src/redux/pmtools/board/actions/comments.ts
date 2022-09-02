import TYPES from '@Redux/actionTypes';

export const createComment = (text: string, taskId: number) => ({
  type: TYPES.BOARD_TASK_CREATE_COMMENT,
  payload: { text, taskId },
});

export const deleteComment = (commentId: number) => ({
  type: TYPES.BOARD_TASK_DELETE_COMMENT,
  commentId,
});
