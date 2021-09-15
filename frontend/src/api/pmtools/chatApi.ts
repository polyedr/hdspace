const zulip = require('zulip-js');

const authenticateUser = async ({
  realm,
  username,
  password,
}: any): Promise<any> => {
  try {
    // Sign in when no apiKey present in storage
    if (realm && username && password) {
      const z = await zulip({
        username,
        password,
        realm: `https://${realm}.zulipchat.com`,
      });
      if (z.config.username && z.config.apiKey) {
        return z;
      }

      const message = await z.accounts.retrieve();

      const err = new Error(message.msg);
      err.name = 'AUTHENTICATION ERROR';

      throw err;
    }
    return null;
  } catch (error) {
    return error;
  }
};

const ChatApi = {
  authenticateUser,
};

export default ChatApi;
