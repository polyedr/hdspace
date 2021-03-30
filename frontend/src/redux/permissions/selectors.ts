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

export const selectAllUsersPermissions = ({ permissions }: AppReduxState) => {
  return permissions.allUsersProjectPermissions.data;
};

export const selectUserPermissions = (userId: string) => ({
  permissions,
}: AppReduxState) => {
  const existingUserData = permissions.allUsersProjectPermissions.data[userId];
  if (!existingUserData) {
    return [];
  }
  return existingUserData.permissions;
};

export const selectIfProjectUserExists = (userId: number) => ({
  permissions,
}: AppReduxState) => {
  const existingProjectUserData = permissions.allUsersProjectPermissions.data;
  if (!existingProjectUserData) {
    return false;
  }
  return !!existingProjectUserData[userId.toString()];
};

export const selectCurrentUserProjectPermissions = ({
  permissions,
}: AppReduxState) => {
  return permissions.currentUserProjectPermissions;
};
