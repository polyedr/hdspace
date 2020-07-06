import { myAxios, MyAxiosProps } from '$config/settings';
import { onError, parseResult } from '$api/project';
import { IScenarioElement, ServerStructType } from '$redux/project/types';

import { RecursiveElement, ServerElement, LibraryElement } from './types';
import { convertElementFromResponse, convertRecursiveElementFromResponse } from './converters/fromResponse';
import { Entity } from '$domain/core';

type ServerLibraryElement = { // TODO: compare with entity on backend!
  buoyancy: number[];
  func_type: string[];
  func_type_human: string;
  id: number;
  image: string | null;
  parameters: any[];
  struct_type: ServerStructType;
  styles: {}[];
};

export const apiGetLibraryElements = (): Promise<ServerLibraryElement[]> => (
  myAxios({
    method: 'GET',
    url: '/projects/library-elements/',
  })
    .then(parseResult)
    .catch(onError)
);

export const apiGetElements = (
  { scenariosIDs, ...props }: MyAxiosProps & { scenariosIDs: string[] },
): Promise<IScenarioElement[]> => (
  myAxios({
    ...props,
    method: 'GET',
    url: `/projects/scenario-elements${scenariosIDs.length ? `/?scenariosIds=${scenariosIDs.join(',')}` : '/'}`,
  })
    .then(parseResult)
    .catch(onError)
);

export const apiAddElement = <T extends Entity, K extends Entity, P extends ServerElement<T>['parameters']>(
  props: MyAxiosProps & ServerElement<T, ServerElement<K>[], P>,
): Promise<LibraryElement<T, LibraryElement<K>[], P>> => (
  myAxios({
    ...props,
    method: 'GET',
    url: `/projects/scenario-elements/`,
  })
    .then(result => convertElementFromResponse(result.data))
    .catch(onError)
);

export const apiChangeRecursiveElement = (
  props: MyAxiosProps & { id: number },
): Promise<RecursiveElement> => (
  myAxios({
    ...props,
    method: 'PATCH',
    url: `/projects/scenario-elements-recursive/${props.id}/`,
  })
    .then(result => convertRecursiveElementFromResponse(result.data))
    .catch(onError)
);

export const apiGetElement = <T extends Entity, K extends Entity, P extends ServerElement<T>['parameters']>(
  { id, ...props }: MyAxiosProps & { id: string },
): Promise<LibraryElement<T, LibraryElement<K>[], P>> => (
  myAxios({
    ...props,
    method: 'GET',
    url: `/projects/scenario-elements/${id}/`,
  })
    .then(parseResult)
    .catch(onError)
);

export const apiDelElements = (props: MyAxiosProps & { list: string[] }) => (
  myAxios({
    ...props,
    method: 'DELETE',
    url: `/projects/scenario-elements-multi/?ids=${props.list}`,
  })
    .then(parseResult)
    .catch(onError)
);

export const apiSaveElements = (props: MyAxiosProps): Promise<IScenarioElement[]> => (
  myAxios({
    ...props,
    method: 'PATCH',
    url: 'projects/scenario-elements-multi/',
  })
    .then(parseResult)
    .catch(onError)
);

export const apiDelElement = (props: MyAxiosProps & { id: string }) => (
  myAxios({
    ...props,
    method: 'DELETE',
    url: `/projects/scenario-elements/${props.id}`,
  })
    .then(parseResult)
    .catch(onError)
);

export const apiChangeElement = <T extends Entity, K extends Entity, P extends ServerElement<T>['parameters']>(
  props: MyAxiosProps & { id: string }
): Promise<LibraryElement<T, LibraryElement<K>[], P>> => (
  myAxios({
    ...props,
    method: 'PATCH',
    url: `/projects/scenario-elements/${props.id}/`,
  })
    .then(result => convertElementFromResponse(result.data))
    .catch(onError)
);

export const apiAddElements = <T extends Entity, K extends Entity, P extends ServerElement<T>['parameters']>(
  props: MyAxiosProps
): Promise<LibraryElement<T, LibraryElement<K>[], P>> => (
  myAxios({
    ...props,
    method: 'POST',
    url: '/projects/scenario-elements-multiple/',
  })
    .then(result => result.data.map((item: ServerElement<T>) => convertElementFromResponse(item)))
    .catch(onError)
);

export const uploadImageForNN = ({ screenID, ...props}: MyAxiosProps & { screenID: string }) => (
  myAxios({
    ...props,
    method: 'PATCH',
    url: `/projects/project-screens/${screenID}/`,
  })
    .then(parseResult)
    .catch(onError)
);

export const parseImgUsingNN = ({ screenID, ...props}: MyAxiosProps & { screenID: string }) => (
  myAxios({
    ...props,
    method: 'POST',
    url: `/virtualize_simple/virtualize-simple/`,
  })
    .then(parseResult)
    .catch(onError)
);
