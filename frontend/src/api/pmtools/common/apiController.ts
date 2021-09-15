/* eslint-disable no-param-reassign */
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api-staging.adevi.info/api/v1',
});

export default api;
