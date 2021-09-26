import Invite from '@Api/pmtools/inviteApi';
import TYPES from '@Redux/actionTypes';
import { addActionSaga } from '@Redux/pmtools/activity/sagas';
import { ToServerFetchMembers, ToServerMember } from '@Src/pm-types/invite/api';
import { put, call, PutEffect, CallEffect, fork } from 'redux-saga/effects';
import { requestEditPermissions, requestPermissionsSaga } from './permissions';

export function* fetchMemberList(payload: ToServerFetchMembers) {
  try {
    const members = yield call(Invite.fetchMembers, payload);
    yield put({
      type: TYPES.FETCH_MEMBERS,
      payload: members,
    });
  } catch (e) {
    yield put({ type: TYPES.ERROR, e });
  }
}

export function* fetchMembersSaga({ payload }: any) {
  yield put({ type: TYPES.MEMBERS_LOADER, payload: true });
  yield fork(fetchMemberList, payload);
  yield fork(requestPermissionsSaga, payload);
  yield put({ type: TYPES.MEMBERS_LOADER, payload: false });
}

export function* addMember(payload: ToServerMember) {
  try {
    const data = yield call(Invite.addMember, payload);
    yield put({ type: TYPES.ADD_MEMBER, payload: data });
  } catch (e) {
    yield put({ type: TYPES.ERROR, e });
  }
}

export function* addMemberSaga({ payload }: any) {
  yield fork(addMember, payload);
  yield fork(requestEditPermissions, payload);
  yield fork(addActionSaga, payload);
}

export function* editMember(payload: any) {
  try {
    const { project, userId, status, role, id, access } = payload;
    const data = {
      id,
      access,
      role,
      status,
      project,
      user_id: userId,
    };
    yield call(Invite.editMembers, data);
    yield put({
      type: TYPES.EDIT_MEMBER,
      payload: data,
    });
  } catch (e) {
    yield put({ type: TYPES.ERROR, e });
  }
}

export function* editMemberSaga({ payload }: any) {
  yield fork(editMember, payload);
  yield fork(requestEditPermissions, payload);
  yield fork(addActionSaga, payload);
}

export function* removeMemberSaga({
  payload,
}: any): Generator<PutEffect | CallEffect> {
  try {
    yield call(Invite.removeMember, { id: payload.id, access: payload.access });
    yield put({ type: TYPES.REMOVE_MEMBER, payload: payload.id });
  } catch (e) {
    yield put({ type: TYPES.ERROR, e });
  }
}
