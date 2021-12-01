import { handleError } from '@Api/helper';
import { myAxios } from '@Src/config/settings';
import { MyAxiosProps, ServerProject } from '@Src/types/types';
import { AxiosResponse } from 'axios';

type ToServerActionApi = { data: ServerProject } & MyAxiosProps & {
    project: ServerProject['id'];
  };

export const apiAddActions = ({
  data,
  project,
  ...axiosProps
}: ToServerActionApi) =>
  myAxios({
    ...axiosProps,
    data,
    method: 'PATCH',
    url: `/projects/projects/${project}/`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);

export const apiGetActions = ({
  project,
  ...axiosProps
}: MyAxiosProps & { project: ServerProject['id'] }) =>
  myAxios({
    ...axiosProps,
    method: 'GET',
    url: `/projects/projects/${project}/`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);

export const apiClearHistory = ({
  project,
  ...axiosProps
}: MyAxiosProps & { project: ServerProject['id'] }) =>
  myAxios({
    ...axiosProps,
    method: 'PATCH',
    url: `/projects/projects/${project}/`,
  })
    .then((results: AxiosResponse) => results)
    .catch(handleError);
