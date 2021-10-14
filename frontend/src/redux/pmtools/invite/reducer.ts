import TYPES from '@Redux/actionTypes';
import { InviteState, memberAction } from '../types';

const initialState: InviteState = {
  members: [],
  searchResult: null,
  loaderSearch: false,
  msg: '',
};

const inviteReducer = (
  state: InviteState = initialState,
  action: memberAction,
) => {
  switch (action.type) {
    case TYPES.ERROR:
      return {
        ...state,
        msg: 'unknown error',
      };
    default:
      return state;
  }
};

export default inviteReducer;
