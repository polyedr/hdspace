import {
  assignUserPermissionForProject,
  getMyPermissionsForProject,
  getUserPermissionsForProject,
  getUsersList,
  setProjectUsersLoader,
  setStateAllUsersPermissions,
  setStateCurrentUserPermissions,
  setStateUserPermissions,
  setUsersData,
  setUsersLoader,
  unassignUserPermissionForProject,
} from './actions';

export type PermissionsAction = ReturnType<
  | typeof getUsersList
  | typeof setUsersData
  | typeof setUsersLoader
  | typeof setProjectUsersLoader
  | typeof assignUserPermissionForProject
  | typeof unassignUserPermissionForProject
  | typeof getUserPermissionsForProject
  | typeof getMyPermissionsForProject
  | typeof setStateUserPermissions
  | typeof setStateAllUsersPermissions
  | typeof setStateCurrentUserPermissions
>;
