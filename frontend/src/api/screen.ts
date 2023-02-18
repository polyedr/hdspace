import { AxiosResponse } from 'axios';
import { ScreenFolder } from '@Redux/types';
import { myAxios } from '../config/settings';
import {
  MyAxiosProps,
  Result,
  Screen,
  LibraryElement,
  ServerElement,
  ServerScreen,
} from '../types';
import { convertScreenFromResponse } from './converters/fromResponse';
import { handleError, onError, parseResult } from './helper';

export const apiCreateScreenCategory = async ({
  id,
  name,
  buoyancy,
  ...props
}: MyAxiosProps & {
  id: string;
  name: string;
  buoyancy: number;
}): Promise<ScreenFolder> =>
  await myAxios({
    ...props,
    method: 'post',
    data: {
      name,
      project: id,
      buoyancy,
    },
    url: 'projects/projectcategories/',
  })
    .then((res) => parseResult(res))
    .catch(onError);

export const apiUpdateScreenCategory = async ({
  ...props
}: MyAxiosProps & {
  id: string;
  data: Partial<{ name: string; buyoancy: number }>;
}) =>
  await myAxios({
    ...props,
    method: 'patch',
    url: `projects/projectcategories/${props.id}/`,
  })
    .then((res) => parseResult(res))
    .catch(onError);

export const apiGetScreenCategories = async (
  props: MyAxiosProps & { id: string },
): Promise<Screen> =>
  await myAxios({
    ...props,
    method: 'GET',
    url: `/projects/projectcategories/?project=${props.id}`,
  })
    .then((res) => parseResult(res))
    .catch(onError);

export const apiGetScreen = async (
  props: MyAxiosProps & { id: string },
): Promise<Screen> =>
  await myAxios({
    ...props,
    method: 'GET',
    url: `/projects/project-screens/${props.id}/`,
  })
    .then((res) => convertScreenFromResponse(parseResult(res)))
    .catch(onError);

export const apiCreateScreen = async (
  props: MyAxiosProps,
): Promise<Result<Screen>> =>
  await myAxios({
    ...props,
    method: 'POST',
    url: '/projects/project-screens/',
  })
    .then((res: AxiosResponse<ServerScreen>) => ({
      result: convertScreenFromResponse(parseResult(res)),
    }))
    .catch(handleError);

export const apiUpdateScreen = async (
  props: MyAxiosProps & { id: string },
): Promise<Result<Screen>> =>
  await myAxios({
    ...props,
    method: 'PATCH',
    url: `/projects/project-screens/${props.id}/`,
  })
    .then((res) => ({ result: convertScreenFromResponse(parseResult(res)) }))
    .catch(handleError);

export const apiPostFreeCanvas = async (
  props: MyAxiosProps & { tree: LibraryElement<'root'> },
): Promise<Result<ServerElement<any>>> =>
  await myAxios({
    ...props,
    method: 'POST',
    url: '/virtualize_simple/freecanvas/',
    data: props.tree,
  })
    .then((res) => ({ result: res.data }))
    .catch(handleError);
