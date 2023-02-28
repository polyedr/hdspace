import { AxiosResponse } from 'axios';
import { myAxios } from '../config/settings';
import {
  Entity,
  LibraryElement,
  MyAxiosProps,
  PaginatedResponse,
  RecursiveElement,
  RecursiveServerElement,
  Result,
  Screen,
  ServerElement,
} from '../types';
import {
  convertElementFromResponse,
  convertNNElementFromResponse,
  convertNNScreenFromResponse,
  convertRecursiveElementFromResponse,
} from './converters/fromResponse';
import { handleError, onError, parseResult } from './helper';

export const apiGetElements = async ({
  scenariosIDs,
  ...props
}: MyAxiosProps & { scenariosIDs: string[] }): Promise<
  Result<Array<ServerElement<any>>>
> =>
  await myAxios({
    ...props,
    params: {
      scenariosIds: scenariosIDs?.join(','),
    },
    method: 'GET',
    url: '/projects/scenario-elements/',
  })
    .then((res) => {
      const result = parseResult(res);
      const sharedFilteredElements = result[1].children.filter(
        (element) => element.shared !== true,
      );
      result[1].children = sharedFilteredElements;
      return {
        result,
      };
    })
    .catch(handleError);

export const apiGetCustomLibraryElements = async (
  props: MyAxiosProps,
): Promise<Result<PaginatedResponse<LibraryElement<Entity>>>> =>
  await myAxios({
    ...props,
    method: 'GET',
    params: {
      ...(props.params || {}),
      is_shared: true,
    },
    url: props.url || '/projects/scenario-elements/',
  })
    .then((res: AxiosResponse<Array<ServerElement<Entity>>>) =>
      // pagination will be needed in the future
      // const { next, previous, results } = res.data;
      ({
        result: {
          next: /* parseCursor(next) */ null,
          previous: /* parseCursor(previous) */ null,
          results: res.data.map((result) => convertElementFromResponse(result)),
        },
      }),
    )
    .catch(handleError);

export const apiCreateElement = async (
  props: Partial<MyAxiosProps & ServerElement<any>>,
): Promise<Result<LibraryElement<any>>> =>
  await myAxios({
    ...props,
    method: 'POST',
    url: '/projects/scenario-elements/',
  })
    .then((result) => ({ result: convertElementFromResponse(result.data) }))
    .catch(handleError);

export const apiChangeRecursiveElement = async (
  props: MyAxiosProps & { id: number },
): Promise<Result<RecursiveElement>> =>
  await myAxios({
    ...props,
    method: 'PATCH',
    url: `/projects/scenario-elements-recursive/${props.id}/`,
  })
    .then((res) => ({
      result: convertRecursiveElementFromResponse(res.data),
    }))
    .catch(handleError);

export const apiChangeRecursiveMultipleElements = async (
  props: MyAxiosProps & { elements: RecursiveServerElement[] },
): Promise<Result<RecursiveElement[]>> => {
  const { elements, ...axiosProps } = props;
  return await myAxios({
    ...axiosProps,
    method: 'PATCH',
    url: '/projects/scenario-elements-multiple-recursive/',
    data: elements,
  })
    .then((res) => ({
      result: res.data.map((element) =>
        convertRecursiveElementFromResponse(element),
      ),
    }))
    .catch(handleError);
};

export const apiGetElement = async <
  T extends Entity,
  K extends Entity,
  P extends ServerElement<T>['parameters'],
>({
  id,
  ...props
}: MyAxiosProps & { id: string }): Promise<
  LibraryElement<T, Array<LibraryElement<K>>, P>
> =>
  await myAxios({
    ...props,
    method: 'GET',
    url: `/projects/scenario-elements/${id}/`,
  })
    .then((result) => convertElementFromResponse(result.data))
    .catch(onError);

export const apiDelElements = async (
  props: MyAxiosProps & { list: string[] },
) =>
  await myAxios({
    ...props,
    method: 'DELETE',
    url: `/projects/scenario-elements-multi/?ids=${props.list}`,
  })
    .then(parseResult)
    .catch(onError);

export const apiUpdateElements = async (
  props: MyAxiosProps,
): Promise<Result<Array<ServerElement<any>>>> =>
  await myAxios({
    ...props,
    method: 'PATCH',
    url: 'projects/scenario-elements-multi/',
  })
    .then((res) => ({
      result: parseResult(res),
    }))
    .catch(handleError);

export const apiDelElement = async (props: MyAxiosProps & { id: string }) =>
  await myAxios({
    ...props,
    method: 'DELETE',
    url: `/projects/scenario-elements/${props.id}`,
  })
    .then(parseResult)
    .catch(onError);

export const apiUpdateElement = async (
  props: MyAxiosProps & { id: string },
): Promise<Result<LibraryElement<any>>> =>
  await myAxios({
    ...props,
    method: 'PATCH',
    url: `/projects/scenario-elements/${props.id}/`,
  })
    .then((res) => ({
      result: convertElementFromResponse(res.data),
    }))
    .catch(handleError);

export const apiCreateElements = async <
  T extends Entity,
  K extends Entity,
  P extends ServerElement<T>['parameters'],
>(
  props: MyAxiosProps,
): Promise<Result<Array<LibraryElement<T, Array<LibraryElement<K>>, P>>>> =>
  await myAxios({
    ...props,
    method: 'POST',
    url: '/projects/scenario-elements-multiple/',
  })
    .then((res) => ({
      result: res.data.map((item: ServerElement<T>) =>
        convertElementFromResponse(item),
      ),
    }))
    .catch(handleError);

export const uploadImageForNN = async ({
  screenID,
  ...props
}: MyAxiosProps & { screenID: string }) =>
  await myAxios({
    ...props,
    method: 'PATCH',
    url: `/projects/project-screens/${screenID}/`,
  })
    .then(parseResult)
    .catch(onError);

export const parseImgUsingNN = async ({
  screenID,
  ...props
}: MyAxiosProps & { screenID: string }) =>
  await myAxios({
    ...props,
    method: 'POST',
    url: '/virtualize_simple/virtualize-simple/',
  })
    .then((res) => ({ result: convertNNElementFromResponse(res.data) }))
    .catch(handleError);

export const recognizeImgUsingNN = async (
  props: MyAxiosProps,
): Promise<Result<Screen>> =>
  await myAxios({
    ...props,
    method: 'POST',
    url: '/virtualize_simple/recognize/',
  })
    .then((res) => ({ result: convertNNScreenFromResponse(res.data) }))
    .catch(handleError);

export const assembleImgUsingNN = async (
  props: MyAxiosProps,
): Promise<Result<LibraryElement<any>>> =>
  await myAxios({
    ...props,
    method: 'POST',
    url: '/virtualize_simple/assemble/',
  })
    .then((res) => ({ result: convertNNElementFromResponse(res.data) }))
    .catch(handleError);
