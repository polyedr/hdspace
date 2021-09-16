import { IColumn, IFromServerTask, ITask } from '@Src/pm-types/board/types';
import { AxiosResponse } from 'axios';
import api from './common/apiController';
import getToken from './common/getToken';

async function fetchColumns() {
  try {
    const config = await getToken();
    const res: AxiosResponse = await api.get(
      '/projects/project-columns/',
      config,
    );
    return res.data.results;
  } catch (e) {
    return e;
  }
}

async function fetchTasks() {
  try {
    const config = await getToken();
    const res: AxiosResponse = await api.get('/projects/column-tasks/', config);
    const tasks = res.data.results.map((item: IFromServerTask) => ({
      ...item,
      category: 'Readers',
      isCompleted: item.status !== 'created',
      status: undefined,
    }));
    return tasks;
  } catch (e) {
    return e;
  }
}

async function createColumn(data: any) {
  try {
    const config = await getToken();
    const res: AxiosResponse = await api.post(
      `/projects/project-columns/`,
      data,
      config,
    );
    if (res.status !== 201) {
      throw new Error('Failed to create column');
    }
    return res.data;
  } catch (e) {
    return e;
  }
}

async function updateColumn(data: any) {
  try {
    const config = await getToken();
    const res: AxiosResponse = await api.patch(
      `/projects/project-columns/${data.id}/`,
      data,
      config,
    );
    return res.data;
  } catch (e) {
    return e;
  }
}

async function deleteColumn(columnId: IColumn['id']) {
  try {
    const config = await getToken();
    const res: AxiosResponse = await api.delete(
      `/projects/project-columns/${columnId}/`,
      config,
    );
    if (res.status !== 204) {
      throw new Error('Failed to delete column');
    }
    return {
      result: true,
    };
  } catch (e) {
    return {
      error: e,
    };
  }
}

async function createTask(data: any) {
  try {
    const config = await getToken();
    const res: AxiosResponse = await api.post(
      `/projects/column-tasks/`,
      data,
      config,
    );
    return res.data;
  } catch (e) {
    return e;
  }
}

async function updateTask(data: any) {
  try {
    const config = await getToken();
    const res: AxiosResponse = await api.patch(
      `/projects/column-tasks/${data.id}/`,
      data,
      config,
    );
    return res.data;
  } catch (e) {
    return e;
  }
}

async function deleteTask(taskId: ITask['id']) {
  try {
    const config = await getToken();
    const res: AxiosResponse = await api.delete(
      `/projects/column-tasks/${taskId}/`,
      config,
    );
    return res;
  } catch (e) {
    return e;
  }
}

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
