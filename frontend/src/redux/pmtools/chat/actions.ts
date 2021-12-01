import TYPES from '@Redux/actionTypes';
import { AuthParams } from '@Src/types/pmtools/types';

export const requestLoginChatUser = (payload: string) => ({
  type: TYPES.LOGIN_PMTOOLS,
  payload,
});

export const requestRegisterZulip = () => ({
  type: TYPES.REGISTER_PMTOOLS,
});

export const successLoginChatUser = (client: AuthParams) => ({
  type: TYPES.LOGIN_PMTOOLS_SUCCESS,
  payload: client,
});

export const requestLogoutChatUser = () => ({
  type: TYPES.LOGOUT_PMTOOLS,
});

export const successLogoutChatUser = () => ({
  type: TYPES.LOGOUT_PMTOOLS_SUCCESS,
});
