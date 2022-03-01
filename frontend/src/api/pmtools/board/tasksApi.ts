import { handleError } from '@Api/helper';
import config from '@Constants/pmtools/trelloConfigData';
import { AddTaskType } from '@Redux/pmtools/board/actions/tasks';
import { myAxios } from '@Src/config/settings';
import { MoveCardToListType } from '@Src/types/pmtools/types';
import { MyAxiosProps } from '@Src/types';
import { AxiosResponse } from 'axios';

const { apiKey, token } = config;

export const addMemberToTasks = (cardId: string, userId: string) => {
  return myAxios({
    baseURL: 'https://api.trello.com/1',
    method: 'POST',
    data: { value: userId },
    url: `/cards/${cardId}/idMembers?key=${apiKey}&token=${token}`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);
};

export const deleteMemberToTasks = (cardId: string, userId: string) => {
  return myAxios({
    baseURL: 'https://api.trello.com/1',
    method: 'DELETE',
    url: `/cards/${cardId}/idMembers/${userId}?key=${apiKey}&token=${token}`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);
};
export const fetchTasks = (boardId) =>
  myAxios({
    baseURL: 'https://api.trello.com/1',
    method: 'GET',
    url: `/boards/${boardId}/cards?key=${apiKey}&token=${token}`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);

export const createTask = ({
  data: { name, id },
  ...axiosProps
}: AddTaskType & MyAxiosProps) =>
  myAxios({
    ...axiosProps,
    data: { name },
    baseURL: 'https://api.trello.com/1',
    method: 'POST',
    url: `/cards?idList=${id}&key=${apiKey}&token=${token}`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);

export const updateTask = ({
  data,
  ...axiosProps
}: AddTaskType & MyAxiosProps) =>
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

export const apiGetMembersOfBoard = (boardId) =>
  myAxios({
    baseURL: 'https://api.trello.com/1',
    url: `/boards/${boardId}/members?key=${apiKey}&token=${token}`,
    method: 'GET',
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);
