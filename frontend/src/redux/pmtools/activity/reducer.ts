import TYPES from '@Redux/actionTypes';
import { ActivityAction, ActivityState } from '../types';

const initialState: ActivityState = {
  actions: [],
};

const activityReducer = (
  state: ActivityState = initialState,
  action: ActivityAction,
) => {
  switch (action.type) {
    case TYPES.GET_ACTION_SUCCESS:
      return {
        ...state,
        actions: action.payload,
      };
    case TYPES.ADD_ACTION_SUCCESS:
      return {
        ...state,
        actions: [action.payload, ...state.actions],
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
