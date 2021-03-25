import {
  assignUserPermissionsForProject,
  getMyPermissionsForProject,
  getUserPermissionsForProject,
  getUsersList,
  setProjectUsersLoader,
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
>;
