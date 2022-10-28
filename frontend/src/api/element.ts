import { AxiosResponse } from 'axios';
import {
  convertElementFromResponse,
  convertNNElementFromResponse,
  convertNNScreenFromResponse,
  convertRecursiveElementFromResponse,
} from './converters/fromResponse';
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
import { handleError, onError, parseResult } from './helper';

export const apiGetElements = ({
  scenariosIDs,
  ...props
}: MyAxiosProps & { scenariosIDs: string[] }): Promise<
  Result<ServerElement<any>[]>
> =>
  myAxios({
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

export const apiGetCustomLibraryElements = (
  props: MyAxiosProps,
): Promise<Result<PaginatedResponse<LibraryElement<Entity>>>> => {
  return myAxios({
    ...props,
    method: 'GET',
    params: {
      ...(props.params || {}),
      is_shared: true,
    },
    url: props.url || '/projects/scenario-elements/',
  })
    .then((res: AxiosResponse<ServerElement<Entity>[]>) => {
      // pagination will be needed in the future
      // const { next, previous, results } = res.data;
      return {
        result: {
          next: /* parseCursor(next) */ null,
          previous: /* parseCursor(previous) */ null,
          results: res.data.map((result) => convertElementFromResponse(result)),
        },
      };
    })
    .catch(handleError);
};

export const apiCreateElement = (
  props: Partial<MyAxiosProps & ServerElement<any>>,
): Promise<Result<LibraryElement<any>>> =>
  myAxios({
    ...props,
    method: 'POST',
    url: `/projects/scenario-elements/`,
  })
    .then((result) => ({ result: convertElementFromResponse(result.data) }))
    .catch(handleError);

export const apiChangeRecursiveElement = (
  props: MyAxiosProps & { id: number },
): Promise<Result<RecursiveElement>> =>
  myAxios({
    ...props,
    method: 'PATCH',
    url: `/projects/scenario-elements-recursive/${props.id}/`,
  })
    .then((res) => ({
      result: convertRecursiveElementFromResponse(res.data),
    }))
    .catch(handleError);

export const apiChangeRecursiveMultipleElements = (
  props: MyAxiosProps & { elements: RecursiveServerElement[] },
): Promise<Result<RecursiveElement[]>> => {
  const { elements, ...axiosProps } = props;
  return myAxios({
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

export const apiGetElement = <
  T extends Entity,
  K extends Entity,
  P extends ServerElement<T>['parameters'],
>({
  id,
  ...props
}: MyAxiosProps & { id: string }): Promise<
  LibraryElement<T, LibraryElement<K>[], P>
> =>
  myAxios({
    ...props,
    method: 'GET',
    url: `/projects/scenario-elements/${id}/`,
  })
    .then((result) => convertElementFromResponse(result.data))
    .catch(onError);

export const apiDelElements = (props: MyAxiosProps & { list: string[] }) =>
  myAxios({
    ...props,
    method: 'DELETE',
    url: `/projects/scenario-elements-multi/?ids=${props.list}`,
  })
    .then(parseResult)
    .catch(onError);

export const apiUpdateElements = (
  props: MyAxiosProps,
): Promise<Result<ServerElement<any>[]>> =>
  myAxios({
    ...props,
    method: 'PATCH',
    url: 'projects/scenario-elements-multi/',
  })
    .then((res) => ({
      result: parseResult(res),
    }))
    .catch(handleError);

export const apiDelElement = (props: MyAxiosProps & { id: string }) =>
  myAxios({
    ...props,
    method: 'DELETE',
    url: `/projects/scenario-elements/${props.id}`,
  })
    .then(parseResult)
    .catch(onError);

export const apiUpdateElement = <
  T extends Entity,
  K extends Entity,
  P extends ServerElement<T>['parameters'],
>(
  props: MyAxiosProps & { id: string },
): Promise<Result<LibraryElement<any>>> =>
  myAxios({
    ...props,
    method: 'PATCH',
    url: `/projects/scenario-elements/${props.id}/`,
  })
    .then((res) => ({
      result: convertElementFromResponse(res.data),
    }))
    .catch(handleError);

export const apiCreateElements = <
  T extends Entity,
  K extends Entity,
  P extends ServerElement<T>['parameters'],
>(
  props: MyAxiosProps,
): Promise<Result<LibraryElement<T, LibraryElement<K>[], P>[]>> =>
  myAxios({
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

export const uploadImageForNN = ({
  screenID,
  ...props
}: MyAxiosProps & { screenID: string }) =>
  myAxios({
    ...props,
    method: 'PATCH',
    url: `/projects/project-screens/${screenID}/`,
  })
    .then(parseResult)
    .catch(onError);

export const parseImgUsingNN = ({
  screenID,
  ...props
}: MyAxiosProps & { screenID: string }) =>
  myAxios({
    ...props,
    method: 'POST',
    url: `/virtualize_simple/virtualize-simple/`,
  })
    .then((res) => ({ result: convertNNElementFromResponse(res.data) }))
    .catch(handleError);

export const recognizeImgUsingNN = (
  props: MyAxiosProps,
): Promise<Result<Screen>> =>
  myAxios({
    ...props,
    method: 'POST',
    url: '/virtualize_simple/recognize/',
  })
    .then((res) => ({ result: convertNNScreenFromResponse(res.data) }))
    .catch(handleError);

export const assembleImgUsingNN = (
  props: MyAxiosProps,
): Promise<Result<LibraryElement<any>>> =>
  myAxios({
    ...props,
    method: 'POST',
    url: '/virtualize_simple/assemble/',
  })
    .then((res) => ({ result: convertNNElementFromResponse(res.data) }))
    .catch(handleError);
