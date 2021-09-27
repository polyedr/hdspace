import { handleError } from '@Api/helper';
import { myAxios } from '@Src/config/settings';
import { IColumn, IFromServerTask, ITask } from '@Src/pm-types/board/types';
import { AxiosResponse } from 'axios';

const fetchColumns = async (projectId, access) =>
  myAxios({
    access,
    method: 'GET',
    url: `/projects/project-columns/?project=${projectId}`,
  })
    .then((results: AxiosResponse) => results.data.results)
    .catch(handleError);

const fetchTasks = (access) =>
  myAxios({
    access,
    method: 'GET',
    url: `/projects/column-tasks/`,
  })
    .then((results: AxiosResponse) => {
      return results.data.results.map((item: IFromServerTask) => ({
        ...item,
        category: 'Readers',
        isCompleted: item.status !== 'created',
        status: undefined,
      }));
    })
    .catch(handleError);

const createColumn = (data: any) =>
  myAxios({
    access: data.access,
    data,
    method: 'POST',
    url: `/projects/project-columns/`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);

const updateColumn = (data: any) =>
  myAxios({
    access: data.access,
    data,
    method: 'PATCH',
    url: `/projects/project-columns/${data.id}/`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);

const deleteColumn = (columnId: IColumn['id'], access: string) =>
  myAxios({
    access,
    method: 'DELETE',
    url: `/projects/project-columns/${columnId}/`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);

const createTask = (data: any) =>
  myAxios({
    access: data.access,
    data,
    method: 'POST',
    url: `/projects/column-tasks/`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);

const updateTask = (data: any) =>
  myAxios({
    access: data.access,
    data,
    method: 'PATCH',
    url: `/projects/column-tasks/${data.id}/`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);

const deleteTask = (taskId: ITask['id'], access: string) =>
  myAxios({
    access,
    method: 'DELETE',
    url: `/projects/column-tasks/${taskId}/`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);

const Board = {
  fetchColumns,
  fetchTasks,
  createColumn,
  updateColumn,
  deleteColumn,
  createTask,
  updateTask,
  deleteTask,
};

export default Board;
