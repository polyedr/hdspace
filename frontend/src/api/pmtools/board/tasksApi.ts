import { handleError } from '@Api/helper';
import { myAxios } from '@Src/config/settings';
import { MyAxiosProps } from '@Src/types';

export const fetchTask = async ({ taskId, ...options }) =>
  await myAxios({
    url: `/projects/column-tasks/${taskId}/`,
    method: 'get',
    ...options,
  }).catch(handleError);

export const fetchTasks = async ({ projectId, ...options }) =>
  await myAxios({
    url: `/projects/column-tasks/?column__project=${projectId}`,
    method: 'get',
    ...options,
  }).catch(handleError);

export const createTask = async ({
  title,
  columnId,
  ...options
}: MyAxiosProps & {
  title: string;
  columnId: number;
}) =>
  await myAxios({
    url: '/projects/column-tasks/',
    method: 'post',
    data: {
      title,
      column: columnId,
    },
    ...options,
  }).catch(handleError);

export const updateTask = async ({
  fields,
  taskId,
  ...options
}: MyAxiosProps & {
  title: string;
  taskId: number;
  fields: Record<string, string>;
}) =>
  await myAxios({
    url: `/projects/column-tasks/${taskId}/`,
    method: 'patch',
    data: fields,
    ...options,
  }).catch(handleError);

export const updateTasksSequence = async ({
  columnId,
  ...options
}: MyAxiosProps & {
  columnId: number;
}) =>
  await myAxios({
    url: `/projects/column/update_children_order/${columnId}/`,
    method: 'patch',
    ...options,
  }).catch(handleError);

export const deleteColumn = async ({
  columnId,
  ...options
}: MyAxiosProps & {
  columnId: number;
}) =>
  await myAxios({
    url: `/projects/project-columns/${columnId}/`,
    method: 'delete',
    ...options,
  }).catch(handleError);
