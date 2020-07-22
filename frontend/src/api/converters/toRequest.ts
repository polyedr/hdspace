import { ServerElement, LibraryElement, ServerProject, CreatedServerProject, ProjectClass } from '$api/types';
import { LIBRARY_ELEMENTS } from '$domain/libraryElements/libraryElements';
import { Entity } from '$domain/core';
import * as R from 'ramda';
import { DEFAULT_ELEMENTS_STYLES, getDefaultStyles } from '$domain/defaultStyles/defaultStyles';

export const convertCreatedElementToRequest = <T extends Entity, K extends ServerElement<T>['parameters']>(
  elementType: T,
  parentID: string | null,
  elementName?: string
): ServerElement<T, ServerElement<Entity>[], K> => {
  const libraryElement = LIBRARY_ELEMENTS[elementType] as unknown as ServerElement<T, ServerElement<Entity>[], K>;
  const { name } = libraryElement;

  return {
    ...libraryElement,
    id: -1,
    name: elementName || name,
    ...(parentID && { scenario: parseInt(parentID) }),
  };
};

export const convertElementToRequest = <T extends Entity, K extends Entity, P extends ServerElement<T>['parameters']>(
  element: LibraryElement<T, LibraryElement<K>[], P>
): ServerElement<T, ServerElement<K>[], P> => {
  const { id, name, children, type, buoyancy, image, parameters, styles } = element;

  return {
    id: Number(id),
    name,
    children: children.map((child) => convertElementToRequest(child)),
    struct_type: type,
    func_type: type,
    buoyancy,
    image,
    parameters,
    styles,
  };
};

export const convertElementToPatchRequest = <T extends Entity, K extends Entity, P extends ServerElement<T>['parameters']>(
  element: LibraryElement<T, LibraryElement<K>[], P>
): ServerElement<T, ServerElement<K>[], P> => {
  const { id, name, type, buoyancy, image, parameters, styles } = element;

  return {
    id: Number(id),
    name,
    children: [],
    struct_type: type,
    func_type: type,
    buoyancy,
    image: null,
    parameters,
    styles,
  };
};

export const convertCreatedProjectToRequest = (name: string): CreatedServerProject => {
  const projectClasses: ProjectClass[] = R.keys(DEFAULT_ELEMENTS_STYLES).map(
    name => ({ name, rules: getDefaultStyles(name) })
  );

  return {
    name,
    status: 'pending',
    projectscreen: [],
    project_data_json: JSON.stringify(projectClasses),
  }
};
