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
    case TYPES.LOGIN_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export default chatReducer;
