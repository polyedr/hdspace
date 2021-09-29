import { ChatRootState } from '../types';

/* eslint-disable import/prefer-default-export */
export const authChat = (state: ChatRootState) => state.chat.isAuth;
