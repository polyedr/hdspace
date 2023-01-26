/* eslint-disable import/prefer-default-export */
import { myAxios } from '@Src/config/settings';
import {
  MyAxiosProps,
  PostUrlResponse,
  Result,
  PostURLCheckRobots,
} from '@Src/types';
import { AxiosResponse } from 'axios';
import { handleError } from './helper';

export const apiPostURL = async ({
  wpname,
  ...props
}: MyAxiosProps & { wpname: string }): Promise<Result<PostUrlResponse>> =>
  await myAxios({
    ...props,
    url: '/uploadapps/wpg/',
    method: 'POST',
    contentType: 'application/json',
    data: {
      wpname,
      parse_with_splash: wpname.endsWith('/') ? 1 : 0,
      no_robots: import.meta.env.MODE !== 'production',
    },
  })
    .then((res: AxiosResponse<PostUrlResponse>) => ({ result: res.data }))
    .catch(handleError);

export const apiPostURLCheckRobots = async ({
  fileurl,
  ...props
}: MyAxiosProps & { fileurl: string }): Promise<Result<PostURLCheckRobots>> =>
  await myAxios({
    ...props,
    url: '/uploadapps/robots/',
    method: 'POST',
    contentType: 'application/json',
    data: {
      fileurl,
    },
  })
    .then((res: AxiosResponse<PostURLCheckRobots>) => ({ result: res.data }))
    .catch(handleError);

export const apiGetWebPage = async ({
  wpname,
  ...props
}: MyAxiosProps & { wpname: string }) =>
  await myAxios({
    ...props,
    url: wpname,
    method: 'GET',
    responseType: 'blob',
    contentType: 'application/zip; application/octet-stream',
  })
    .then((res) => res.data)
    .catch(handleError);

export const apiGetFile = async (props: MyAxiosProps & { fileUrl: string }) => {
  const { fileUrl, ...axiosProps } = props;
  return await myAxios({
    ...axiosProps,
    url: '/uploadapps/',
    method: 'POST',
    data: {
      ...axiosProps.data,
      fileurl: fileUrl,
    },
  })
    .then((res) => res.data)
    .catch(handleError);
};
