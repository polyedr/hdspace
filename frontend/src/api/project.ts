import { AxiosResponse } from 'axios';
import {
  convertProjectFromResponse,
  convertProjectWithScreensFromResponse,
} from './converters/fromResponse';
import { myAxios } from '../config/settings';
import {
  MyAxiosProps,
  PaginatedResponse,
  Project,
  ProjectWithScreens,
  Result,
  ServerProject,
  ServerProjectWithScreens,
} from '../types';

import {
  handleError,
  onError,
  parseCursor,
  handleErrorResponseMessage,
} from './helper';

export const apiGetProjectList = async (
  props: MyAxiosProps,
): Promise<Result<PaginatedResponse<Project>>> =>
  await myAxios({
    ...props,
    method: 'GET',
    url: '/projects/projects/',
  })
    .then((result: AxiosResponse<PaginatedResponse<ServerProject>>) => ({
      result: {
        next: parseCursor(result.data.next),
        previous: parseCursor(result.data.previous),
        results: result.data.results.map(convertProjectFromResponse),
      },
    }))
    .catch(handleError);

// TODO: research here IProject or IProjectList in return type:
export const apiGetProject = async (
  props: MyAxiosProps & { id: string },
): Promise<Project> =>
  await myAxios({
    ...props,
    method: 'GET',
    url: `/projects/projects/${props.id}/`,
  })
    .then((result) => convertProjectFromResponse(result.data))
    .catch(onError);

export const apiGetProjectWithScreens = async (
  props: MyAxiosProps & { id: string },
): Promise<Result<ProjectWithScreens>> =>
  await myAxios({
    ...props,
    method: 'GET',
    url: `projects/screens-for-project/${props.id}/`,
  })
    .then((res: AxiosResponse<ServerProjectWithScreens>) => ({
      result: convertProjectWithScreensFromResponse(res.data),
    }))
    .catch(handleError);

export const apiCreateProject = async (
  props: MyAxiosProps,
): Promise<Result<Project>> =>
  await myAxios({
    ...props,
    method: 'POST',
    url: '/projects/projects/',
    data: props.data,
  })
    .then((result: AxiosResponse<ServerProject>) => ({
      result: convertProjectFromResponse(result.data),
    }))
    .catch(handleErrorResponseMessage);

export const apiDeleteProject = async (props: MyAxiosProps & { id: string }) =>
  await myAxios({
    ...props,
    method: 'DELETE',
    url: `/projects/projects/${props.id}/`,
  })
    .then((res) => ({
      result: res.status === 204,
    }))
    .catch(handleError);

export const apiUpdateProject = async (
  props: MyAxiosProps,
): Promise<Result<Project>> =>
  await myAxios({
    ...props,
    method: 'PATCH',
    url: `/projects/projects/${props.data.id}/`,
  })
    .then((result: AxiosResponse<ServerProject>) => ({
      result: convertProjectFromResponse(result.data),
    }))
    .catch(handleError);

export const apigetSharedProject = async (
  props: MyAxiosProps & { shortuuid_token: string },
) =>
  await myAxios({
    ...props,
    method: 'GET',
    params: { shortuuid_token: props.shortuuid_token },
    url: '/accounts/sharedlinks/?shortuuid_token=',
  })
    .then((result) => ({
      result: result.data,
    }))
    .catch(onError);
