import { handleError } from '@Api/helper';
import config from '@Constants/configTrello';
import { myAxios } from '@Src/config/settings';
import { RequestAction, RequestColumn } from '@Src/types/pmtools/actions';
import { MyAxiosProps } from '@Src/types/types';
import { AxiosResponse } from 'axios';

const { apiKey, token } = config;

export const apiGetBoard = ({
  project,
  ...axiosProps
}: MyAxiosProps & { project: RequestAction['project'] }) =>
  myAxios({
    ...axiosProps,
    method: 'GET',
    url: `/projects/projects/${project}/`,
  })
    .then((results: AxiosResponse) => results.data.project_data_trello_json)
    .catch(handleError);

export const apiGetBoardName = ({
  project,
  ...axiosProps
}: MyAxiosProps & { project: RequestAction['project'] }) =>
  myAxios({
    ...axiosProps,
    method: 'GET',
    url: `/projects/projects/${project}/`,
  })
    .then((results: AxiosResponse) => results.data.project_data_text)
    .catch(handleError);

export const createNewBoard = async ({ name }: { name: string }) =>
  myAxios({
    baseURL: 'https://api.trello.com/1',
    method: 'POST',
    url: `/boards/?name=${name}&key=${apiKey}&token=${token}`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);

export const fetchColumns = async (boardId: string) =>
  myAxios({
    baseURL: 'https://api.trello.com/1',
    method: 'GET',
    url: `/boards/${boardId}/lists?key=${apiKey}&token=${token}`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);

export const createColumn = ({
  data,
  ...axiosProps
}: { data: RequestColumn } & MyAxiosProps) =>
  myAxios({
    ...axiosProps,
    baseURL: 'https://api.trello.com/1',
    method: 'POST',
    url: `/lists?name=${data.name}&idBoard=${data.id}&key=${apiKey}&token=${token}`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);

export const updateColumn = ({
  data: { id, name },
  ...axiosProps
}: RequestColumn & MyAxiosProps) => {
  return myAxios({
    ...axiosProps,
    data: { name },
    baseURL: 'https://api.trello.com/1',
    method: 'PUT',
    url: `/lists/${id}/?key=${apiKey}&token=${token}`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);
};

export const deleteColumn = ({
  columnId,
  ...axiosProps
}: { columnId: number } & MyAxiosProps) =>
  myAxios({
    ...axiosProps,
    method: 'PUT',
    data: { value: true },
    baseURL: 'https://api.trello.com/1',
    url: `/lists/${columnId}/closed?key=${apiKey}&token=${token}`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);
