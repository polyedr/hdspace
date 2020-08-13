/* eslint-disable camelcase */
import {
  ServerRecursiveElement,
  RecursiveElement,
  ServerElement,
  LibraryElement,
  ServerProject,
  Project,
} from '$api/types';
import { Entity } from '$domain/core';
import { TotalServerUserData, UserData } from '$redux/user/types';

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
    styles,
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

  return {
    id,
    name,
    status,
    projectscreen,
    projectLoader: false,
    created: new Date(created),
    updated: new Date(updated),
    projectData: JSON.parse(project_data_json),
  };
};

export const convertUserDataFromResponse = ({
  first_name,
  last_name,
  date_joined,
  hourly_rate,
  is_active,
  ...rest
}: TotalServerUserData): UserData => ({
  firstName: first_name,
  lastName: last_name,
  dateJoined: new Date(date_joined),
  hourlyRate: hourly_rate,
  isActive: is_active,
  ...rest,
});
