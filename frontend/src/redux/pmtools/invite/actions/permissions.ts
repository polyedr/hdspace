import TYPES from '@Redux/actionTypes';
import { ToServerFetchMembers } from '@Src/types/pmtools/actions';

export const successUploadPermissions = (payload: any) => ({
  type: TYPES.SET_PERMISSIONS_DATA,
  payload,
});

export const successAddPermissions = (payload: any) => ({
  type: TYPES.ADD_PERMISSIONS,
  payload,
});

export const successRemovePermissions = (payload: any) => ({
  type: TYPES.DELETE_PERMISSIONS,
  payload,
});

export const permissionsAction = (payload: ToServerFetchMembers) => ({
  type: TYPES.PERMISSIONS,
  payload,
});
