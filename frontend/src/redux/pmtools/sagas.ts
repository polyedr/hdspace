import TYPES from '@Redux/actionTypes';
import { takeEvery, takeLatest } from 'redux-saga/effects';
import {
  addActionSaga,
  clearHistorySaga,
  getActionSaga,
} from './activity/sagas';
import {
  columnAddSaga,
  columnDeleteSaga,
  columnEditSaga,
  columnsFetchSaga,
} from './board/sagas/columns';
import {
  taskAddSaga,
  taskDeleteSaga,
  taskEditSaga,
  tasksFetchSaga,
} from './board/sagas/tasks';
import { authUser } from './chat/sagas';
import {
  addMemberSaga,
  editMemberSaga,
  fetchMembersSaga,
  removeMemberSaga,
} from './invite/sagas/members';
import {
  requestEditPermissionsSaga,
  requestPermissionsSaga,
} from './invite/sagas/permissions';
import searchSaga from './invite/sagas/search';

export default function* pmToolsSaga() {
  // ACTIONS
  yield takeEvery(TYPES.REQUEST_ADD_ACTION, addActionSaga);
  yield takeLatest(TYPES.REQUEST_GET_ACTION, getActionSaga);
  yield takeLatest(TYPES.CLEAR_HISTORY, clearHistorySaga);
  //   BOARD ->
  yield takeLatest(TYPES.REQUEST_FETCH_BOARD, columnsFetchSaga);
  yield takeLatest(TYPES.REQUEST_FETCH_TASKS, tasksFetchSaga);
  // BOARD -> Task
  yield takeLatest(TYPES.REQUEST_EDIT_TASK, taskEditSaga);
  yield takeLatest(TYPES.REQUEST_ADD_TASK, taskAddSaga);
  yield takeLatest(TYPES.REQUEST_DELETE_TASK, taskDeleteSaga);
  // BOARD -> Column
  yield takeLatest(TYPES.REQUEST_EDIT_COLUMN, columnEditSaga);
  yield takeLatest(TYPES.REQUEST_ADD_COLUMN, columnAddSaga);
  yield takeLatest(TYPES.REQUEST_DELETE_COLUMN, columnDeleteSaga);
  // CHAT -> Chat
  yield takeLatest(TYPES.LOGIN_REQUEST, authUser);
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
