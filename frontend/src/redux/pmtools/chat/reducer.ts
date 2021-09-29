import TYPES from '@Redux/actionTypes';

const initialState = {
  client: {},
  error: null,
  isAuth: false,
};

const chatReducer = (state: any = initialState, action: any) => {
  switch (action.type) {
    case TYPES.LOGIN_SUCCESS:
      return {
        ...state,
        client: action.payload,
        isAuth: true,
      };
    default:
      return state;
  }
};

export default chatReducer;
