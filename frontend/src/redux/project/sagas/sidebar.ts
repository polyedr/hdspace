import { select, put, take } from 'redux-saga/effects';
import { ChatCredentials, TokenPair, UserData } from '@Src/types';
import {
  selectChatCredentials,
  selectTokenPair,
  selectUserData,
} from '@Redux/user/selectors';
import * as Actions from '@Redux/project/actions';
import {
  selectCurrentProjectId,
  selectSidebarHost,
  selectSidebarIframe,
} from '@Redux/project/selectors/base';
import TYPES from '@Redux/actionTypes';
import { enqueueSnackbar } from '../../notification/actions';

export function* sidebarLogoutSaga() {
  try {
    const iframe: HTMLIFrameElement | null = yield select(selectSidebarIframe);
    const host: string = yield select(selectSidebarHost);

    if (!iframe?.contentWindow) {
      return;
    }

    iframe.contentWindow.postMessage({ type: 'logout' }, host);
    yield take(TYPES.SIDEBAR_LOGOUT_SUCCESS);
  } catch (e) {
    yield put(
      enqueueSnackbar(
        {
          message: e.message,
          options: { variant: 'error' },
        },
        e,
      ),
    );
  }
}

export function* setUpSidebarSaga(
  action: ReturnType<typeof Actions.setUpSidebar>,
) {
  try {
    const { iframe, host } = action.payload;

    if (!iframe.contentWindow) {
      throw new Error('No iframe mounted');
    }

    yield put(Actions.setSidebarIframe(iframe));
    yield put(Actions.setSidebarHost(host));

    const userData: UserData = yield select(selectUserData);
    const projectId: number = yield select(selectCurrentProjectId);
    const { access }: TokenPair = yield select(selectTokenPair);
    const chatCredentials: ChatCredentials = yield select(
      selectChatCredentials,
    );

    iframe.contentWindow.postMessage(
      { type: 'setAccessToken', payload: access },
      host,
    );

    iframe.contentWindow.postMessage(
      { type: 'setProjectId', payload: projectId },
      host,
    );

    iframe.contentWindow.postMessage(
      { type: 'setUserData', payload: userData },
      host,
    );

    iframe.contentWindow.postMessage(
      { type: 'setChatCredentials', payload: chatCredentials },
      host,
    );
  } catch (e) {
    yield put(
      enqueueSnackbar(
        {
          message: e.message,
          options: { variant: 'error' },
        },
        e,
      ),
    );
  }
}
