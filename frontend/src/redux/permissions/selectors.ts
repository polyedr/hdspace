import { AppReduxState } from '@Redux/types';

export const selectUsersForProject = ({ permissions }: AppReduxState) =>
  permissions.usersPermissionsListData.results;

export const selectUserForProject = (userId: number) => (
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

export const selectUserPermissions = (projectId: number, userId: number) => ({
  permissions,
}: AppReduxState) => {
  const existingProjectUserData =
    permissions.allProjectsUsersPermissions[projectId];
  if (!existingProjectUserData) {
    return [];
  }
  const existingUserData = existingProjectUserData.data.find(
    (dataItem) => dataItem.userData.id === userId,
  );
  return existingUserData ? existingUserData.permissions : [];
};

export const selectIfProjectUserExists = (
  projectId: string,
  userId: number,
) => ({ permissions }: AppReduxState) => {
  const existingProjectUserData =
    permissions.allProjectsUsersPermissions[projectId];
  if (!existingProjectUserData) {
    return false;
  }
  return !!existingProjectUserData.data.find(
    (data) => data.userData.id === userId,
  );
};

export const selectCurrentUserProjectPermissions = ({
  permissions,
}: AppReduxState) => {
  return permissions.currentUserProjectPermissions;
};
