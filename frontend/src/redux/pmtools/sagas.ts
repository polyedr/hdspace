import { all } from 'redux-saga/effects';
import activitySaga from './activity/sagas';
import boardSaga from './board/sagas';
import chatSaga from './chat/sagas';

export default function* pmToolsSaga() {
  yield all([chatSaga(), boardSaga(), activitySaga()]);
}
