import { handleError } from '@Api/helper';
import { myAxios } from '@Src/config/settings';
import { MyAxiosProps } from '@Src/types/types';
import { AxiosResponse } from 'axios';

export const apiAddActions = (props) => {
  const { data, project, ...axiosProps } = props;
  return myAxios({
    ...axiosProps,
    data,
    method: 'PATCH',
    url: `/projects/projects/${project}/`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);
};

export const apiGetActions = (props: MyAxiosProps & { project: number }) => {
  const { project, ...axiosProps } = props;
  return myAxios({
    ...axiosProps,
    method: 'GET',
    url: `/projects/projects/${project}/`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);
};

export const apiClearHistory = (props) => {
  const { project, data, ...axiosProps } = props;
  return myAxios({
    ...axiosProps,
    data,
    method: 'PATCH',
    url: `/projects/projects/${project}/`,
  })
    .then((results: AxiosResponse) => results)
    .catch(handleError);
};
