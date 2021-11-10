import TYPES from '@Redux/actionTypes';
import { ChatState } from '../types';

const initialState: ChatState = {
  client: null,
};

const chatReducer = (state: ChatState = initialState, action: any) => {
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
    case TYPES.LOGOUT: {
      return { ...state, client: null };
    }
    default:
      return state;
  }
};

export default chatReducer;
