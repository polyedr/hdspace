import TYPES from '@Redux/actionTypes';
import { AuthParams } from '@Src/types/pmtools/types';

// request
export const requestLoginChatUser = (payload: string) => ({
  type: TYPES.LOGIN_PMTOOLS,
  payload,
});

export const requestRegisterZulip = (payload: string) => ({
  type: TYPES.REGISTER_PMTOOLS,
  payload,
});

export const requestLogoutChatUser = () => ({
  type: TYPES.LOGOUT_PMTOOLS,
});

export const requestProjectStreamMessages = (payload) => ({
  type: TYPES.GET_STREAM_MESSAGES,
  payload,
});

export const requestSendStreamMessage = (payload) => ({
  type: TYPES.SEND_MESSAGE_ZULIP,
  payload,
});

// success
export const successLoginChatUser = (client: AuthParams) => ({
  type: TYPES.LOGIN_PMTOOLS_SUCCESS,
  payload: client,
});

export const successLogoutChatUser = () => ({
  type: TYPES.LOGOUT_PMTOOLS_SUCCESS,
});

export const successProjectStreamMessages = (payload: Array<any>) => ({
  type: TYPES.GET_STREAM_MESSAGES_SUCCESS,
  payload,
});

export const successSendStreamMessage = (payload) => ({
  type: TYPES.SEND_MESSAGE_ZULIP_SUCCESS,
  payload,
});
