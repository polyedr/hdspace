import { myAxios } from '$config/settings';
import { onError, parseResult } from '$api/project';
import { IProject, IProjectScreen } from '$redux/project/reducer';


export const apiGetScreen = (props): Promise<IProjectScreen> => (
  myAxios({
    ...props,
    method: 'GET',
    url: `/projects/project-screens/${props.id}/`,
  })
    .then(parseResult)
    .catch(onError)
);

export const apiGetAllScreen = (props): Promise<IProjectScreen[]> => (
  myAxios({
    ...props,
    method: 'GET',
    url: '/projects/project-screens/',
  })
    .then(parseResult)
    .catch(onError)
);

export const apiAddScreen = (props): Promise<IProjectScreen> => (
  myAxios({
    ...props,
    method: 'POST',
    url: '/projects/project-screens/',
  })
    .then(parseResult)
    .catch(onError)
);

export const apiSaveScreen = (props): Promise<IProjectScreen> => (
  myAxios({
    ...props,
    method: 'PATCH',
    url: `/projects/project-screens/${props.id}/`,
  })
    .then(parseResult)
    .catch(onError)
);

export const apiDelScreen = (props): Promise<IProjectScreen> => (
  myAxios({
    ...props,
    method: 'DELETE',
    url: `/projects/project-screens/${props.id}/`,
  })
    .then(parseResult)
    .catch(onError)
);

// export const apiRenameScreen = ({ id }) => (
//   client.delete(`/projects/project-screens/${id}/`)
//     .then(parseResult)
//     .catch(onError)
// );
