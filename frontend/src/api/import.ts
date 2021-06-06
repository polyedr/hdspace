/* eslint-disable import/prefer-default-export */
import { myAxios } from '@Src/config/settings';
import { MyAxiosProps, PostUrlResponse, Result } from '@Src/types';
import { AxiosResponse } from 'axios';
import { handleError } from './helper';

export const apiPostURL = ({
  wpname,
  ...props
}: MyAxiosProps & { wpname: string }): Promise<Result<PostUrlResponse>> =>
  myAxios({
    ...props,
    url: '/uploadapps/wpg/',
    method: 'POST',
    contentType: 'application/json',
    data: {
      wpname,
      parse_with_splash: wpname.endsWith('/') ? 1 : 0,
      no_robots: process.env.NODE_ENV !== 'production',
    },
  })
    .then((res: AxiosResponse<PostUrlResponse>) => ({ result: res.data }))
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

export const apiGetFile = (props: MyAxiosProps & { fileUrl: string }) => {
  const { fileUrl, ...axiosProps } = props;
  return myAxios({
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
