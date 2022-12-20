import { handleError } from '@Api/helper';
import { myAxios } from '@Src/config/settings';
import { MyAxiosProps } from '@Src/types';

export const deleteTask = ({ taskId, ...options }) => {
  return myAxios({
    url: `/projects/column-tasks/${taskId}/`,
    method: 'delete',
    ...options,
  }).catch(handleError);
};

export const fetchTask = ({ taskId, ...options }) => {
  return myAxios({
    url: `/projects/column-tasks/${taskId}/`,
    method: 'get',
    ...options,
  }).catch(handleError);
};

export const fetchTasks = ({ projectId, ...options }) => {
  return myAxios({
    url: `/projects/column-tasks/?column__project=${projectId}`,
    method: 'get',
    ...options,
  }).catch(handleError);
};

export const createTask = ({
  title,
  columnId,
  ...options
}: MyAxiosProps & {
  title: string;
  columnId: number;
}) => {
  return myAxios({
    url: `/projects/column-tasks/`,
    method: 'post',
    data: {
      title,
      column: columnId,
    },
    ...options,
  }).catch(handleError);
};

export const updateTask = ({
  fields,
  taskId,
  ...options
}: MyAxiosProps & {
  title: string;
  taskId: number;
  fields: { [key: string]: string };
}) => {
  return myAxios({
    url: `/projects/column-tasks/${taskId}/`,
    method: 'patch',
    data: fields,
    ...options,
  }).catch(handleError);
};

export const updateTasksSequence = ({
  columnId,
  ...options
}: MyAxiosProps & {
  columnId: number;
}) => {
  return myAxios({
    url: `/projects/column/update_children_order/${columnId}/`,
    method: 'patch',
    ...options,
  }).catch(handleError);
};

export const deleteColumn = ({
  columnId,
  ...options
}: MyAxiosProps & {
  columnId: number;
}) => {
  return myAxios({
    url: `/projects/project-columns/${columnId}/`,
    method: 'delete',
    ...options,
  }).catch(handleError);
};
