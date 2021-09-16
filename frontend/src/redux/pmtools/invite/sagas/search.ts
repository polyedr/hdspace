import Invite from '@Api/pmtools/inviteApi';
import TYPES from '@Redux/actionTypes';
import { IUser } from '@Src/types/user/types';
import { call, put } from 'redux-saga/effects';

export default function* searchSaga({
  payload,
}: {
  type: string;
  payload: string;
}) {
  try {
    yield put({ type: TYPES.SEARCH_LOADER, payload: true });
    const users: Array<IUser> = yield call(Invite.getAllUsers);
    const result = users.find((user: IUser) => user.username === payload);
    yield put({
      type: TYPES.SEARCH_SUCCESS,
      payload: result,
    });
    yield put({ type: TYPES.SEARCH_LOADER, payload: false });
  } catch (e) {
    yield put({ type: TYPES.ERROR, e });
  }
}
