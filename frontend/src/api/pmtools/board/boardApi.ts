/* eslint-disable import/prefer-default-export */

import { handleError } from '@Api/helper';
import config from '@Constants/configTrello';
import { myAxios } from '@Src/config/settings';
import { AxiosResponse } from 'axios';

const { apiKey, token } = config;

export const deleteBoard = async (id: string) =>
  myAxios({
    baseURL: 'https://api.trello.com/1',
    method: 'DELETE',
    url: `boards/${id}?key=${apiKey}&token=${token}`,
  })
    .then((results: AxiosResponse) => results.data)
    .catch(handleError);
