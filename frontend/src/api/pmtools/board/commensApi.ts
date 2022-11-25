import { handleError } from '@Api/helper';
import { myAxios } from '@Src/config/settings';
import { MyAxiosProps } from '@Src/types';

export const createComment = ({
  text,
  taskId,
  ...options
}: MyAxiosProps & { taskId: number; text: string }) => {
  return myAxios({
    url: `/projects/columntask-comments/`,
    method: 'post',
    data: {
      text,
      columntask: taskId,
    },
    ...options,
  }).catch(handleError);
};

export const updateComment = ({
  text,
  commentId,
  ...options
}: MyAxiosProps & { commentId: number; text: string }) => {
  return myAxios({
    url: `/projects/columntask_comments/${commentId}/`,
    method: 'patch',
    data: {
      text,
    },
    ...options,
  }).catch(handleError);
};

export const deleteComment = ({
  commentId,
  ...options
}: MyAxiosProps & { commentId: number }) => {
  return myAxios({
    url: `/projects/columntask_comments/${commentId}/`,
    method: 'delete',
    ...options,
  }).catch(handleError);
};
