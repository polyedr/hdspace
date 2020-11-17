import axios, { AxiosRequestConfig } from 'axios';

export const env = process.env.NODE_ENV;

const settings = {
  development: {
    api: {
      host: 'https://www.timberworkinfo.ru',
      version: 1,
    },
  },
  staging: {
    api: {
      host: 'https://www.timberworkinfo.ru',
      version: 1,
    },
  },
  production: {
    api: {
      host: 'https://www.timberworkinfo.ru',
      version: 1,
    },
  },
};

const { api } = settings[env] || settings.development;

export type MyAxiosProps = { access?: string; contentType?: string } & Partial<
  AxiosRequestConfig
>;

export const myAxios = (props: MyAxiosProps) => {
  const authorization = props.access
    ? { Authorization: `Bearer ${props.access}` }
    : {};

  return axios({
    method: props.method,
    baseURL: `${api.host}/api/v${api.version}`,
    url: props.url,
    headers: {
      'Content-Type': props.contentType
        ? props.contentType
        : 'application/json',
      ...authorization,
    },
    data: props.data || {},
    params: props.params,
  });
};

export const MAX_TOKEN_TRIALS = 4;
