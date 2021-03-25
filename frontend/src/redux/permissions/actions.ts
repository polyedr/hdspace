import TYPES from '@Redux/actionTypes';
import { PaginatedResponse, UserData, UserProjectPermission } from '@Src/types';

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

export const assignUserPermissionsForProject = (
  projectId: number,
  userId: string,
  permission: UserProjectPermission,
) => ({
  type: TYPES.ASSIGN_USER_PERMISSIONS_FOR_PROJECT,
  payload: { userId, projectId, permission },
});

export const unassignUserPermissionsForProject = (
  projectId: number,
  userId: string,
  permission: UserProjectPermission,
) => ({
  type: TYPES.UNASSIGN_USER_PERMISSIONS_FOR_PROJECT,
  payload: { userId, projectId, permission },
});

export const getUserPermissionsForProject = (
  projectId: number,
  userId: string,
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
  userId: string,
  projectId: number,
  permissions: UserProjectPermission[],
) => ({
  type: TYPES.SET_STATE_USER_PERMISSIONS,
  payload: { userId, projectId, permissions },
});

export const getAllUsersProjectPermissions = (projectId: string) => ({
  type: TYPES.GET_ALL_USERS_PROJECT_PERMISSIONS,
  payload: { projectId },
});
