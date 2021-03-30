import { myAxios } from '@Src/config/settings';
import { MyAxiosProps, UserProjectPermission } from '@Src/types';
import { convertPermissionsUserDataFromResponse } from './converters/permissions/fromResponse';
import { handleError } from './helper';

export const apiAssignUserPermission = (
  props: MyAxiosProps & {
    username: string;
    projectId: number;
    permission: UserProjectPermission;
  },
) => {
  const { username, projectId, permission, ...axiosProps } = props;
  return myAxios({
    ...axiosProps,
    url: '/projects/permissions-projects-assign/',
    method: 'POST',
    contentType: 'application/json',
    data: {
      username,
      projectid: projectId,
      permission,
    },
  })
    .then((res) => res.data)
    .catch(handleError);
};

export const apiUnassignUserPermission = (
  props: MyAxiosProps & {
    username: string;
    projectId: number;
    permission: UserProjectPermission;
  },
) => {
  const { username, projectId, permission, ...axiosProps } = props;
  return myAxios({
    ...axiosProps,
    url: '/projects/permissions-projects-remove/',
    method: 'POST',
    data: {
      username,
      projectId,
      permission,
    },
  })
    .then((res) => res.data)
    .catch(handleError);
};

export const apiSetUserPermissionsForProject = (
  props: MyAxiosProps & {
    username: string;
    projectId: number;
    permissions: UserProjectPermission[];
  },
) => {
  const { username, projectId, permissions, ...axiosProps } = props;
  return myAxios({
    ...axiosProps,
    url: '/projects/permissionsmap-projects-assign/',
    method: 'POST',
    data: {
      username,
      projectid: projectId,
      permissions,
    },
  })
    .then((res) => res.data)
    .catch(handleError);
};

export const apiGetPermissionsList = (
  props: MyAxiosProps & {
    username: string;
    projectId: number;
  },
) => {
  const { username, projectId, ...axiosProps } = props;
  return myAxios({
    ...axiosProps,
    url: '/projects/permissions-projects-display/',
    method: 'POST',
    data: {
      username,
      projectid: projectId,
    },
  })
    .then((res) => ({ permissions: res.data.permissions }))
    .catch(handleError);
};

export const apiGetAllUsersPermissionsForProject = (
  props: MyAxiosProps & { projectId: number },
) => {
  const { projectId, ...axiosProps } = props;
  return myAxios({
    ...axiosProps,
    url: '/projects/permissions-allusers-display/',
    method: 'POST',
    contentType: 'application/json',
    data: {
      ...axiosProps.params,
      projectid: projectId,
    },
  })
    .then((res) => ({
      permUsersData: convertPermissionsUserDataFromResponse(res.data),
    }))
    .catch(handleError);
};
