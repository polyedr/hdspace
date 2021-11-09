import { handleError } from '@Api/helper';
import config from '@Constants/trelloApi';
import { myAxios } from '@Src/config/settings';
import { RequestTask } from '@Src/types/pmtools/actions';
import { MoveCardToListType } from '@Src/types/pmtools/types';
import { MyAxiosProps } from '@Src/types/types';
import { AxiosResponse } from 'axios';

const { board, apiKey, token } = config;

export const fetchTasks = ({ ...axiosProps }: MyAxiosProps) =>
  myAxios({
    ...axiosProps,
    baseURL: 'https://api.trello.com/1',
    method: 'GET',
    url: `/boards/${board}/cards?key=${apiKey}&token=${token}`,
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
}: { taskId: string } & MyAxiosProps) =>
  myAxios({
    ...axiosProps,
    baseURL: 'https://api.trello.com/1',
    method: 'DELETE',
    url: `/cards/${taskId}?key=${apiKey}&token=${token}`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);

export const apiMoveCardToList = ({
  cardId,
  destination,
  newPos,
}: MoveCardToListType) =>
  myAxios({
    baseURL: 'https://api.trello.com/1',
    url: `/cards/${cardId}?key=${apiKey}&token=${token}`,
    method: 'PUT',
    data: {
      idList: destination,
      pos: newPos,
    },
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);
