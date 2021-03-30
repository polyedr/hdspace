import { select, put, call } from 'redux-saga/effects';
import { enqueueSnackbar } from '@Redux/notification/actions';
import * as Actions from '@Redux/permissions/actions';
import { PaginatedResponse, Result, UserData } from '@Src/types';
import { reqWrapper } from '@Redux/project/sagas/shared';
import { apiGetUsers } from '@Api/user';
import {
  apiAssignUserPermission,
  apiGetAllUsersPermissionsForProject,
  apiGetPermissionsList,
  apiSetUserPermissionsForProject,
  apiUnassignUserPermission,
} from '@Api/permissions';
import { selectUserData } from '@Redux/user/selectors';
import {
  selectUserForProject,
  selectUserPermissions,
  selectUsersNext,
  selectUsersSearchValue,
} from './selectors';

export function* getUsersSaga(action: ReturnType<typeof Actions.getUsersList>) {
  try {
    const { searchValue } = action.payload;
    yield put(Actions.setUsersLoader(true));
    const next: string | null = yield select(selectUsersNext);
    const prevSearchValue = yield select(selectUsersSearchValue);

    const { result, error }: Result<PaginatedResponse<UserData>> = yield call(
      reqWrapper,
      apiGetUsers,
      {
        params: {
          cursor: searchValue === prevSearchValue ? next : null,
        },
        search: searchValue || '',
      },
    );

    if (result) {
      yield put(Actions.setUsersData(searchValue || prevSearchValue, result));
    }

    if (error) {
      throw new Error(error);
    }
  } catch (e) {
    yield put(
      enqueueSnackbar(
        {
          message: e.message,
          options: {
            variant: 'error',
          },
        },
        e,
      ),
    );
  }
}

export function* assignUserPermissionSaga(
  action: ReturnType<typeof Actions.assignUserPermissionForProject>,
) {
  const { userId, projectId, permission } = action.payload;
  try {
    const userPermissions = yield select(selectUserPermissions(userId));
    if (userPermissions.includes(permission)) {
      return;
    }
    const user = yield select(selectUserForProject(userId));
    if (!user) {
      yield put(
        enqueueSnackbar({
          message: 'User not found',
          options: { variant: 'error' },
        }),
      );
      return;
    }
    yield put(
      Actions.setStateUserPermissions(user, [...userPermissions, permission]),
    );
    console.log('PERMISSION!!', permission);
    const { error } = yield call(reqWrapper, apiAssignUserPermission, {
      username: user.username,
      projectId,
      permission,
    });
    if (error) {
      throw new Error(error);
    }
  } catch (e) {
    yield put(
      enqueueSnackbar(
        {
          message: e.message,
          options: { variant: 'error' },
        },
        e,
      ),
    );
  }
}

export function* unassignUserPermissionSaga(
  action: ReturnType<typeof Actions.unassignUserPermissionForProject>,
) {
  try {
    const { userId, projectId, permission } = action.payload;
    const userPermissions = yield select(selectUserPermissions(userId));
    if (!userPermissions.includes(permission)) {
      return;
    }
    const user = yield select(selectUserForProject(userId));
    if (!user) {
      yield put(
        enqueueSnackbar({
          message: 'User not found',
          options: { variant: 'error' },
        }),
      );
      return;
    }
    const newPermissions = [
      ...userPermissions.filter((perm) => perm !== permission),
    ];
    yield put(Actions.setStateUserPermissions(user, newPermissions));
    const { error } = yield call(reqWrapper, apiUnassignUserPermission, {
      username: user.username,
      projectId,
      permission,
    });
    if (error) {
      throw new Error(error);
    }
  } catch (e) {
    yield put(
      enqueueSnackbar(
        {
          message: e.message,
          options: { variant: 'error' },
        },
        e,
      ),
    );
  }
}

export function* getAllUsersProjectPermissionsSaga(
  action: ReturnType<typeof Actions.getAllUsersProjectPermissions>,
) {
  const { projectId } = action.payload;
  try {
    const { permUsersData, error } = yield call(
      reqWrapper,
      apiGetAllUsersPermissionsForProject,
      {
        projectId,
      },
    );
    if (error) {
      throw new Error(error);
    }
    yield put(Actions.setStateAllUsersPermissions(projectId, permUsersData));
  } catch (e) {
    yield put(
      enqueueSnackbar(
        {
          message: e.message,
          options: { variant: 'error' },
        },
        e,
      ),
    );
  }
}

export function* getMyPermissionsForProjectSaga(
  action: ReturnType<typeof Actions.getMyPermissionsForProject>,
) {
  const { projectId } = action.payload;
  try {
    const userData = yield select(selectUserData);
    const { permissions, error } = yield call(
      reqWrapper,
      apiGetPermissionsList,
      {
        projectId,
        username: userData.username,
      },
    );
    if (error) {
      throw new Error(error);
    }
    yield put(Actions.setStateCurrentUserPermissions(permissions));
  } catch (e) {
    yield put(
      enqueueSnackbar(
        {
          message: e.message,
          options: { variant: 'error' },
        },
        e,
      ),
    );
  }
}

export function* updateUserPermissionsForProjectSaga(
  action: ReturnType<typeof Actions.updateUserPermissionsForProject>,
) {
  const { userId, projectId, permissions } = action.payload;
  try {
    const user = yield select(selectUserForProject(userId));
    if (!user) {
      yield put(
        enqueueSnackbar({
          message: 'User not found',
          options: { variant: 'error' },
        }),
      );
      return;
    }
    yield put(Actions.setStateUserPermissions(user, permissions));
    const { error } = yield call(reqWrapper, apiSetUserPermissionsForProject, {
      username: user.username,
      projectId,
      permissions,
    });
    if (error) {
      throw new Error(error);
    }
  } catch (e) {
    yield put(
      enqueueSnackbar(
        {
          message: e.message,
          options: { variant: 'error' },
        },
        e,
      ),
    );
  }
}
