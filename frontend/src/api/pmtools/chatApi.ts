/* eslint-disable global-require */
import { configAdmin } from '@Constants/configZulipChat';
import { AuthParams, ChatClient } from '@Src/types/pmtools/types';
import zulipInit from 'zulip-js';

(window as any).global = window;
// @ts-ignore
window.Buffer = window.Buffer || require('buffer').Buffer;

export const apiAuthUser = async (login: AuthParams) => {
  try {
    const config: ChatClient = await zulipInit(login);
    if (config.config.username && config.config.apiKey) {
      return config;
    }
    return await config.accounts.retrieve();
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
    return await client.users.me.subscriptions.add(meParams);
  } catch (e) {
    return e;
  }
};

export const apiRegisterUser = async (login: AuthParams, register: any) => {
  try {
    const client: ChatClient = await zulipInit(login);
    return await client.users.create(register);
  } catch (e) {
    return e;
  }
};

export const apiDeleteStream = async (nameZulip: string) => {
  try {
    const client = await zulipInit(configAdmin);
    const meParams = {
      subscriptions: JSON.stringify([nameZulip]),
    };
    return await client.users.me.subscriptions.remove(meParams);
  } catch (e) {
    return e;
  }
};

export const apiAddSubscribeToStream = async (
  nameStream: string,
  email: string,
) => {
  try {
    const client = await zulipInit(configAdmin);
    const { members } = await client.users.retrieve();
    const user = members.find((m) => m.is_active && m.email === email);
    const anotherUserParams = {
      subscriptions: JSON.stringify([{ name: nameStream }]),
      principals: JSON.stringify([user.user_id]),
    };
    return await client.users.me.subscriptions.add(anotherUserParams);
  } catch (e) {
    return e;
  }
};

export const apiUnsubscribeToStream = async (
  nameStream: string,
  email: string,
) => {
  try {
    const client = await zulipInit(configAdmin);
    const { members } = await client.users.retrieve();
    const user = members.find((m) => m.is_active && m.email === email);
    const anotherUserParams = {
      subscriptions: JSON.stringify([nameStream]),
      principals: JSON.stringify([user.user_id]),
    };
    return await client.users.me.subscriptions.remove(anotherUserParams);
  } catch (e) {
    return e;
  }
};
