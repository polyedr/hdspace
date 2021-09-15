import TYPES from '@Redux/actionTypes';

const initialState = {
  actions: [],
};

const activityReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case TYPES.GET_ACTION:
      return {
        ...state,
        actions: action.payload.reverse(),
      };
    case TYPES.ADD_ACTION:
      return {
        ...state,
        actions: [action.payload.action, ...state.actions],
      };
    case TYPES.CLEAR_HISTORY_SUCCESS:
      return {
        ...state,
        actions: [],
      };
    default:
      return state;
  }
};

export default activityReducer;
