/* eslint-disable import/prefer-default-export */
import Invite from '@Api/pmtools/inviteApi';
import TYPES from '@Redux/actionTypes';
import { ToServerFetchMembers } from '@Src/pm-types/invite/api';
import { call, put } from 'redux-saga/effects';

export function* requestPermissionsSaga(payload: ToServerFetchMembers) {
  try {
    const permissions = yield call(Invite.getPermissionsUser, payload);
    yield put({
      type: TYPES.PERMISSIONS,
      payload: permissions,
    });
  } catch (e) {
    yield put({ type: TYPES.ERROR, e });
  }
}

export function* requestEditPermissions(payload: any) {
  try {
    const { permissions, project, username, access } = payload;
    let result;

    if (permissions) {
      result = [...permissions.prevState];
      if (permissions.write) {
        result.push('change_project');
      } else {
        result = result.filter((e) => e !== 'change_project');
      }
    } else {
      result = ['view_project'];
    }

    yield call(Invite.editPermissions, {
      access,
      permissions: result,
      projectid: project,
      username,
    });
    yield put({
      type: TYPES.EDIT_PERMISSIONS,
      payload: { permissions: result, username },
    });
  } catch (e) {
    yield put({ type: TYPES.ERROR, e });
  }
}
