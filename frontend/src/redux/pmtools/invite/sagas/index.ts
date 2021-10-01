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
  yield takeLatest(TYPES.FETCH_MEMBERS, fetchMembersSaga);
  yield takeLatest(TYPES.EDIT_MEMBER, editMemberSaga);
  yield takeLatest(TYPES.REMOVE_MEMBER, removeMemberSaga);
  yield takeLatest(TYPES.ADD_MEMBER, addMemberSaga);
  yield takeLatest(TYPES.SEARCH, searchSaga);
}
