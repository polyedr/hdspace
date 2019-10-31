import axios from 'axios';

export const env = process.env.NODE_ENV;

const settings = {
  test: {
    api: {
      host: 'http://192.168.88.210:8000',
      version: 1,
    },
  },
  development: {
    api: {
      host: 'http://101.0.72.82:8000',
      version: 1,
    },
  },
  production: {
    api: {
      host: '//101.0.72.82:8000',
      version: 1,
    },
  },
};

export const { api } = settings[env] || settings.test;

// const getAccessTokenFromStorage = () => JSON.parse(JSON.parse(localStorage.getItem('persist:user')).authorisationToken).access;

// const setDefaultTokenOnRequestHeaders = () => (
//   localStorage.getItem('persist:user')
//   && getAccessTokenFromStorage() !== ''
//   && `Bearer ${getAccessTokenFromStorage()}`
// ) || '';

export const client = axios.create({
  baseURL: `${api.host}/api/v${api.version}`,
  headers: {
    'Content-Type': 'application/json',
    // version: "1.1.0",
  },
});

export const myAxios = (props) => {
  const authorization = (props.access !== '' && { Authorization: `Bearer ${props.access}` }) || {};

  return axios({
    method: props.method,
    baseURL: `${api.host}/api/v${api.version}`,
    url: props.url,
    headers: {
      'Content-Type': props.contentType ? props.contentType : 'application/json',
      ...authorization,
    },
    data: props.data || {},
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
