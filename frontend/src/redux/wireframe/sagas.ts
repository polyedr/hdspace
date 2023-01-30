import { takeEvery } from 'redux-saga/effects';
import { updateScreenPosition } from './actions';

function* updateScreenData() {}

export function* wireframeSagas() {
  yield takeEvery(updateScreenPosition.toString(), updateScreenData);
}
