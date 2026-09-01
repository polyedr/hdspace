import { all } from 'redux-saga/effects';
import activitySaga from './activity/sagas';
import boardSaga from './board/sagas';
import inviteSaga from './invite/sagas';

export default function* pmToolsSaga() {
  yield all([boardSaga(), activitySaga(), inviteSaga()]);
}
