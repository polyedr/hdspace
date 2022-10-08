import {
  assignUserPermissionForProject,
  clearStateUserPermissions,
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
  setStateUsersPermissions,
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
  | typeof setStateUsersPermissions
  | typeof clearStateUserPermissions
  | typeof setStateAllUsersPermissions
  | typeof setStateCurrentUserPermissions
>;
