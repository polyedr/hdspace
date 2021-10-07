import Invite from '@Api/pmtools/inviteApi';
import TYPES from '@Redux/actionTypes';
import { reqWrapper } from '@Redux/project/sagas/shared';
import { ServerUserData } from '@Src/types/types';
import { call, put } from 'redux-saga/effects';
import sidePanelError from '../actions/error';
import { requestSearchAction, searchLoader } from '../actions/search';

export default function* searchSaga(
  action: ReturnType<typeof requestSearchAction>,
) {
  try {
    yield put(searchLoader(true));
    const users: Array<ServerUserData> = yield call(
      reqWrapper,
      Invite.getAllUsers,
    );
    const result = users.find(
      (user: ServerUserData) => user.username === action.payload.search,
    );
    yield put({
      type: TYPES.SEARCH_SUCCESS,
      payload: result,
    });
    yield put(searchLoader(false));
  } catch (e) {
    yield put(sidePanelError(e));
  }
}
