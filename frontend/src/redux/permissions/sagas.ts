import { select, put, call } from 'redux-saga/effects';
import { enqueueSnackbar } from '@Redux/notification/actions';
import * as Actions from '@Redux/permissions/actions';
import { PaginatedResponse, Result, UserData } from '@Src/types';
import { reqWrapper } from '@Redux/project/sagas/shared';
import { apiGetUsers } from '@Api/user';
import {
  apiAssignUserPermission,
  apiGetPermissionsList,
  apiUnassignUserPermission,
} from '@Api/permissions';
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

export function* assignUserPermissionsSaga(
  action: ReturnType<typeof Actions.assignUserPermissionsForProject>,
) {
  const { userId, projectId, permission } = action.payload;
  try {
    const permissions = yield select(selectUserPermissions(projectId, userId));
    if (permissions.includes(permission)) {
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
    yield put(Actions.setStateUserPermissions(userId, projectId, permissions));
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

export function* unassignUserPermissionsSaga(
  action: ReturnType<typeof Actions.unassignUserPermissionsForProject>,
) {
  try {
    const { userId, projectId, permission } = action.payload;
    const permissions = yield select(selectUserPermissions(projectId, userId));
    if (!permissions.includes(permission)) {
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
      ...permissions.filter((perm) => perm !== permission),
    ];
    yield put(
      Actions.setStateUserPermissions(userId, projectId, newPermissions),
    );
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

export function* getUserPermissionsForProjectSaga(
  action: ReturnType<typeof Actions.getUserPermissionsForProject>,
) {
  const { userId, projectId } = action.payload;
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
    const { result, error } = yield call(reqWrapper, apiGetPermissionsList, {
      username: user.username,
      projectId,
    });
    if (error) {
      throw new Error(error);
    }
    console.log('GET USER PERMISSIONS RESULT!!', result);
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

/* export function* getAllUsersProjectPermissionsSaga() {
// action: ReturnType<typeof Actions.getAllUsersProjectPermissions>,
  console.log('oops');
} */

/* export function* getMyPermissionsForProjectSaga() {
  action: ReturnType<typeof Actions.getMyPermissionsForProject>,
  const { projectId } = action.payload;
  try {
    const currentUser = yield select()
  }
} */
