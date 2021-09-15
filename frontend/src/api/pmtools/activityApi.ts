/* eslint-disable camelcase */
import { AxiosResponse } from 'axios';
import api from './common/apiController';
import getToken from './common/getToken';

const project = {
  name: 'string',
  status: 'paid',
  projectscreen: [],
  user: {
    username: 'string',
    email: 'user@example.com',
    first_name: 'string',
    last_name: 'string',
    date_joined: '2021-08-18T05:11:31.773Z',
    password: 'string',
    is_active: true,
  },
  project_data_text: '',
  project_data_json: '',
};

async function addActions(data: any) {
  try {
    const config = await getToken();
    const { projectData, action, projectId } = data;
    projectData.push(action);
    project.project_data_text = projectData.join('/');

    const res: AxiosResponse = await api.patch(
      `/projects/projects/${projectId}/`,
      project,
      config,
    );
    return res.data;
  } catch (e) {
    return e;
  }
}

async function getActions(projectId: number) {
  try {
    const config = await getToken();
    const res: AxiosResponse = await api.get(
      `/projects/projects/${projectId}/`,
      config,
    );
    const result: Array<string> | [] = res.data.project_data_text
      ? res.data.project_data_text.split('/')
      : [];
    return await result;
  } catch (e) {
    return e;
  }
}

async function clearHistory(projectId: number) {
  try {
    const config = await getToken();
    project.project_data_text = '';
    const res: AxiosResponse = await api.patch(
      `/projects/projects/${projectId}/`,
      project,
      config,
    );
    return res.data.project_data_text;
  } catch (e) {
    return e;
  }
}

const Activity = {
  addActions,
  getActions,
  clearHistory,
};

export default Activity;
