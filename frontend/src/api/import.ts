/* eslint-disable import/prefer-default-export */
import { myAxios } from '@Src/config/settings';
import { MyAxiosProps, PostUrlResponse } from '@Src/types';
import { AxiosResponse } from 'axios';
import { onError } from './project';

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
    .catch(onError);

export const apiGetWebPage = ({
  wpname,
  ...props
}: MyAxiosProps & { wpname: string }) =>
  fetch(wpname).then((res) => res.blob());
/* myAxios({
    ...props,
    url: wpname,
    method: 'GET',
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/zip; application/octet-stream',
      Accept: 'application/zip; application/octet-stream',
    },
    contentType: 'application/zip; application/octet-stream',
  }).then((res) => {
    // const test = new Blob([res.data], { type: 'octet/stream' });
    const blob = new Blob([res.data], { type: 'octet/stream' });
    return blob;
    // return res.data;
  }); */
