/* eslint-disable no-unused-expressions */
import { select, put, call } from 'redux-saga/effects';
import { enqueueSnackbar } from '@Redux/notification/actions';
import * as Actions from '@Redux/permissions/actions';
import { PaginatedResponse, Result, UserData } from '@Src/types';
import { reqWrapper } from '@Redux/project/sagas/shared';
import { apiGetUsers } from '@Api/user';
import {
  apiGetAllUsersPermissionsForProject,
  apiGetPermissionsList,
  apiSetUserPermissionsForProject,
} from '@Api/permissions';
import { selectUserData } from '@Redux/user/selectors';
import { requestAddHistory } from '@Redux/pmtools/activity/actions';
// import { selectBoardData } from '@Redux/pmtools/board/selectors';
// import {
//   apiAddSubscribeToStream,
//   apiUnsubscribeToStream,
// } from '@Api/pmtools/chatApi';
// import {
//   apiGetBoard,
//   getAddUserToBoard,
//   getRemoveUserToBoard,
//   getUserByEmail,
// } from '@Api/pmtools/board/boardApi';
// import { apiGetMembersOfBoard } from '@Api/pmtools/board/tasksApi';
// import { successFetchMembers } from '@Redux/pmtools/board/actions/tasks';
import { ActionTypePM } from '@Src/types/pmtools/types';
import {
  selectUserFromAllUsers,
  selectUserFromProjectUsers,
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
    if (e instanceof Error) {
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
    if (e instanceof Error) {
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
    if (e instanceof Error) {
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
}

export function* updateUserPermissionsForProjectSaga(
  action: ReturnType<typeof Actions.updateUserPermissionsForProject>,
) {
  const { userId, projectId, permissions } = action.payload;
  try {
    let user = yield select(selectUserFromProjectUsers(userId));

    if (!user) {
      user = yield select(selectUserFromAllUsers(userId));
    }
    if (!user) {
      yield put(
        enqueueSnackbar({
          message: 'User not found',
          options: { variant: 'error' },
        }),
      );
      return;
    }

    // let board = yield select(selectBoardData);
    // if (!board) {
    //   const boardData = yield call(reqWrapper, apiGetBoard, {
    //     project: projectId,
    //   });
    //   board = JSON.parse(boardData);
    // }
    // if (user.profile.parameters.passwordZulip) {
    //   const { name: streamName } = board;
    //   permissions.length
    //     ? yield call(apiAddSubscribeToStream, streamName, user.email)
    //     : yield call(apiUnsubscribeToStream, streamName, user.email);
    // }

    // const userTrello = yield call(getUserByEmail, user.email);

    // if (!userTrello.error) {
    //   permissions.length
    //     ? yield call(getAddUserToBoard, user.email, board.id)
    //     : yield call(getRemoveUserToBoard, userTrello.id, board.id);
    // }

    // const members = yield call(apiGetMembersOfBoard, board.id);
    // yield put(successFetchMembers(members));

    if (permissions && permissions.length) {
      const actionData: ActionTypePM = {
        action: `${user.firstName}'s rights have been changed`,
        platform: 'MAIN-APP',
        priority: 'high',
      };
      yield put(requestAddHistory({ project: projectId, ...actionData }));
      yield put(Actions.setStateUserPermissions(user, permissions));
    } else {
      yield put(Actions.clearStateUserPermissions(user.id.toString()));
    }
    const { error } = yield call(reqWrapper, apiSetUserPermissionsForProject, {
      username: user.username,
      projectId,
      permissions,
    });
    if (error) {
      throw new Error(error);
    }
  } catch (e) {
    if (e instanceof Error) {
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
}
