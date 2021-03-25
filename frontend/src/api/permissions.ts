import { myAxios } from '@Src/config/settings';
import { MyAxiosProps, UserProjectPermission } from '@Src/types';
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
    method: 'GET',
    data: {
      username,
      projectId,
    },
  })
    .then((res) => res.data)
    .catch(handleError);
};
