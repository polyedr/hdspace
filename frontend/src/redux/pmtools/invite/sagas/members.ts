import Invite from '@Api/pmtools/inviteApi';
import TYPES from '@Redux/actionTypes';
import { addActionSaga } from '@Redux/pmtools/activity/sagas';
import {
  ToServerFetchMembers,
  ToServerMember,
} from '@Src/types/pmtools/actions';
import { put, call, fork } from 'redux-saga/effects';
import sidePanelError from '../actions/error';
import {
  requestAddMember,
  requestEditMember,
  requestFetchMembers,
  requestRemoveMember,
  successAddMember,
  successEditMembers,
  successFetchMembers,
  successRemoveMember,
} from '../actions/members';
import { editPermissions, permissionsSaga } from './permissions';

function* fetchMemberList(payload: ToServerFetchMembers) {
  try {
    const members = yield call(Invite.fetchMembers, payload);
    yield put(successFetchMembers(members));
  } catch (e) {
    yield put(sidePanelError(e));
  }
}

function* addMember(payload: ToServerMember) {
  try {
    const data = yield call(Invite.addMember, payload);
    yield put(successAddMember(data));
  } catch (e) {
    yield put({ type: TYPES.ERROR, e });
  }
}

function* editMember(payload: ToServerMember) {
  try {
    yield call(Invite.editMembers, payload);
    yield put(successEditMembers(payload));
  } catch (e) {
    yield put(sidePanelError(e));
  }
}

function* removeMember({ id, access }) {
  try {
    yield call(Invite.removeMember, { id, access });
    yield put(successRemoveMember(id));
  } catch (e) {
    yield put(sidePanelError(e));
  }
}

export function* removeMemberSaga({
  payload,
}: ReturnType<typeof requestRemoveMember>) {
  yield fork(removeMember, payload);
  yield fork(addActionSaga, payload);
}

export function* editMemberSaga({
  payload,
}: ReturnType<typeof requestEditMember>) {
  yield fork(editMember, payload);
  yield fork(editPermissions, payload);
  yield fork(addActionSaga, payload);
}

export function* fetchMembersSaga({
  payload,
}: ReturnType<typeof requestFetchMembers>) {
  yield fork(fetchMemberList, payload);
  yield fork(permissionsSaga, payload);
}

export function* addMemberSaga({
  payload,
}: ReturnType<typeof requestAddMember>) {
  yield fork(addMember, payload);
  yield fork(editPermissions, payload);
  yield fork(addActionSaga, payload);
}
