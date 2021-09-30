import TYPES from '@Redux/actionTypes';
import { ChatAction, ChatState } from '../types';

const initialState: ChatState = {
  client: null,
  isAuth: false,
};

const chatReducer = (state: ChatState = initialState, action: ChatAction) => {
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
