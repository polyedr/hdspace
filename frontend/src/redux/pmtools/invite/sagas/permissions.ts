import Invite from '@Api/pmtools/inviteApi';
import TYPES from '@Redux/actionTypes';
import { call, put } from 'redux-saga/effects';
import { requestAction } from '../../activity/actions';

export function* requestEditPermissionsSaga({ payload }: any): Generator<any> {
  try {
    const { permissions, projectId, username, action } = payload;
    let result = [...permissions.prevState];
    if (permissions.write) {
      result.push('change_project');
    } else {
      result = result.filter((e) => e !== 'change_project');
    }

    yield call(Invite.editPermissions, {
      permissions: result,
      projectid: projectId,
      username,
    });
    yield put({
      type: TYPES.EDIT_PERMISSIONS,
      payload: { permissions: result, username },
    });
    yield put(requestAction({ action, projectId }));
  } catch (e) {
    yield put({ type: TYPES.ERROR, e });
  }
}

export function* requestPermissionsSaga({ payload }: any): Generator<any> {
  try {
    const data: any = yield call(Invite.getPermissionsUser, payload);
    yield put({
      type: TYPES.PERMISSIONS,
      payload: data,
    });
  } catch (e) {
    yield put({ type: TYPES.ERROR, e });
  }
}
