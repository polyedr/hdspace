/* eslint-disable no-console */

import { AxiosResponse, AxiosError } from 'axios';
import { convertProjectFromResponse } from './converters/fromResponse';
import { PaginatedResponse, Project, ServerProject } from './types';
import { myAxios, MyAxiosProps } from '../../config/settings';

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

export const parseResult = <T>(result: AxiosResponse<T>) =>
  result && result.data;

export const parseCursor = (str: string | null) => {
  if (!str) return null;
  const matches = str.match(/cursor=(.*)$/);
  if (!matches) return null;
  return matches[1];
};

export const apiGetProjectList = (
  props: MyAxiosProps,
): Promise<PaginatedResponse<Project>> =>
  myAxios({
    ...props,
    method: 'GET',
    url: '/projects/projects/',
  })
    .then((result: AxiosResponse<PaginatedResponse<ServerProject>>) => ({
      next: parseCursor(result.data.next),
      previous: parseCursor(result.data.previous),
      results: result.data.results.map(convertProjectFromResponse),
    }))
    .catch(onError);

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

export const apiAddProject = (props: MyAxiosProps): Promise<Project> =>
  myAxios({
    ...props,
    method: 'POST',
    url: '/projects/projects/',
    data: props.data,
  })
    .then((result) => convertProjectFromResponse(result.data))
    .catch(onError);

export const apiDelProject = (props: MyAxiosProps & { id: string }) =>
  myAxios({
    ...props,
    method: 'DELETE',
    url: `/projects/projects/${props.id}/`,
  })
    .then(parseResult)
    .catch(onError);

export const apiSaveProject = (props: MyAxiosProps): Promise<Project> =>
  myAxios({
    ...props,
    method: 'PATCH',
    url: `/projects/projects/${props.data.id}/`,
  })
    .then((result) => convertProjectFromResponse(result.data))
    .catch(onError);

export const apiSaveScreens = (props: MyAxiosProps): Promise<Project> =>
  myAxios({
    ...props,
    method: 'PATCH',
    url: '/projects/project-screens-multiple/',
  })
    .then((result) => convertProjectFromResponse(result.data))
    .catch(onError);
