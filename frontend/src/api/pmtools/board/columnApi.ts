import { handleError } from '@Api/helper';
import config from '@Constants/trelloApi';
import { myAxios } from '@Src/config/settings';
import { RequestColumn } from '@Src/types/pmtools/actions';
import { MyAxiosProps } from '@Src/types/types';
import { AxiosResponse } from 'axios';

const { board, apiKey, token } = config;

export const getBoardData = async ({ ...axiosProps }: MyAxiosProps) =>
  myAxios({
    ...axiosProps,
    baseURL: 'https://api.trello.com/1',
    method: 'GET',
    url: `/boards/${board}?key=${apiKey}&token=${token}`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);

export const fetchColumns = async ({
  project,
  ...axiosProps
}: { project: RequestColumn['project'] } & MyAxiosProps) =>
  myAxios({
    ...axiosProps,
    baseURL: 'https://api.trello.com/1',
    method: 'GET',
    url: `/boards/${board}/lists?key=${apiKey}&token=${token}`,
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
  data,
  ...axiosProps
}: RequestColumn & MyAxiosProps) =>
  myAxios({
    ...axiosProps,
    data: { name: data.title },
    baseURL: 'https://api.trello.com/1',
    method: 'PUT',
    url: `/lists/${data.id}/?key=${apiKey}&token=${token}`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);

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
