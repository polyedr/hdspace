import { handleError } from '@Api/helper';
import { myAxios } from '@Src/config/settings';
import { RequestColumn, RequestTask } from '@Src/types/pmtools/actions';
import { MyAxiosProps } from '@Src/types/types';
import { AxiosResponse } from 'axios';

const board = '1mRQPFar';
const apiKey = 'e97882cd87cb5e93e9a78e875ab0379b';
const token =
  '453ed0540009ad48b587d296957a530b0cd2f25bc35ef29242a99f068e9c7091';

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

export const fetchTasks = ({ ...axiosProps }: MyAxiosProps) =>
  myAxios({
    ...axiosProps,
    baseURL: 'https://api.trello.com/1',
    method: 'GET',
    url: `/boards/${board}/cards?key=${apiKey}&token=${token}`,
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

export const createTask = ({
  data,
  ...axiosProps
}: RequestTask & MyAxiosProps) =>
  myAxios({
    ...axiosProps,
    data: { name: data.name },
    baseURL: 'https://api.trello.com/1',
    method: 'POST',
    url: `/cards?idList=${data.column}&key=${apiKey}&token=${token}`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);

export const updateTask = ({
  data,
  ...axiosProps
}: RequestTask & MyAxiosProps) =>
  myAxios({
    ...axiosProps,
    data: {
      name: data.name,
    },
    baseURL: 'https://api.trello.com/1',
    method: 'PUT',
    url: `/cards/${data.id}?key=${apiKey}&token=${token}`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);

export const deleteTask = ({
  taskId,
  ...axiosProps
}: { taskId: number } & MyAxiosProps) =>
  myAxios({
    ...axiosProps,
    baseURL: 'https://api.trello.com/1',
    method: 'DELETE',
    url: `/cards/${taskId}?key=${apiKey}&token=${token}`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);
