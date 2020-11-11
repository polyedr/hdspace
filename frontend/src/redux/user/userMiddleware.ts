import { AnyAction } from 'redux';
import TYPES from '../actionTypes';
import { loginError, loginSuccess } from './actions';
import { TokenPair, LoginFormData, SignupFormData } from '../../types';
import { apiGetToken } from '../../api/user';

const login = async (values: LoginFormData) => {
  try {
    const tokens: TokenPair = await apiGetToken(values);
    return tokens;
  } catch (e) {
    return e.response?.data || { detail: 'Network Error' };
  }
};

const register = async (values: SignupFormData) => {
  try {
    console.log(values);
  } catch (e) {
    console.log(e.response);
  }
};

const userMiddleware = (store) => (next: any) => (action: AnyAction) => {
  if (action?.type === TYPES.LOGIN) {
    login(action.payload).then(
      (res) => store.dispatch(loginSuccess(res)),
      (errors: any) => store.dispatch(loginError(errors)),
    );
  }

  if (action?.type === TYPES.REGISTER) {
    register(action.payload).then(
      (res) => store.dispatch(loginSuccess(res)),
      (errors: any) => store.dispatch(loginError(errors)),
    );
  }
  return next(action);
};

export default userMiddleware;
