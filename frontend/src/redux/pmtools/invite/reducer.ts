import TYPES from '@Redux/actionTypes';
import { InviteState } from '../types';

const initState: InviteState = {
  members: [],
  permissions: [],
  searchResult: null,
  loaderSearch: false,
  loaderMembers: false,
  msg: '',
};

const inviteReducer = (state: any = initState, action: any) => {
  switch (action.type) {
    case TYPES.CLEAR_SEARCH:
      return { ...state, searchResult: null };
    case TYPES.MEMBERS_LOADER:
      return { ...state, loaderMembers: action.payload };
    case TYPES.SEARCH_LOADER:
      return { ...state, loaderSearch: action.payload };
    case TYPES.EDIT_PERMISSIONS:
      return {
        ...state,
        permissions: state.permissions.map((e: any) => {
          if (e.userdata.username === action.payload.username) {
            e.permissions = action.payload.permissions;
          }
          return e;
        }),
      };
    case TYPES.PERMISSIONS:
      return {
        ...state,
        permissions: action.payload,
      };
    case TYPES.SEARCH_SUCCESS:
      return { ...state, searchResult: action.payload };
    case TYPES.EDIT_MEMBER:
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
    case TYPES.REMOVE_MEMBER:
      return {
        ...state,
        members: state.members.filter((e: any) => e.id !== action.payload),
      };
    case TYPES.ADD_MEMBER:
      return {
        ...state,
        members: [...state.members, action.payload],
        searchResult: null,
      };
    case TYPES.FETCH_MEMBERS:
      return { ...state, members: action.payload };
    case TYPES.ERROR:
      return {
        ...state,
        type: 'error',
        msg: 'Something error',
      };
    default:
      return state;
  }
};

export default inviteReducer;
