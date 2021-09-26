/* eslint-disable camelcase */
import { handleError } from '@Api/helper';
import { myAxios } from '@Src/config/settings';
import { AxiosResponse } from 'axios';
import api from './common/apiController';
import getToken from './common/getToken';

async function addActions({ project, access, projectId }) {
  try {
    const config = await getToken();
    const res: AxiosResponse = await api.patch(
      `/projects/projects/${projectId}/`,
      project,
      config,
    );
    myAxios({
      access,
      data: project,
      method: 'PATCH',
      url: `/projects/projects/${projectId}/`,
    })
      .then((results: AxiosResponse) => results)
      .catch(handleError);

    return res.data;
  } catch (e) {
    return e;
  }
}

const getActions = (project, access) =>
  myAxios({
    access,
    method: 'GET',
    url: `/projects/projects/${project}/`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);

const clearHistory = ({ project, access, projectId }: any) =>
  myAxios({
    access,
    data: project,
    method: 'PATCH',
    url: `/projects/projects/${projectId}/`,
  })
    .then((results: AxiosResponse) => results)
    .catch(handleError);

const Activity = {
  addActions,
  getActions,
  clearHistory,
};

export default Activity;
