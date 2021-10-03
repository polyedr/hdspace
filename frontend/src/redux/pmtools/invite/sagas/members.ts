import Invite from '@Api/pmtools/inviteApi';
import TYPES from '@Redux/actionTypes';
import { addActionSaga } from '@Redux/pmtools/activity/sagas';
import {
  ToServerFetchMembers,
  ToServerMember,
} from '@Src/types/pmtools/actions';
import { put, call, fork } from 'redux-saga/effects';
import sidePanelError from '../actions/error';
import * as actionsMembers from '../actions/members';
import {
  successAddPermissions,
  successUploadPermissions,
} from '../actions/permissions';
import {
  updatePermissions,
  permissionsSaga,
  addPermissions,
  deletePermissions,
} from './permissions';

function* fetchMemberList(payload: ToServerFetchMembers) {
  try {
    const members = yield call(Invite.fetchMembers, payload);
    yield put(actionsMembers.successFetchMembers(members));
  } catch (e) {
    yield put(sidePanelError(e));
  }
}

function* addMember(payload: ToServerMember) {
  try {
    const data = yield call(Invite.addMember, payload);
    yield put(actionsMembers.successAddMember(data));
  } catch (e) {
    yield put({ type: TYPES.ERROR, e });
  }
}

function* editMember(payload: ToServerMember) {
  try {
    yield call(Invite.editMembers, payload);
    yield put(actionsMembers.successEditMembers(payload));
  } catch (e) {
    yield put(sidePanelError(e));
  }
}

function* removeMember({ id, access }) {
  try {
    yield call(Invite.removeMember, { id, access });
    yield put(actionsMembers.successRemoveMember(id));
  } catch (e) {
    yield put(sidePanelError(e));
  }
}

export function* removeMemberSaga({
  payload,
}: ReturnType<typeof actionsMembers.requestRemoveMember>) {
  yield fork(removeMember, payload);
  yield fork(deletePermissions, payload);
  yield fork(addActionSaga, payload);
}

export function* editMemberSaga({
  payload,
}:
  | ReturnType<typeof actionsMembers.requestEditMember>
  | ReturnType<typeof successUploadPermissions>) {
  yield fork(editMember, payload);
  yield fork(updatePermissions, payload);
  yield fork(addActionSaga, payload);
}

export function* fetchMembersSaga({
  payload,
}: ReturnType<typeof actionsMembers.requestFetchMembers>) {
  yield fork(fetchMemberList, payload);
  yield fork(permissionsSaga, payload);
}

export function* addMemberSaga({
  payload,
}:
  | ReturnType<typeof actionsMembers.requestAddMember>
  | ReturnType<typeof successAddPermissions>) {
  yield fork(addMember, payload);
  yield fork(addPermissions, payload);
  yield fork(addActionSaga, payload);
}
