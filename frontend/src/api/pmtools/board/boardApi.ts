/* eslint-disable import/prefer-default-export */

import { handleError } from '@Api/helper';
import config from '@Constants/configTrello';
import { myAxios } from '@Src/config/settings';
import { AxiosResponse } from 'axios';

const { apiKey, token } = config;

export const deleteOrganization = async (id: string) =>
  myAxios({
    baseURL: 'https://api.trello.com/1',
    method: 'DELETE',
    url: `/organization/${id}?key=${apiKey}&token=${token}`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);

export const createOrganization = async (name: string) =>
  myAxios({
    baseURL: 'https://api.trello.com/1',
    method: 'POST',
    url: `/organizations?displayName=${name}&key=${apiKey}&token=${token}`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);

export const getUserByEmail = async (email: string) =>
  myAxios({
    baseURL: 'https://api.trello.com/1',
    method: 'GET',
    url: `/members/${email}?key=${apiKey}&token=${token}`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);

export const getAddUserToBoard = async (email: string, boardId: string) =>
  myAxios({
    baseURL: 'https://api.trello.com/1',
    method: 'PUT',
    url: `/boards/${boardId}/members?email=${email}&key=${apiKey}&token=${token}`,
  }).then((results: AxiosResponse) => results.data);

export const getRemoveUserToBoard = async (userId: string, boardId: string) =>
  myAxios({
    baseURL: 'https://api.trello.com/1',
    method: 'DELETE',
    url: `/boards/${boardId}/members/${userId}?key=${apiKey}&token=${token}`,
  }).then((results: AxiosResponse) => results.data);
