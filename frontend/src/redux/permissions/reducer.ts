import produce from 'immer';
import { PermissionsState } from '@Redux/types';
import { arrayToMap } from '@Utils/normalizedStateHelpers';
import { PermissionsUserData } from '@Src/types';
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
        draft.allUsersProjectPermissions.loading = action.payload.active;
        break;
      }

      case TYPES.SET_STATE_ALL_USERS_PERMISSIONS_FOR_PROJECT: {
        const { projectId, usersData } = action.payload;
        draft.allUsersProjectPermissions = {
          loading: false,
          projectId,
          data: usersData.reduce(
            (allData, userPermsData) => ({
              ...allData,
              [userPermsData.userData.id]: userPermsData,
            }),
            {},
          ),
        };
        break;
      }

      case TYPES.SET_STATE_USER_PERMISSIONS:
        // eslint-disable-next-line no-case-declarations
        const { userData, permissions } = action.payload;
        draft.allUsersProjectPermissions.data = {
          ...draft.allUsersProjectPermissions.data,
          [userData.id.toString()]: {
            id: userData.id.toString(),
            permissions,
            userData,
          } as PermissionsUserData & { id: string },
        };
        break;

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
