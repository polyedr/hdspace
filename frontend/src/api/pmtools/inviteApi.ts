/* eslint-disable import/prefer-default-export */
import { handleError } from '@Api/helper';
import { myAxios } from '@Src/config/settings';
import { RequestAction } from '@Src/types/pmtools/actions';
import { MyAxiosProps, ServerProject } from '@Src/types/types';
import { AxiosResponse } from 'axios';

type ToServerActionApi = { data: ServerProject } & MyAxiosProps & {
    project: RequestAction['project'];
  };

export const apiSendEmail = ({ data, ...axiosProps }: ToServerActionApi) =>
  myAxios({
    ...axiosProps,
    data: { email: data },
    method: 'POST',
    url: `/invitations/invitations/create-and-send/`,
  })
    .then((results: AxiosResponse) => results)
    .catch(handleError);
