import { call, put, takeLatest } from 'redux-saga/effects';
import { apiSendEmail } from '@Api/pmtools/inviteApi';
import { panelErrorMsg } from '@Redux/actions';
import TYPES from '@Redux/actionTypes';
import { reqWrapper } from '@Redux/project/sagas/shared';
import { requestSendEmail, successSendEmail } from './actions';

function* sendEmailSaga({
  payload: email,
}: ReturnType<typeof requestSendEmail>) {
  try {
    const res = yield call(reqWrapper, apiSendEmail, { data: email });
    if (res.status === 200) {
      yield put(successSendEmail(email));
    }
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export default function* inviteSaga() {
  yield takeLatest(TYPES.SEND_EMAIL_PM, sendEmailSaga);
}
