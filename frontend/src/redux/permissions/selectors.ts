import { AppReduxState } from '@Redux/types';
import { UserProjectPermission } from '@Src/types';

export const selectAllUsers = ({ permissions }: AppReduxState) =>
  permissions.allUsersList.results;

export const selectUsersNext = ({ permissions }: AppReduxState) =>
  permissions.allUsersList.next;

export const selectUsersLoading = ({ permissions }: AppReduxState) =>
  permissions.allUsersList.loading;

export const selectUsersSearchValue = ({ permissions }: AppReduxState) =>
  permissions.allUsersList.search;

export const selectUsersPrev = ({ permissions }: AppReduxState) =>
  permissions.allUsersList.previous;

export const selectUsersPageSize = ({ permissions }: AppReduxState) =>
  permissions.allUsersList.pageSize;

export const selectAllUsersPermissions = ({ permissions }: AppReduxState) =>
  permissions.projectUsersPermissionsList.data;
export const selectUserFromAllUsers =
  (userId: string) => (state: AppReduxState) => {
    const allUsers = selectAllUsers(state);
    return allUsers[userId];
  };

export const selectUserFromProjectUsers =
  (userId: string) =>
  ({ permissions }: AppReduxState) =>
    permissions.projectUsersPermissionsList.data[userId]?.userData || null;

export const selectUserPermissions =
  (userId: string) =>
  ({ permissions }: AppReduxState) => {
    const existingUserData =
      permissions.projectUsersPermissionsList.data[userId];
    if (!existingUserData) {
      return [];
    }
    return existingUserData.permissions;
  };

export const selectIfProjectUserExists =
  (userId: number) =>
  ({ permissions }: AppReduxState) => {
    const existingProjectUserData =
      permissions.projectUsersPermissionsList.data;
    if (!existingProjectUserData) {
      return false;
    }
    return !!existingProjectUserData[userId.toString()];
  };

export const selectCurrentUserProjectPermissions = ({
  permissions,
}: AppReduxState) => permissions.currentUserProjectPermissions;

export const selectIfCurrentUserHasPermission =
  (permission: UserProjectPermission) => (state: AppReduxState) => {
    const permissions = selectCurrentUserProjectPermissions(state);
    return permissions.includes(permission);
  };
