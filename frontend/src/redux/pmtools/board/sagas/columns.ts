import * as columnsApi from '@Api/pmtools/board/columnsApi';
import { reqWrapper } from '@Redux/project/sagas/shared';
import { call } from 'ramda';
import { put } from 'redux-saga/effects';
import { setColumnsFetching } from '../actions/columns';

export function* fetchBoard() {
  yield put(setColumnsFetching(true));

  try {
    const result = yield call(reqWrapper, columnsApi.fetchColumns);

    console.log('columns', result);
  } catch (err) {
    console.log(err);
  }
}
