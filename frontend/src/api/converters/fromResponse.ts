/* eslint-disable camelcase */

import { CSSProperties } from '@material-ui/core/styles/withStyles';
import {
  Entity,
  LibraryElement,
  ProfileData,
  Project,
  ProjectClass,
  ProjectData,
  RecursiveElement,
  ServerElement,
  ServerProfileData,
  ServerProject,
  ServerRecursiveElement,
  ServerUserData,
  UserData,
} from '../../types';

const convertToCSSProps = (styles: any): React.CSSProperties => {
  const convertedStyles: CSSProperties = {};
  Object.keys(styles).forEach((propName) => {
    const jsNameParts = propName.split('-');
    const convertedPropertyKey =
      jsNameParts.length === 1
        ? jsNameParts[0]
        : jsNameParts
            .map((namePart, index) =>
              index === 0
                ? namePart
                : namePart.charAt(0).toUpperCase() + namePart.slice(1),
            )
            .join('');
    convertedStyles[convertedPropertyKey] = styles[propName];
  });
  return convertedStyles;
};

export const convertElementFromResponse = <
  T extends Entity,
  K extends Entity,
  P extends ServerElement<T>['parameters']
>(
  element: ServerElement<T, ServerElement<K>[], P>,
): LibraryElement<T, LibraryElement<K>[], P> => {
  const {
    id,
    name,
    children,
    struct_type,
    buoyancy,
    image,
    parameters,
    styles,
  } = element;

  return {
    id: String(id),
    name,
    children: children
      .map((child) => convertElementFromResponse(child))
      .sort(
        (firstChild, secondChild) => firstChild.buoyancy - secondChild.buoyancy,
      ),
    type: struct_type,
    buoyancy,
    image,
    parameters,
    styles: {
      ...styles,
      ownStyles: convertToCSSProps(styles.ownStyles),
    },
  };
};

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

export const convertProjectFromResponse = (project: ServerProject): Project => {
  const {
    id,
    name,
    status,
    projectscreen,
    created,
    updated,
    project_data_json,
  } = project;

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
      classes: projectDataJSON.classes.map(
        (cls: ProjectClass) =>
          ({
            ...cls,
            rules: convertToCSSProps(cls.rules) as React.CSSProperties,
          } as ProjectClass),
      ),
    },
  };
};

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
  ...rest
}: ServerUserData): UserData => ({
  firstName: first_name,
  lastName: last_name,
  dateJoined: new Date(date_joined),
  isActive: is_active,
  ...rest,
});
