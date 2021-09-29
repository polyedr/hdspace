import TYPES from '@Redux/actionTypes';
import { ChatState } from '../types';

const initialState = {
  client: null,
  isAuth: false,
};

const chatReducer = (state: ChatState = initialState, action: any) => {
  switch (action.type) {
    case TYPES.LOGIN_SUCCESS:
      return {
        ...state,
        isAuth: true,
        client: action.payload,
      };
    default:
      return state;
  }
};

export default chatReducer;
