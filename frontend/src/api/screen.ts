import { AxiosResponse } from 'axios';
import { myAxios } from '../config/settings';
import {
  MyAxiosProps,
  Result,
  Screen,
  LibraryElement,
  ServerElement,
  ServerScreen,
} from '../types/types';
import { convertScreenFromResponse } from './converters/fromResponse';
import { handleError, onError, parseResult } from './helper';

export const apiGetScreen = (
  props: MyAxiosProps & { id: string },
): Promise<Screen> =>
  myAxios({
    ...props,
    method: 'GET',
    url: `/projects/project-screens/${props.id}/`,
  })
    .then((res) => convertScreenFromResponse(parseResult(res)))
    .catch(onError);

export const apiCreateScreen = (props: MyAxiosProps): Promise<Result<Screen>> =>
  myAxios({
    ...props,
    method: 'POST',
    url: '/projects/project-screens/',
  })
    .then((res: AxiosResponse<ServerScreen>) => ({
      result: convertScreenFromResponse(parseResult(res)),
    }))
    .catch(handleError);

export const apiUpdateScreen = (
  props: MyAxiosProps & { id: string },
): Promise<Result<Screen>> =>
  myAxios({
    ...props,
    method: 'PATCH',
    url: `/projects/project-screens/${props.id}/`,
  })
    .then((res) => ({ result: convertScreenFromResponse(parseResult(res)) }))
    .catch(handleError);

export const apiPostFreeCanvas = (
  props: MyAxiosProps & { tree: LibraryElement<'root'> },
): Promise<Result<ServerElement<any>>> => {
  return myAxios({
    ...props,
    method: 'POST',
    url: '/virtualize_simple/freecanvas/',
    data: props.tree,
  })
    .then((res) => ({ result: res.data }))
    .catch(handleError);
};
