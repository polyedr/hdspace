/* eslint-disable global-require */
import { configAdmin } from '@Constants/configZulipChat';
import { ChatClient, PmToolsUserChat } from '@Src/types/pmtools/types';
import zulipInit from 'zulip-js';

(window as any).global = window;
// @ts-ignore
window.Buffer = window.Buffer || require('buffer').Buffer;

export const apiAuthUser = async (login: PmToolsUserChat) => {
  try {
    const config: ChatClient = await zulipInit(login);
    if (config.config.username && config.config.apiKey) {
      return config;
    }
    const message = await config.accounts.retrieve();

    const err = new Error(message.msg);
    err.name = 'AUTHENTICATION ERROR';

    throw err;
  } catch (e) {
    return e;
  }
};

export const apiCreateNewStreams = async (name: string) => {
  try {
    const client = await zulipInit(configAdmin);
    const meParams = {
      subscriptions: JSON.stringify([{ name }]),
    };
    await client.users.me.subscriptions.add(meParams);

    throw new Error('Create streams error');
  } catch (e) {
    return e;
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
