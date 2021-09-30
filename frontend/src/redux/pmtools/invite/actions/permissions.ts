import TYPES from '@Redux/actionTypes';
import { RequestPermissions } from '@Src/types/pmtools/actions';
import { ToServerFetchMembers } from '@Src/types/pmtools/api';

export const editPermissions = (payload: RequestPermissions) => ({
  type: TYPES.EDIT_PERMISSIONS,
  payload,
});

export const permissionsAction = (payload: ToServerFetchMembers) => ({
  type: TYPES.PERMISSIONS,
  payload,
});
