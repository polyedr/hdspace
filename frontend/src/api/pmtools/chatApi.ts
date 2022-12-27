/* eslint-disable global-require */
import { configAdmin } from '@Constants/pmtools/zulipChatLoginData';
import { AuthParams, ChatClient } from '@Src/types/pmtools/types';
import zulipInit from 'zulip-js';

(window as any).global = window;
// @ts-expect-error
window.Buffer = window.Buffer || import('buffer').Buffer;

export const apiSendMessage = async (stream, config, message) => {
  try {
    const client = await zulipInit(config);
    const params = {
      to: stream,
      type: 'stream',
      topic: 'Castle',
      content: message,
    };
    return await client.messages.send(params);
  } catch (e) {
    return e;
  }
};

export const apiGetMessages = async (stream, config) => {
  try {
    const client = await zulipInit(config);
    const readParams = {
      anchor: 'newest',
      num_before: 1000,
      num_after: 0,
      narrow: [{ operator: 'stream', operand: stream }],
    };
    return await client.messages.retrieve(readParams);
  } catch (e) {
    return e;
  }
};

export const apiAuthUser = async (login: AuthParams) => {
  try {
    const config: ChatClient = await zulipInit(login);
    if (config.config.username && config.config.apiKey) {
      return await config.users.me.getProfile();
    }
    return await config.users.me.getProfile();
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
