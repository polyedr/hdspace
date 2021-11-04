import { ChatClient, PmToolsUserChat } from '@Src/types/pmtools/types';
import zulipInit from 'zulip-js';

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
    // get access with rights (login admin user)
    const client: ChatClient = await zulipInit(login);
    // create new user
    return await client.users.create(register);
  } catch (e) {
    return e;
  }
};

(window as any).global = window;
