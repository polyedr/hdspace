import Invite from '@Api/pmtools/inviteApi';
import TYPES from '@Redux/actionTypes';
import { put, call, PutEffect, CallEffect } from 'redux-saga/effects';
import { requestAction } from '../../activity/actions';
import {
  requestEditPermissionsAction,
  requestPermissionsAction,
} from '../actions';

export function* fetchMembersSaga({
  payload,
}: {
  type: string;
  payload: number;
}): Generator<PutEffect | CallEffect> {
  try {
    yield put({ type: TYPES.MEMBERS_LOADER, payload: true });
    const members = yield call(Invite.fetchMembers, payload);
    yield put({
      type: TYPES.FETCH_MEMBERS,
      payload: members,
    });
    yield put(requestPermissionsAction(payload));
    yield put({ type: TYPES.MEMBERS_LOADER, payload: false });
  } catch (e) {
    yield put({ type: TYPES.ERROR, e });
  }
}

export function* editMemberSaga({
  payload,
}: any): Generator<PutEffect | CallEffect> {
  try {
    const {
      projectId,
      userId,
      action: { member, permissions },
    } = payload;
    const data = {
      id: payload.id,
      role: payload.role,
      status: payload.status,
      project: projectId,
      user_id: userId,
    };
    if (permissions) {
      yield put(
        requestEditPermissionsAction({
          projectId,
          permissions: payload.permissions,
          username: payload.username,
          action: permissions,
        }),
      );
    }
    if (member) {
      yield call(Invite.editMembers, data);
      yield put({
        type: TYPES.EDIT_MEMBER,
        payload: data,
      });
      yield put(requestAction({ action: member, projectId }));
    }
  } catch (e) {
    yield put({ type: TYPES.ERROR, e });
  }
}

export function* removeMemberSaga({
  payload,
}: any): Generator<PutEffect | CallEffect> {
  try {
    yield call(Invite.removeMember, payload.memberId);
    yield put({ type: TYPES.REMOVE_MEMBER, payload: payload.memberId });
    yield put(
      requestAction({ projectId: payload.projectId, action: payload.action }),
    );
  } catch (e) {
    yield put({ type: TYPES.ERROR, e });
  }
}

export function* addMemberSaga({
  payload,
}: any): Generator<PutEffect | CallEffect> {
  try {
    const {
      role,
      status,
      projectId,
      userId,
      action,
      permissions,
      username,
    } = payload;
    const data = yield call(Invite.addMember, {
      role,
      status,
      project: projectId,
      user_id: userId,
    });
    yield put(
      requestEditPermissionsAction({ projectId, permissions, username }),
    );
    yield put({ type: TYPES.ADD_MEMBER, payload: data });
    yield put(requestAction({ projectId, action }));
  } catch (e) {
    yield put({ type: TYPES.ERROR, e });
  }
}
