import { ChatClient, PmToolsUserChat } from '@Src/types/pmtools/types';
import zulip from 'zulip-js';

const apiAuthUser = async (login: PmToolsUserChat) => {
  try {
    const z: ChatClient = await zulip(login);
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

export default apiAuthUser;
