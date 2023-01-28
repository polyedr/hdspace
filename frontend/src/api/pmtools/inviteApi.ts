/* eslint-disable import/prefer-default-export */
import { handleError } from '@Api/helper';
import { myAxios } from '@Src/config/settings';
import { MyAxiosProps, ServerProject } from '@Src/types';
import { AxiosResponse } from 'axios';

type ToServerActionApi = { data: ServerProject } & MyAxiosProps & {
    project: ServerProject['id'];
  };

export const apiSendEmail = async ({
  data,
  ...axiosProps
}: ToServerActionApi) =>
  await myAxios({
    ...axiosProps,
    data: { email: data },
    method: 'POST',
    url: '/invitations/invitations/create-and-send/',
  })
    .then((results: AxiosResponse) => results)
    .catch(handleError);
