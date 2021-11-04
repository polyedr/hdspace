/* eslint-disable global-require */
import { ChatClient, PmToolsUserChat } from '@Src/types/pmtools/types';
import zulipInit from 'zulip-js';

(window as any).global = window;
// @ts-ignore
window.Buffer = window.Buffer || require('buffer').Buffer;

export const apiAuthUser = async (login: PmToolsUserChat) => {
  try {
    const z: ChatClient = await zulipInit(login);
    if (z.config.username && z.config.apiKey) {
      return z;
    }
    const message = await z.accounts.retrieve();

    const err = new Error(message.msg);
    err.name = 'AUTHENTICATION ERROR';

    throw err;
  } catch (error) {
    return error;
  }
};

export const apiRegisterUser = async (
  login: PmToolsUserChat,
  register: any,
) => {
  try {
    const client: ChatClient = await zulipInit(login);
    return await client.users.create(register);
  } catch (e) {
    return e;
  }
};
