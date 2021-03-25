import { AppReduxState } from '@Redux/types';

export const selectUsersForProject = ({ permissions }: AppReduxState) =>
  permissions.usersPermissionsListData.results;

export const selectUserForProject = (userId: string) => (
  state: AppReduxState,
) => {
  const allUsers = selectUsersForProject(state);
  return allUsers[userId] || null;
};

export const selectUsersNext = ({ permissions }: AppReduxState) =>
  permissions.usersPermissionsListData.next;

export const selectUsersLoading = ({ permissions }: AppReduxState) =>
  permissions.usersPermissionsListData.loading;

export const selectUsersSearchValue = ({ permissions }: AppReduxState) =>
  permissions.usersPermissionsListData.search;

export const selectUsersPrev = ({ permissions }: AppReduxState) =>
  permissions.usersPermissionsListData.previous;

export const selectUsersPageSize = ({ permissions }: AppReduxState) =>
  permissions.usersPermissionsListData.pageSize;

export const selectProjectUsersNext = ({ permissions }: AppReduxState) =>
  permissions.projectUsersData.next;

export const selectProjectUsersPrev = ({ permissions }: AppReduxState) =>
  permissions.projectUsersData.previous;

export const selectProjectUsersPageSize = ({ permissions }: AppReduxState) =>
  permissions.projectUsersData.pageSize;

export const selectProjectUsersLoading = ({ permissions }: AppReduxState) =>
  permissions.projectUsersData.loading;

export const selectUserPermissions = (projectId: number, userId: string) => ({
  permissions,
}: AppReduxState) => {
  const userProjectsPermissions = permissions.usersPermissions[userId];
  if (!userProjectsPermissions) {
    return [];
  }
  return userProjectsPermissions[projectId] || [];
};
