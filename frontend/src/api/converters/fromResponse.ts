/* eslint-disable camelcase */
import { cssCamelize } from '@Utils/CSSConverter';
import {
  Entity,
  LibraryElement,
  ProfileData,
  Project,
  ProjectClass,
  ProjectData,
  ProjectWithScreens,
  RecursiveElement,
  ServerElement,
  ServerProfileData,
  ServerProject,
  ServerProjectWithScreens,
  ServerRecursiveElement,
  ServerUserData,
  UserData,
} from '@Src/types';

export const convertElementFromResponse = <
  T extends Entity,
  K extends Entity,
  P extends ServerElement<T>['parameters']
>(
  {
    id,
    name,
    children,
    struct_type,
    buoyancy,
    image,
    parameters,
    styles,
  }: ServerElement<T, ServerElement<K>[], P>,
  nestingOrder = 1,
): LibraryElement<T, LibraryElement<K>[], P> => ({
  id: String(id),
  name,
  children: children
    .map((child) => convertElementFromResponse(child, nestingOrder + 1))
    .sort(
      (firstChild, secondChild) => firstChild.buoyancy - secondChild.buoyancy,
    ),
  type: struct_type,
  buoyancy,
  image,
  parameters,
  nestingOrder,
  styles: {
    ...styles,
    ownStyles: {
      ...(styles.ownStyles ? cssCamelize(styles.ownStyles) : {}),
    },
  },
});

export const convertRecursiveElementFromResponse = (
  element: ServerRecursiveElement,
): RecursiveElement => {
  const { id, name, children } = element;

  return {
    id: String(id),
    name,
    children,
  };
};

export function convertProjectFromResponse(
  project: ServerProjectWithScreens,
): ProjectWithScreens;
export function convertProjectFromResponse(project: ServerProject): Project;
export function convertProjectFromResponse({
  id,
  name,
  status,
  projectscreen,
  created,
  updated,
  project_data_json,
}) {
  const projectDataJSON = JSON.parse(project_data_json) as ProjectData;

  return {
    id,
    name,
    status,
    projectscreen,
    projectLoader: false,
    created: new Date(created),
    updated: new Date(updated),
    projectData: {
      ...projectDataJSON,
      classes: projectDataJSON.classes.map((cls: ProjectClass) => {
        return {
          ...cls,
          rules: cssCamelize(cls.rules) as React.CSSProperties,
        } as ProjectClass;
      }),
    },
  };
}

export const convertProfileDataFromResponse = ({
  hourly_rate,
  ...rest
}: ServerProfileData): ProfileData => ({
  hourlyRate: hourly_rate,
  ...rest,
});

export const convertUserDataFromResponse = ({
  first_name,
  last_name,
  date_joined,
  is_active,
  profile,
  ...rest
}: ServerUserData): UserData => ({
  firstName: first_name,
  lastName: last_name,
  dateJoined: new Date(date_joined),
  isActive: is_active,
  profile: convertProfileDataFromResponse(profile),
  ...rest,
});
