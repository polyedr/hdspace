import { all } from 'redux-saga/effects';
import boardSaga from './board/sagas';
import chatSaga from './chat';
import inviteSaga from './invite/sagas';

export default function* pmToolsSaga() {
  yield all([inviteSaga(), chatSaga(), boardSaga()]);
}
