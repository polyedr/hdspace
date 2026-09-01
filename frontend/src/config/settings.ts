import axios from 'axios';

export const env = import.meta.env.MODE;

const settings = {
  development: {
    api: {
      host: 'http://localhost:18000',
      version: 1,
    },
  },
  staging: {
    api: {
      host: 'http://localhost:18000',
      version: 1,
    },
  },
  production: {
    api: {
      host: 'https://api.adevi.io',
      version: 1,
    },
  },
};

const { api } = settings[env] || settings.development;

export const myAxios = async (props) => {
  const authorization = props.access
    ? { Authorization: `Bearer ${props.access}` }
    : {};

  return await axios({
    ...props,
    method: props.method,
    baseURL: props.baseURL ?? `${api.host}/api/v${api.version}`,
    url: props.url,
    headers: {
      'Content-Type': props.contentType
        ? props.contentType
        : 'application/json',
      ...authorization,
      ...props.headers,
    },
    data: props.data || {},
    params: props.params,
    timeout: 100000,
  });
};

export const MAX_TOKEN_TRIALS = 4;

export const STREAM_CHAT_CLIENT_ID = 'qa83st6cgefj';

export const HELP_LINK =
  'https://docs.google.com/document/d/e/2PACX-1vTwu72-tooZHmF5D5ExkAyFNRja1dnQVugPLBKmKYViYVj0xpvPJk6nZv9WFCWPNki1pQ4vq96H-sSB/pub#h.rvwljq5j4kb7';

export { api };
