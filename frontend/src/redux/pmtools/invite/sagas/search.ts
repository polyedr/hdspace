import Invite from '@Api/pmtools/inviteApi';
import TYPES from '@Redux/actionTypes';
import { ServerUserData } from '@Src/types/types';
import { call, put } from 'redux-saga/effects';
import sidePanelError from '../actions/error';
import { requestSearchAction } from '../actions/search';

export default function* searchSaga(
  action: ReturnType<typeof requestSearchAction>,
) {
  try {
    yield put({ type: TYPES.SEARCH_LOADER, payload: true });
    const users: Array<ServerUserData> = yield call(
      Invite.getAllUsers,
      action.payload.access,
    );
    const result = users.find(
      (user: ServerUserData) => user.username === action.payload.search,
    );
    yield put({
      type: TYPES.SEARCH_SUCCESS,
      payload: result,
    });
    yield put({ type: TYPES.SEARCH_LOADER, payload: false });
  } catch (e) {
    yield put(sidePanelError(e));
  }
}
