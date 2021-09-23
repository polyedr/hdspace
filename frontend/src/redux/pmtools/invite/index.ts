import TYPES from '@Redux/actionTypes';
import { takeLatest } from 'redux-saga/effects';
import {
  addMemberSaga,
  editMemberSaga,
  fetchMembersSaga,
  removeMemberSaga,
} from './sagas/members';
import {
  requestEditPermissionsSaga,
  requestPermissionsSaga,
} from './sagas/permissions';
import searchSaga from './sagas/search';

export default function* inviteSaga() {
  // INVITE -> Members
  yield takeLatest(TYPES.REQUEST_FETCH_MEMBERS, fetchMembersSaga);
  yield takeLatest(TYPES.REQUEST_EDIT_MEMBER, editMemberSaga);
  yield takeLatest(TYPES.REQUEST_REMOVE_MEMBER, removeMemberSaga);
  yield takeLatest(TYPES.REQUEST_ADD_MEMBER, addMemberSaga);
  // INVITE -> Permissions
  yield takeLatest(TYPES.REQUEST_PERMISSIONS, requestPermissionsSaga);
  yield takeLatest(TYPES.REQUEST_EDIT_PERMISSIONS, requestEditPermissionsSaga);
  // INVITE -> Search
  yield takeLatest(TYPES.SEARCH, searchSaga);
}
