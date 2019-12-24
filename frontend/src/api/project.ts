import { myAxios, MyAxiosProps } from '$config/settings';
import { IProject } from '$redux/project/types';
import { AxiosResponse, AxiosError } from 'axios';

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
    const errorMsg = 'Request is not present in axios error, look at onError handler!';
    console.error(errorMsg);
    return {
      msg: 'Request is not present in axios error, look at onError handler!',
      response,
    }
  }
};

export const parseResult = <T>(result: AxiosResponse<T>) => result && result.data;

export const apiGetListProject = (props: MyAxiosProps): Promise<IProject[]> => (
  myAxios({
    ...props,
    method: 'GET',
    url: '/projects/projects/',
  })
    .then(parseResult)
    .catch(onError)
);

// TODO: research here IProject or IProjectList in return type:
export const apiGetProject = (props: MyAxiosProps & { id: string }): Promise<IProject> => (
  myAxios({
    ...props,
    method: 'GET',
    url: `/projects/projects/${props.id}/`,
  })
    .then(parseResult)
    .catch(onError)
);

export const apiAddProject = (props: MyAxiosProps) => (
  myAxios({
    ...props,
    method: 'POST',
    url: '/projects/projects/',
    data: props.data,
  })
    .then(parseResult)
    .catch(onError)
);

export const apiDelProject = (props: MyAxiosProps & { id: string}) => (
  myAxios({
    ...props,
    method: 'DELETE',
    url: `/projects/projects/${props.id}/`,
  })
    .then(parseResult)
    .catch(onError)
);

export const apiSaveProject = (props: MyAxiosProps): Promise<IProject> => (
  myAxios({
    ...props,
    method: 'PATCH',
    url: `/projects/projects/${props.data.id}/`,
  })
    .then(parseResult)
    .catch(onError)
);

export const apiSaveScreens = (props: MyAxiosProps): Promise<IProject> => (
  myAxios({
    ...props,
    method: 'PATCH',
    url: '/projects/project-screens-multiple/',
  })
    .then(parseResult)
    .catch(onError)
);
