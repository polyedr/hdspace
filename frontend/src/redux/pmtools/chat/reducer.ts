import TYPES from '@Redux/actionTypes';
import { ChatAction, ChatState } from '../types';

const initialState: ChatState = {
  client: null,
};

const chatReducer = (state: ChatState = initialState, action: ChatAction) => {
  switch (action.type) {
    case TYPES.LOGIN_PMTOOLS_SUCCESS:
      return {
        ...state,
        client: action.payload,
      };
    case TYPES.LOGOUT_PMTOOLS_SUCCESS:
      return {
        ...state,
        client: null,
      };
    default:
      return state;
  }
};

export default chatReducer;
