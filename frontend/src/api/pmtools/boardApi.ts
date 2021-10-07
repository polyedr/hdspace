import { handleError } from '@Api/helper';
import { myAxios } from '@Src/config/settings';
import {
  FromServerTask,
  RequestColumn,
  RequestTask,
} from '@Src/types/pmtools/actions';
import { MyAxiosProps } from '@Src/types/types';
import { AxiosResponse } from 'axios';

export const fetchColumns = async (props) => {
  const { project, ...axiosProps } = props;
  return myAxios({
    ...axiosProps,
    method: 'GET',
    url: `/projects/project-columns/?project=${project}`,
  })
    .then((results: AxiosResponse) => results.data.results)
    .catch(handleError);
};

export const fetchTasks = ({ ...axiosProps }) =>
  myAxios({
    ...axiosProps,
    method: 'GET',
    url: `/projects/column-tasks/`,
  })
    .then((results: AxiosResponse) => {
      return results.data.results.map((item: FromServerTask) => ({
        ...item,
        category: 'Readers',
        isCompleted: item.status !== 'created',
        status: undefined,
      }));
    })
    .catch(handleError);

export const createColumn = ({ data, ...axiosProps }) =>
  myAxios({
    ...axiosProps,
    data,
    method: 'POST',
    url: `/projects/project-columns/`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);

export const updateColumn = ({
  data,
  ...axiosProps
}: RequestColumn & MyAxiosProps) =>
  myAxios({
    ...axiosProps,
    data,
    method: 'PATCH',
    url: `/projects/project-columns/${data.id}/`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);

export const deleteColumn = ({ columnId, ...axiosProps }) =>
  myAxios({
    ...axiosProps,
    method: 'DELETE',
    url: `/projects/project-columns/${columnId}/`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);

export const createTask = ({
  data,
  ...axiosProps
}: RequestTask & MyAxiosProps) =>
  myAxios({
    ...axiosProps,
    data,
    method: 'POST',
    url: `/projects/column-tasks/`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);

export const updateTask = ({
  data,
  ...axiosProps
}: RequestTask & MyAxiosProps) => {
  return myAxios({
    ...axiosProps,
    data,
    method: 'PATCH',
    url: `/projects/column-tasks/${data.id}/`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);
};

export const deleteTask = ({ taskId, ...axiosProps }) =>
  myAxios({
    ...axiosProps,
    method: 'DELETE',
    url: `/projects/column-tasks/${taskId}/`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);
