import { AnyAction } from 'redux';
import TYPES from '../actionTypes';
import { loginError, loginSuccess } from './actions';
import { TokenPair, LoginFormData } from '../../types';
import { apiGetToken } from '../../api/user';

const submit = async (values: LoginFormData) => {
  try {
    const tokens: TokenPair = await apiGetToken(values);
    return tokens;
  } catch (e) {
    return e.response?.data || { detail: 'Network Error' };
  }
};

const loginMiddleware = (store) => (next: any) => (action: AnyAction) => {
  if (action?.type === TYPES.LOGIN) {
    submit(action.payload).then(
      (res) => store.dispatch(loginSuccess(res)),
      (errors: any) => store.dispatch(loginError(errors)),
    );
  }
  return next(action);
};

export default loginMiddleware;
