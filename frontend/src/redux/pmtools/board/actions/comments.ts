import TYPES from '@Redux/actionTypes';

export const createComment = (text: string, taskId: number) => ({
  type: TYPES.BOARD_TASK_CREATE_COMMENT,
  payload: { text, taskId },
});

export const addComment = (comment: string, taskId: number) => ({
  type: TYPES.BOARD_TASK_ADD_COMMENT,
  payload: { comment, taskId },
});

export const addComments = (comments) => ({
  type: TYPES.BOARD_TASK_ADD_COMMENTS,
  comments,
});

export const editComment = (text: string, commentId: number) => ({
  type: TYPES.BOARD_TASK_EDIT_COMMENT,
  payload: { text, commentId },
});

export const updateComment = (comment) => ({
  type: TYPES.BOARD_TASK_UPDATE_COMMENT,
  comment,
});

export const deleteComment = (commentId: number) => ({
  type: TYPES.BOARD_TASK_DELETE_COMMENT,
  commentId,
});
