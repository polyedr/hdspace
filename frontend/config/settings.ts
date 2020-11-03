import axios, { AxiosRequestConfig } from 'axios';

export const env = process.env.NODE_ENV;

const settings = {
  development: {
    api: {
      host: 'https://www.timberworkinfo.ru',
      version: 1,
    },
  },
  production: {
    api: {
      host: 'https://www.adevi.info',
      version: 1,
    },
  },
};

export const { api } = settings[env] || settings.development;

// const getAccessTokenFromStorage = () => JSON.parse(JSON.parse(localStorage.getItem('persist:user')).authorisationToken).access;

// const setDefaultTokenOnRequestHeaders = () => (
//   localStorage.getItem('persist:user')
//   && getAccessTokenFromStorage() !== ''
//   && `Bearer ${getAccessTokenFromStorage()}`
// ) || '';

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

// export const setTokenOnRequestHeaders = (token) => {
//   if (token) {
//     client.defaults.headers.common.Authorization = `Bearer ${token}`;
//   } else {
//     client.defaults.headers.common.Authorization = '';
//   }
// };

// export const refreshTokenPairOnRequestHeaders = (newToken: string) => {
//   client.defaults.headers.common.Authorization = `Bearer ${newToken}`;
// };
