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
        draft.allUsersList.results = {
          ...(draft.allUsersList.search === search
            ? draft.allUsersList.results
            : {}),
          ...arrayToMap(results),
        };
        draft.allUsersList.search = search;
        draft.allUsersList.next = next;
        draft.allUsersList.previous = previous;
        draft.allUsersList.loading = false;
        break;
      }
      case TYPES.SET_USERS_LOADER: {
        draft.allUsersList.loading = action.payload.active;
        break;
      }

      case TYPES.SET_PROJECT_USERS_LOADER: {
        draft.projectUsersPermissionsList.loading = action.payload.active;
        break;
      }

      case TYPES.SET_STATE_ALL_USERS_PERMISSIONS_FOR_PROJECT: {
        const { projectId, usersData } = action.payload;
        draft.projectUsersPermissionsList = {
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

      case TYPES.SET_STATE_USER_PERMISSIONS: {
        const { userData, permissions } = action.payload;
        draft.projectUsersPermissionsList.data = {
          ...draft.projectUsersPermissionsList.data,
          [userData.id.toString()]: {
            id: userData.id.toString(),
            permissions,
            userData,
          } as PermissionsUserData & { id: string },
        };
        break;
      }

      case TYPES.SET_STATE_USERS_PERMISSIONS: {
        const { users, permissions } = action.payload;

        const usersCombinedPermissions = {};

        users.forEach((user) => {
          usersCombinedPermissions[user.id.toString()] = {
            id: user.id.toString(),
            permissions,
            userData: user,
          };
        });

        draft.projectUsersPermissionsList.data = {
          ...draft.projectUsersPermissionsList.data,
          ...usersCombinedPermissions,
        };
        break;
      }

      case TYPES.CLEAR_STATE_USER_PERMISSIONS:
        // eslint-disable-next-line no-case-declarations
        const { userId } = action.payload;
        // eslint-disable-next-line no-case-declarations
        const filteredUsersIds = Object.keys(
          draft.projectUsersPermissionsList.data,
        ).filter((uId) => uId !== userId);

        draft.projectUsersPermissionsList = {
          ...draft.projectUsersPermissionsList,
          data: filteredUsersIds.reduce(
            (usersData, uId) => ({
              ...usersData,
              [uId]: draft.projectUsersPermissionsList.data[uId],
            }),
            {},
          ),
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
