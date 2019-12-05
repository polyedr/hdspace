import { myAxios, MyAxiosProps } from '$config/settings';
import { onError, parseResult } from '$api/project';
import { IProjectScreen } from '$redux/project/types';

export const apiGetScreen = (props: MyAxiosProps & { id: string }): Promise<IProjectScreen> => (
  myAxios({
    ...props,
    method: 'GET',
    url: `/projects/project-screens/${props.id}/`,
  })
    .then(parseResult)
    .catch(onError)
);

export const apiGetAllScreen = (props: MyAxiosProps): Promise<IProjectScreen[]> => (
  myAxios({
    ...props,
    method: 'GET',
    url: '/projects/project-screens/',
  })
    .then(parseResult)
    .catch(onError)
);

export const apiAddScreen = (props: MyAxiosProps): Promise<IProjectScreen> => (
  myAxios({
    ...props,
    method: 'POST',
    url: '/projects/project-screens/',
  })
    .then(parseResult)
    .catch(onError)
);

export const apiSaveScreen = (props: MyAxiosProps & { id: string }): Promise<IProjectScreen> => (
  myAxios({
    ...props,
    method: 'PATCH',
    url: `/projects/project-screens/${props.id}/`,
  })
    .then(parseResult)
    .catch(onError)
);

export const apiDelScreen = (props: MyAxiosProps & { id: string }): Promise<IProjectScreen> => (
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
