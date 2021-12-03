import { ChatRootState } from '../types';

export const selectChatUser = (state: ChatRootState) => state.chat.client;
export const selectMessagesZulip = (state: ChatRootState) =>
  state.chat.messages;
