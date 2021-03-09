// import * as R from 'ramda';
import getDefaultStyles from '@Utils/getDefaultStyles';
import { cssDecamelize } from '@Utils/CSSConverter';
import { DEFAULT_ELEMENTS_STYLES } from '@Domain/libraryElements/defaultStyles';
import { LIBRARY_ELEMENTS } from '@Domain/libraryElements/libraryElements';
import {
  CreatedServerProject,
  Entity,
  LibraryElement,
  ProfileData,
  Project,
  ProjectClass,
  ServerElement,
  ServerProfileData,
  ServerProject,
  ServerUserData,
  UserData,
} from '@Src/types';

export const convertCreatedElementToRequest = <
  T extends Entity,
  K extends ServerElement<T>['parameters']
>(
  elementType: T,
  parentID: string | null,
  elementName?: string | null,
  parameters?: any,
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
    parameters: {
      ...libraryElement.parameters,
      ...(parameters || {}),
    },
  };
};

export const convertElementToRequest = <
  T extends Entity,
  K extends Entity,
  P extends ServerElement<T>['parameters']
>(
  element: LibraryElement<T, LibraryElement<K>[], P>,
  convertFn?: (
    originalEl: LibraryElement<T, LibraryElement<K>[], P>,
    convertedEl: ServerElement<T, ServerElement<K>[], P>,
  ) => ServerElement<T, ServerElement<K>[], P>,
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

  const serverEl: ServerElement<T, ServerElement<K>[], P> = {
    id: Number(id),
    name,
    children: children.map((child) =>
      convertElementToRequest(
        (child as any) as LibraryElement<T, LibraryElement<K>[], P>,
        convertFn,
      ),
    ) as any[],
    struct_type: type,
    func_type: type,
    buoyancy,
    image,
    parameters,
    styles: {
      ...styles,
      ownStyles: cssDecamelize(styles.ownStyles),
    },
  };
  return convertFn ? convertFn(element, serverEl) : serverEl;
};

export const convertElementToPatchRequest = <
  T extends Entity,
  K extends Entity,
  P extends ServerElement<T>['parameters']
>(
  element: LibraryElement<T, LibraryElement<K>[], P>,
): ServerElement<T, ServerElement<K>[], P> => {
  const { id, name, type, buoyancy, parameters, styles, shared } = element;

  return {
    id: Number(id),
    name,
    children: [],
    struct_type: type,
    func_type: type,
    buoyancy,
    image: null,
    parameters,
    styles: {
      ...styles,
      ownStyles: cssDecamelize(styles.ownStyles),
    },
    shared,
  };
};

export const convertCreatedProjectToRequest = (
  name: string,
): CreatedServerProject => {
  const projectClasses: ProjectClass[] = Object.keys(
    DEFAULT_ELEMENTS_STYLES,
  ).map((elementName) => ({
    className: elementName,
    supportedElement: elementName as Entity,
    rules: getDefaultStyles(elementName as Entity),
  }));

  return {
    name,
    status: 'pending',
    projectscreen: [],
    project_data_json: JSON.stringify({
      classes: projectClasses.map((cls: ProjectClass) => ({
        ...cls,
        // rules: cssDecamelize(cls.rules),
      })),
    }),
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
    project_data_json: JSON.stringify({
      ...projectData,
      classes: projectData.classes.map((cls: ProjectClass) => ({
        ...cls,
      })),
    }),
  };
};

export const convertUserDataToRequest = ({
  firstName,
  dateJoined,
  isActive,
  lastName,
  profile,
  ...rest
}: Partial<UserData>): Partial<ServerUserData> => ({
  first_name: firstName,
  date_joined: dateJoined?.toString(),
  is_active: isActive,
  last_name: lastName,
  profile: undefined,
  ...rest,
});

export const convertProfileDataToRequest = ({
  hourlyRate,
  ...rest
}: Partial<ProfileData>): Partial<ServerProfileData> => {
  return {
    hourly_rate: hourlyRate,
    ...rest,
  };
};
