import { AxiosResponse } from 'axios';
import api from './apiController';

async function getToken(): Promise<any> {
  try {
    const res: AxiosResponse = await api.post('/djauth/jwt/create/', {
      username: 'adevisu',
      password: '~FE5.?_`$RAqLj%N',
    });
    const config = {
      headers: { Authorization: `Bearer ${res.data.access}` },
    };
    return config;
  } catch (e) {
    return e;
  }
}

export default getToken;
