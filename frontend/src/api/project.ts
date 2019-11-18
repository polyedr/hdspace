import { myAxios } from '$config/settings';
import { IProject } from '$redux/project/reducer';


export const onError = ({ response }) => {
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
};

export const parseResult = result => result && result.data;

export const apiGetListProject = props => (
  myAxios({
    ...props,
    method: 'GET',
    url: '/projects/projects/',
  })
    .then(parseResult)
    .catch(onError)
);

export const apiGetProject = (props): Promise<IProject> => (
  myAxios({
    ...props,
    method: 'GET',
    url: `/projects/projects/${props.id}/`,
  })
    .then(parseResult)
    .catch(onError)
);

export const apiAddProject = props => (
  myAxios({
    ...props,
    method: 'POST',
    url: '/projects/projects/',
    data: props.data,
  })
    .then(parseResult)
    .catch(onError)
);

export const apiDelProject = props => (
  myAxios({
    ...props,
    method: 'DELETE',
    url: `/projects/projects/${props.id}/`,
  })
    .then(parseResult)
    .catch(onError)
);

export const apiSaveProject = (props): Promise<IProject> => (
  myAxios({
    ...props,
    method: 'PATCH',
    url: `/projects/projects/${props.data.id}/`,
  })
    .then(parseResult)
    .catch(onError)
);

export const apiSaveScreens = (props): Promise<IProject> => (
  myAxios({
    ...props,
    method: 'PATCH',
    url: '/projects/project-screens-multiple/',
  })
    .then(parseResult)
    .catch(onError)
);
