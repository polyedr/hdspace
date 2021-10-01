import TYPES from '@Redux/actionTypes';
import {
  RequestPermissions,
  ToServerFetchMembers,
} from '@Src/types/pmtools/actions';

export const editPermissions = (payload: RequestPermissions) => ({
  type: TYPES.SET_PERMISSIONS_DATA,
  payload,
});

export const permissionsAction = (payload: ToServerFetchMembers) => ({
  type: TYPES.PERMISSIONS,
  payload,
});
