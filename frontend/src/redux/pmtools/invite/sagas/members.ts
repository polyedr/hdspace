import Invite from '@Api/pmtools/inviteApi';
import TYPES from '@Redux/actionTypes';
import { addActionSaga } from '@Redux/pmtools/activity/sagas';
import { reqWrapper } from '@Redux/project/sagas/shared';
import { RequestMember } from '@Src/types/pmtools/actions';
import { put, call, fork } from 'redux-saga/effects';
import sidePanelError from '../actions/error';
import * as actionsMembers from '../actions/members';
import {
  successAddPermissions,
  successUploadPermissions,
} from '../actions/permissions';

export function* fetchMembersSaga({
  payload,
}: ReturnType<typeof actionsMembers.requestFetchMembers>) {
  try {
    const members = yield call(reqWrapper, Invite.fetchMembers, {
      projectId: payload.projectId,
    });
    yield put(actionsMembers.successFetchMembers(members));
  } catch (e) {
    yield put(sidePanelError(e));
  }
}

function* addMember(payload: RequestMember) {
  try {
    const data = yield call(reqWrapper, Invite.addMember, { data: payload });
    yield put(actionsMembers.successAddMember(data));
  } catch (e) {
    yield put({ type: TYPES.ERROR, e });
  }
}

function* editMember(payload: RequestMember) {
  try {
    yield call(reqWrapper, Invite.editMembers, { data: payload });
    yield put(actionsMembers.successEditMembers(payload));
  } catch (e) {
    yield put(sidePanelError(e));
  }
}

function* removeMember({ id }) {
  try {
    yield call(reqWrapper, Invite.removeMember, { id });
    yield put(actionsMembers.successRemoveMember(id));
  } catch (e) {
    yield put(sidePanelError(e));
  }
}

export function* removeMemberSaga({
  payload,
}: ReturnType<typeof actionsMembers.requestRemoveMember>) {
  yield fork(removeMember, payload);
  yield fork(addActionSaga, payload);
}

export function* editMemberSaga({
  payload,
}:
  | ReturnType<typeof actionsMembers.requestEditMember>
  | ReturnType<typeof successUploadPermissions>) {
  yield fork(editMember, payload);
  yield fork(addActionSaga, payload);
}

export function* addMemberSaga({
  payload,
}:
  | ReturnType<typeof actionsMembers.requestAddMember>
  | ReturnType<typeof successAddPermissions>) {
  yield fork(addMember, payload);
  yield fork(addActionSaga, payload);
}
