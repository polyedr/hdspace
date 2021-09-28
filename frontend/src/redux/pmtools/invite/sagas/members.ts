import Invite from '@Api/pmtools/inviteApi';
import TYPES from '@Redux/actionTypes';
import { addActionSaga } from '@Redux/pmtools/activity/sagas';
import { ToServerFetchMembers, ToServerMember } from '@Src/pm-types/invite/api';
import { put, call, fork } from 'redux-saga/effects';
import { requestEditPermissions, requestPermissionsSaga } from './permissions';

function* fetchMemberList(payload: ToServerFetchMembers) {
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

function* addMember(payload: ToServerMember) {
  try {
    const data = yield call(Invite.addMember, payload);
    yield put({ type: TYPES.ADD_MEMBER, payload: data });
  } catch (e) {
    yield put({ type: TYPES.ERROR, e });
  }
}

function* editMember(payload: ToServerMember) {
  try {
    yield call(Invite.editMembers, payload);
    yield put({ type: TYPES.EDIT_MEMBER, payload });
  } catch (e) {
    yield put({ type: TYPES.ERROR, e });
  }
}

function* removeMember({ id, access }) {
  try {
    yield call(Invite.removeMember, { id, access });
    yield put({ type: TYPES.REMOVE_MEMBER, payload: id });
  } catch (e) {
    yield put({ type: TYPES.ERROR, e });
  }
}

export function* removeMemberSaga({ payload }: any) {
  yield fork(removeMember, payload);
  yield fork(addActionSaga, payload);
}

export function* editMemberSaga({ payload }: any) {
  yield fork(editMember, payload);
  yield fork(requestEditPermissions, payload);
  yield fork(addActionSaga, payload);
}

export function* fetchMembersSaga({ payload }: any) {
  yield put({ type: TYPES.MEMBERS_LOADER, payload: true });
  yield fork(fetchMemberList, payload);
  yield fork(requestPermissionsSaga, payload);
  yield put({ type: TYPES.MEMBERS_LOADER, payload: false });
}

export function* addMemberSaga({ payload }: any) {
  console.log(payload);
  yield fork(addMember, payload);
  yield fork(requestEditPermissions, payload);
  yield fork(addActionSaga, payload);
}
