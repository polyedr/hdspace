/* eslint-disable import/prefer-default-export */
import { myAxios } from '@Src/config/settings';
import { MyAxiosProps, PostUrlResponse } from '@Src/types';
import { AxiosResponse } from 'axios';
import { handleError } from './project';

export const apiPostURL = ({
  wpname,
  ...props
}: MyAxiosProps & { wpname: string }) =>
  myAxios({
    ...props,
    url: '/uploadapps/wpg/',
    method: 'POST',
    contentType: 'application/json',
    data: {
      wpname,
    },
  })
    .then((res: AxiosResponse<PostUrlResponse>) => res.data)
    .catch(handleError);

export const apiGetWebPage = ({
  wpname,
  ...props
}: MyAxiosProps & { wpname: string }) =>
  myAxios({
    ...props,
    url: wpname,
    method: 'GET',
    responseType: 'blob',
    contentType: 'application/zip; application/octet-stream',
  })
    .then((res) => res.data)
    .catch(handleError);
