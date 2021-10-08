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
    case TYPES.CLEAR_SEARCH:
      return { ...state, searchResult: null };
    case TYPES.SEARCH_LOADER:
      return { ...state, loaderSearch: action.payload };
    case TYPES.EDIT_MEMBER_SUCCESS:
      return {
        ...state,
        members: state.members.map((e: any) => {
          if (e.id === action.payload.id) {
            e.role = action.payload.role;
            e.status = action.payload.status;
          }
          return e;
        }),
      };
    case TYPES.REMOVE_MEMBER_SUCCESS:
      return {
        ...state,
        members: state.members.filter((e: any) => e.id !== action.payload),
      };
    case TYPES.ADD_MEMBER_SUCCESS:
      return {
        ...state,
        members: [...state.members, action.payload],
        searchResult: null,
      };
    case TYPES.FETCH_MEMBERS_SUCCESS:
      return { ...state, members: action.payload };
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
