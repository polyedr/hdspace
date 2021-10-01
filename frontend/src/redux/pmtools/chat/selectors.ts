import { ChatRootState } from '../types';

/* eslint-disable import/prefer-default-export */
export const chatUser = (state: ChatRootState) => state.chat.client;
