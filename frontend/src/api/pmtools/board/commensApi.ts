import { handleError } from '@Api/helper';
import { myAxios } from '@Src/config/settings';
import { MyAxiosProps } from '@Src/types';

export const createComment = async ({
  text,
  taskId,
  ...options
}: MyAxiosProps & { taskId: number; text: string }) =>
  await myAxios({
    url: '/projects/columntask-comments/',
    method: 'post',
    data: {
      text,
      columntask: taskId,
    },
    ...options,
  }).catch(handleError);

export const updateComment = async ({
  text,
  commentId,
  ...options
}: MyAxiosProps & { commentId: number; text: string }) =>
  await myAxios({
    url: `/projects/columntask_comments/${commentId}/`,
    method: 'patch',
    data: {
      text,
    },
    ...options,
  }).catch(handleError);

export const deleteComment = async ({
  commentId,
  ...options
}: MyAxiosProps & { commentId: number }) =>
  await myAxios({
    url: `/projects/columntask_comments/${commentId}/`,
    method: 'delete',
    ...options,
  }).catch(handleError);
