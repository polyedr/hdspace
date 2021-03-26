import {
  assignUserPermissionsForProject,
  getMyPermissionsForProject,
  getUserPermissionsForProject,
  getUsersList,
  setProjectUsersLoader,
  setStateAllUsersPermissions,
  setStateCurrentUserPermissions,
  setStateUserPermissions,
  setUsersData,
  setUsersLoader,
  unassignUserPermissionsForProject,
} from './actions';

export type PermissionsAction = ReturnType<
  | typeof getUsersList
  | typeof setUsersData
  | typeof setUsersLoader
  | typeof setProjectUsersLoader
  | typeof assignUserPermissionsForProject
  | typeof unassignUserPermissionsForProject
  | typeof getUserPermissionsForProject
  | typeof getMyPermissionsForProject
  | typeof setStateUserPermissions
  | typeof setStateAllUsersPermissions
  | typeof setStateCurrentUserPermissions
>;
