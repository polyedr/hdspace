import produce from 'immer';
import { PermissionsState } from '@Redux/types';
import { arrayToMap } from '@Utils/normalizedStateHelpers';
import { PermissionsAction } from './types';
import initialPermissionsState from './initial';
import TYPES from '../actionTypes';

export default produce(
  // eslint-disable-next-line consistent-return
  (draft: PermissionsState, action: PermissionsAction) => {
    switch (action.type) {
      case TYPES.SET_USERS_DATA: {
        const { search, data } = action.payload;
        const { results, next, previous } = data;
        draft.usersPermissionsListData.results = {
          ...(draft.usersPermissionsListData.search === search
            ? draft.usersPermissionsListData.results
            : {}),
          ...arrayToMap(results),
        };
        draft.usersPermissionsListData.search = search;
        draft.usersPermissionsListData.next = next;
        draft.usersPermissionsListData.previous = previous;
        draft.usersPermissionsListData.loading = false;
        break;
      }
      case TYPES.SET_USERS_LOADER: {
        draft.usersPermissionsListData.loading = action.payload.active;
        break;
      }

      case TYPES.SET_PROJECT_USERS_LOADER: {
        draft.allProjectsUsersPermissions.loading = action.payload.active;
        break;
      }

      case TYPES.SET_STATE_ALL_USERS_PERMISSIONS_FOR_PROJECT: {
        const { projectId, usersData } = action.payload;
        draft.allProjectsUsersPermissions.data[projectId] = usersData;
        break;
      }

      case TYPES.SET_STATE_CURRENT_USER_PERMISSIONS: {
        const { permissions } = action.payload;
        draft.currentUserProjectPermissions = permissions;
        break;
      }

      default:
        return draft;
    }
  },
  initialPermissionsState,
);
