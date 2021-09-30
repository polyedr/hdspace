/* eslint-disable import/prefer-default-export */
import Invite from '@Api/pmtools/inviteApi';
import TYPES from '@Redux/actionTypes';
import { ToServerFetchMembers } from '@Src/types/pmtools/api';
import { call, put } from 'redux-saga/effects';
import sidePanelError from '../actions/error';

export function* permissionsSaga(payload: ToServerFetchMembers) {
  try {
    const permissions = yield call(Invite.getPermissionsUser, payload);
    yield put({
      type: TYPES.PERMISSIONS,
      payload: permissions,
    });
  } catch (e) {
    yield put(sidePanelError(e));
  }
}

export function* editPermissions(payload: any) {
  try {
    console.log(payload);
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
    yield put(sidePanelError(e));
  }
}
