import { onError, parseResult } from './project';
import { myAxios, MyAxiosProps } from '../config/settings';
import { Screen } from '../redux/project/types';

export const apiGetScreen = (
  props: MyAxiosProps & { id: string },
): Promise<Screen> =>
  myAxios({
    ...props,
    method: 'GET',
    url: `/projects/project-screens/${props.id}/`,
  })
    .then(parseResult)
    .catch(onError);

export const apiCreateScreen = (props: MyAxiosProps): Promise<Screen> =>
  myAxios({
    ...props,
    method: 'POST',
    url: '/projects/project-screens/',
  })
    .then(parseResult)
    .catch(onError);

export const apiUpdateScreen = (
  props: MyAxiosProps & { id: string },
): Promise<Screen> =>
  myAxios({
    ...props,
    method: 'PATCH',
    url: `/projects/project-screens/${props.id}/`,
  })
    .then(parseResult)
    .catch(onError);
