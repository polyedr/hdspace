import TYPES from '@Redux/actionTypes';
import {
  PaginatedResponse,
  PermissionsUserData,
  UserData,
  UserProjectPermission,
} from '@Src/types';

export const getUsersList = (searchValue?: string) => ({
  type: TYPES.LOAD_USERS,
  payload: { searchValue },
});

export const setUsersData = (
  search: string,
  data: PaginatedResponse<UserData>,
) => ({
  type: TYPES.SET_USERS_DATA,
  payload: { search, data },
});

export const assignUserPermissionForProject = (
  projectId: number,
  userId: string,
  permission: UserProjectPermission,
) => ({
  type: TYPES.ASSIGN_USER_PERMISSION_FOR_PROJECT,
  payload: { userId, projectId, permission },
});

export const unassignUserPermissionForProject = (
  projectId: number,
  userId: string,
  permission: UserProjectPermission,
) => ({
  type: TYPES.UNASSIGN_USER_PERMISSION_FOR_PROJECT,
  payload: { userId, projectId, permission },
});

export const updateUserPermissionsForProject = (
  projectId: number,
  userId: string,
  permissions: UserProjectPermission[],
) => ({
  type: TYPES.UPDATE_USER_PERMISSIONS_FOR_PROJECT,
  payload: {
    projectId,
    userId,
    permissions,
  },
});

export const updateUsersPermissionsForProject = (
  projectId: number,
  users: any[],
  permissions: UserProjectPermission[],
) => ({
  type: TYPES.UPDATE_USERS_PERMISSIONS_FOR_PROJECT,
  payload: {
    projectId,
    users,
    permissions,
  },
});

export const getUserPermissionsForProject = (
  projectId: number,
  userId: number,
) => ({
  type: TYPES.GET_USER_PERMISSIONS_FOR_PROJECT,
  payload: { projectId, userId },
});

export const getMyPermissionsForProject = (projectId: number) => ({
  type: TYPES.GET_MY_PERMISSIONS_FOR_PROJECT,
  payload: { projectId },
});

export const setProjectUsersLoader = (active: boolean) => ({
  type: TYPES.SET_PROJECT_USERS_LOADER,
  payload: { active },
});

export const setUsersLoader = (active: boolean) => ({
  type: TYPES.SET_USERS_LOADER,
  payload: { active },
});

export const setStateUserPermissions = (
  userData: UserData,
  permissions: UserProjectPermission[],
) => ({
  type: TYPES.SET_STATE_USER_PERMISSIONS,
  payload: { userData, permissions },
});

export const setStateUsersPermissions = (
  users: UserData[],
  permissions: UserProjectPermission[],
) => ({
  type: TYPES.SET_STATE_USERS_PERMISSIONS,
  payload: { users, permissions },
});

export const clearStateUserPermissions = (userId: string) => ({
  type: TYPES.CLEAR_STATE_USER_PERMISSIONS,
  payload: { userId },
});

export const setStateCurrentUserPermissions = (
  permissions: UserProjectPermission[],
) => ({
  type: TYPES.SET_STATE_CURRENT_USER_PERMISSIONS,
  payload: { permissions },
});

export const getAllUsersProjectPermissions = (projectId: number) => ({
  type: TYPES.GET_ALL_USERS_PROJECT_PERMISSIONS,
  payload: { projectId },
});

export const setStateAllUsersPermissions = (
  projectId: number,
  usersData: PermissionsUserData[],
) => ({
  type: TYPES.SET_STATE_ALL_USERS_PERMISSIONS_FOR_PROJECT,
  payload: { projectId, usersData },
});
