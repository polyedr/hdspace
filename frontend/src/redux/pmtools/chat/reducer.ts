import TYPES from '@Redux/actionTypes';
import { ChatAction, ChatState } from '../types';

const initialState: ChatState = {
  client: null,
  messages: [],
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
    case TYPES.GET_STREAM_MESSAGES_SUCCESS:
      return {
        ...state,
        messages: action.payload,
      };
    case TYPES.SEND_MESSAGE_ZULIP_SUCCESS:
      console.log([...state.messages, action.payload]);
      return { ...state, messages: [...state.messages, action.payload] };
    default:
      return state;
  }
};

export default chatReducer;
