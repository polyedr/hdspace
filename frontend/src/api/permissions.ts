import { myAxios } from '@Src/config/settings';
import { MyAxiosProps, UserProjectPermission } from '@Src/types';
import { convertPermissionsUserDataFromResponse } from './converters/permissions/fromResponse';
import { handleError } from './helper';

export const apiSetUserPermissionsForProject = async (
  props: MyAxiosProps & {
    username: string;
    projectId: number;
    permissions: UserProjectPermission[];
  },
) => {
  const { username, projectId, permissions, ...axiosProps } = props;
  return await myAxios({
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

export const apiSetUsersPermissionsForProject = async (
  props: MyAxiosProps & {
    emails: string[];
    projectId: number;
    permissions: UserProjectPermission[];
  },
) => {
  const { emails, projectId, permissions, ...axiosProps } = props;
  return await myAxios({
    ...axiosProps,
    url: '/projects/permissionsmaps-projects-assign/',
    method: 'POST',
    data: {
      emails,
      projectid: projectId,
      permissions,
    },
  })
    .then((res) => res.data)
    .catch(handleError);
};

export const apiGetPermissionsList = async (
  props: MyAxiosProps & {
    username: string;
    projectId: number;
  },
) => {
  const { username, projectId, ...axiosProps } = props;
  return await myAxios({
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

export const apiGetAllUsersPermissionsForProject = async (
  props: MyAxiosProps & { projectId: number },
) => {
  const { projectId, ...axiosProps } = props;
  return await myAxios({
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
