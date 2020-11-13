/* eslint-disable no-console */

import { AxiosResponse, AxiosError } from 'axios';
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

export const onError = ({ response: r }: AxiosError) => {
  const response = r as any;
  if (typeof response !== 'undefined') {
    switch (response.status) {
      case 400:
        return {
          msg: 'Incorrect request.',
          response,
        };
      case 401:
        return {
          msg: 'User not authorised!',
          response,
        };
      case 403:
        return {
          msg: 'Given token not valid for any token type.',
          response,
        };
      case 404:
        return {
          msg: 'Page not found!',
          response,
        };
      case response.status >= 500:
        return {
          msg: 'Server error. Please, try later.',
          response,
        };
      default:
        return response.statusText;
    }
  } else {
    const errorMsg =
      'Request is not present in axios error, look at onError handler!';
    console.error(errorMsg);
    return {
      msg: 'Request is not present in axios error, look at onError handler!',
      response,
    };
  }
};

export const parseResult = <T>(result: AxiosResponse<T>) => result?.data;

export const parseCursor = (nextUrl: string | null) => {
  if (nextUrl === null) {
    return null;
  }
  return new URL(nextUrl).searchParams.get('cursor');
};

export const apiGetProjectList = (
  props: MyAxiosProps,
): Promise<Result<PaginatedResponse<Project>>> =>
  myAxios({
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
    .catch((error) => ({ error }));

// TODO: research here IProject or IProjectList in return type:
export const apiGetProject = (
  props: MyAxiosProps & { id: string },
): Promise<Project> =>
  myAxios({
    ...props,
    method: 'GET',
    url: `/projects/projects/${props.id}/`,
  })
    .then((result) => convertProjectFromResponse(result.data))
    .catch(onError);

export const apiGetProjectWithScreens = (
  props: MyAxiosProps & { id: string },
): Promise<Result<ProjectWithScreens>> =>
  myAxios({
    ...props,
    method: 'GET',
    url: `projects/screens-for-project/${props.id}/`,
  })
    .then((res: AxiosResponse<ServerProjectWithScreens>) => ({
      result: convertProjectWithScreensFromResponse(res.data),
    }))
    .catch((error) => ({ error }));

export const apiCreateProject = (
  props: MyAxiosProps,
): Promise<Result<Project>> =>
  myAxios({
    ...props,
    method: 'POST',
    url: '/projects/projects/',
    data: props.data,
  })
    .then((result: AxiosResponse<ServerProject>) => ({
      result: convertProjectFromResponse(result.data),
    }))
    .catch((error) => ({ error }));

export const apiDeleteProject = (props: MyAxiosProps & { id: string }) =>
  myAxios({
    ...props,
    method: 'DELETE',
    url: `/projects/projects/${props.id}/`,
  })
    .then((res) => ({
      result: res.status === 204,
    }))
    .catch((error) => ({ error }));

export const apiUpdateProject = (
  props: MyAxiosProps,
): Promise<Result<Project>> =>
  myAxios({
    ...props,
    method: 'PATCH',
    url: `/projects/projects/${props.data.id}/`,
  })
    .then((result: AxiosResponse<ServerProject>) => ({
      result: convertProjectFromResponse(result.data),
    }))
    .catch((error) => ({ error }));

export const apiSaveScreens = (props: MyAxiosProps): Promise<Project> =>
  myAxios({
    ...props,
    method: 'PATCH',
    url: '/projects/project-screens-multiple/',
  })
    .then((result) => convertProjectFromResponse(result.data))
    .catch(onError);
