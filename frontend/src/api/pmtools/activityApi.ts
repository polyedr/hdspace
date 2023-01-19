import { handleError } from '@Api/helper';
import { myAxios } from '@Src/config/settings';
import { MyAxiosProps, ServerProject } from '@Src/types';
import { AxiosResponse } from 'axios';

type ToServerActionApi = { data: ServerProject } & MyAxiosProps & {
    project: ServerProject['id'];
  };

export const apiAddActions = async ({
  data,
  project,
  ...axiosProps
}: ToServerActionApi) =>
  await myAxios({
    ...axiosProps,
    data,
    method: 'PATCH',
    url: `/projects/projects/${project}/`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);

export const apiGetActions = async ({
  project,
  ...axiosProps
}: MyAxiosProps & { project: ServerProject['id'] }) =>
  await myAxios({
    ...axiosProps,
    method: 'GET',
    url: `/projects/projects/${project}/`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);

export const apiClearHistory = async ({
  project,
  ...axiosProps
}: MyAxiosProps & { project: ServerProject['id'] }) =>
  await myAxios({
    ...axiosProps,
    method: 'PATCH',
    url: `/projects/projects/${project}/`,
  })
    .then((results: AxiosResponse) => results)
    .catch(handleError);
