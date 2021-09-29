import TYPES from '@Redux/actionTypes';
import { takeLatest } from 'redux-saga/effects';
import {
  addMemberSaga,
  editMemberSaga,
  fetchMembersSaga,
  removeMemberSaga,
} from './members';
import searchSaga from './search';

export default function* inviteSaga() {
  yield takeLatest(TYPES.REQUEST_FETCH_MEMBERS, fetchMembersSaga);
  yield takeLatest(TYPES.REQUEST_EDIT_MEMBER, editMemberSaga);
  yield takeLatest(TYPES.REQUEST_REMOVE_MEMBER, removeMemberSaga);
  yield takeLatest(TYPES.REQUEST_ADD_MEMBER, addMemberSaga);
  yield takeLatest(TYPES.SEARCH, searchSaga);
}
