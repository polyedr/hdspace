import Invite from '@Api/pmtools/inviteApi';
import TYPES from '@Redux/actionTypes';
import { ToServerFetchMembers } from '@Src/types/pmtools/actions';
import { call, put } from 'redux-saga/effects';
import sidePanelError from '../actions/error';
import {
  successAddPermissions,
  successRemovePermissions,
  successUploadPermissions,
} from '../actions/permissions';

export function* permissionsSaga(payload: ToServerFetchMembers) {
  try {
    const permissions = yield call(Invite.getPermissionsUser, payload);
    const resultPermissions = permissions.map((per) => ({
      username: per.userdata.username,
      permissions: per.permissions,
    }));
    yield put({
      type: TYPES.PERMISSIONS,
      payload: resultPermissions,
    });
  } catch (e) {
    yield put(sidePanelError(e));
  }
}

export function* updatePermissions({ permissions, project, username, access }) {
  try {
    yield call(Invite.updatePermissions, {
      access,
      permissions,
      projectid: project,
      username,
    });
    yield put(successUploadPermissions({ permissions, username }));
  } catch (e) {
    yield put(sidePanelError(e));
  }
}

export function* addPermissions({ permissions, project, username, access }) {
  try {
    yield call(Invite.updatePermissions, {
      access,
      permissions,
      projectid: project,
      username,
    });
    yield put(successAddPermissions({ permissions, username }));
  } catch (e) {
    yield put(sidePanelError(e));
  }
}

export function* deletePermissions({ permissions, project, username, access }) {
  try {
    yield call(Invite.updatePermissions, {
      access,
      permissions,
      projectid: project,
      username,
    });
    yield put(successRemovePermissions({ permissions, username }));
  } catch (e) {
    yield put(sidePanelError(e));
  }
}
