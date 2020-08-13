import * as R from 'ramda';
import {
  ServerElement,
  LibraryElement,
  ServerProject,
  CreatedServerProject,
  ProjectClass,
  Project,
} from '$api/types';
import {
  DEFAULT_ELEMENTS_STYLES,
  getDefaultStyles,
} from '$domain/libraryElements/defaultStyles';
import { LIBRARY_ELEMENTS } from '$domain/libraryElements/libraryElements';
import { Entity } from '$domain/core';
import { TotalServerUserData, UserData } from '$redux/user/types';

export const convertCreatedElementToRequest = <
  T extends Entity,
  K extends ServerElement<T>['parameters']
>(
  elementType: T,
  parentID: string | null,
  elementName?: string,
): ServerElement<T, ServerElement<Entity>[], K> => {
  const libraryElement = (LIBRARY_ELEMENTS[
    elementType
  ] as unknown) as ServerElement<T, ServerElement<Entity>[], K>;
  const { name } = libraryElement;

  return {
    ...libraryElement,
    id: -1,
    name: elementName || name,
    ...(parentID && { scenario: parseInt(parentID) }),
  };
};

export const convertElementToRequest = <
  T extends Entity,
  K extends Entity,
  P extends ServerElement<T>['parameters']
>(
  element: LibraryElement<T, LibraryElement<K>[], P>,
): ServerElement<T, ServerElement<K>[], P> => {
  const {
    id,
    name,
    children,
    type,
    buoyancy,
    image,
    parameters,
    styles,
  } = element;

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

export const convertElementToPatchRequest = <
  T extends Entity,
  K extends Entity,
  P extends ServerElement<T>['parameters']
>(
  element: LibraryElement<T, LibraryElement<K>[], P>,
): ServerElement<T, ServerElement<K>[], P> => {
  const { id, name, type, buoyancy, parameters, styles } = element;

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

export const convertCreatedProjectToRequest = (
  name: string,
): CreatedServerProject => {
  const projectClasses: ProjectClass[] = R.keys(DEFAULT_ELEMENTS_STYLES).map(
    (elementName) => ({
      className: elementName,
      supportedElement: elementName,
      rules: getDefaultStyles(elementName),
    }),
  );

  return {
    name,
    status: 'pending',
    projectscreen: [],
    project_data_json: JSON.stringify({ classes: projectClasses }),
  };
};

export const convertProjectToPatchRequest = (
  project: Project,
): Omit<ServerProject, 'created' | 'updated' | 'project_data_text'> => {
  const { id, name, status, projectscreen, projectData } = project;

  return {
    id,
    name,
    status,
    projectscreen,
    project_data_json: JSON.stringify(projectData),
  };
};

export const convertUserDataToRequest = ({
  firstName,
  dateJoined,
  hourlyRate,
  isActive,
  lastName,
  ...rest
}: Partial<UserData>): Partial<TotalServerUserData> => ({
  first_name: firstName,
  date_joined: dateJoined?.toString(),
  hourly_rate: hourlyRate,
  is_active: isActive,
  last_name: lastName,
  ...rest,
});
