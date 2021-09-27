import { handleError } from '@Api/helper';
import { myAxios } from '@Src/config/settings';
import { AxiosResponse } from 'axios';

const addActions = ({ project, access, projectId }) =>
  myAxios({
    access,
    data: project,
    method: 'PATCH',
    url: `/projects/projects/${projectId}/`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);

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
