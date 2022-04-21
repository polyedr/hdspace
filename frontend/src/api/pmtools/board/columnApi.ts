import { handleError } from '@Api/helper';
import config from '@Constants/pmtools/trelloConfigData';
import { myAxios } from '@Src/config/settings';
import { CreatorColumnType, UpdateListType } from '@Src/types/pmtools/types';
import { MyAxiosProps } from '@Src/types';
import { AxiosResponse } from 'axios';

const { apiKey, token } = config;

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
}: { data: CreatorColumnType } & MyAxiosProps) =>
  myAxios({
    ...axiosProps,
    baseURL: 'https://api.trello.com/1',
    method: 'POST',
    url: `/lists?name=${data.name}&idBoard=${data.id}&key=${apiKey}&token=${token}&pos=bottom`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);

export const updateColumn = ({
  data: { id, name },
  ...axiosProps
}: CreatorColumnType & MyAxiosProps) => {
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

export const apiUpdateColumnPos = ({ listId, newPos }: UpdateListType) =>
  myAxios({
    baseURL: 'https://api.trello.com/1',
    url: `/list/${listId}?key=${apiKey}&token=${token}`,
    method: 'PUT',
    data: {
      pos: newPos,
    },
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);
