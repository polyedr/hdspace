import Invite from '@Api/pmtools/inviteApi';
import TYPES from '@Redux/actionTypes';
import { ServerUserData } from '@Src/types/types';
import { call, put } from 'redux-saga/effects';

export default function* searchSaga({ payload }: any) {
  try {
    yield put({ type: TYPES.SEARCH_LOADER, payload: true });
    const users: Array<ServerUserData> = yield call(
      Invite.getAllUsers,
      payload.access,
    );
    const result = users.find(
      (user: ServerUserData) => user.username === payload.search,
    );
    yield put({
      type: TYPES.SEARCH_SUCCESS,
      payload: result,
    });
    yield put({ type: TYPES.SEARCH_LOADER, payload: false });
  } catch (e) {
    yield put({ type: TYPES.ERROR, e });
  }
}
