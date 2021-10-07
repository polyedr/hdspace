import TYPES from '@Redux/actionTypes';
import {
  FromServerMember,
  ToServerFetchMembers,
  RequestMember,
  RequestRemoveMember,
} from '@Src/types/pmtools/actions';

// fetch memberss
export const requestFetchMembers = (payload: ToServerFetchMembers) => ({
  type: TYPES.FETCH_MEMBERS,
  payload,
});

export const successFetchMembers = (payload: Array<FromServerMember>) => ({
  type: TYPES.FETCH_MEMBERS_SUCCESS,
  payload,
});

// edit member
export const requestEditMember = (payload: RequestMember) => ({
  type: TYPES.EDIT_MEMBER,
  payload,
});

export const successEditMembers = (payload: RequestMember) => ({
  type: TYPES.EDIT_MEMBER_SUCCESS,
  payload,
});

// add member
export const requestAddMember = (payload: RequestMember) => ({
  type: TYPES.ADD_MEMBER,
  payload,
});

export const successAddMember = (payload: RequestMember) => ({
  type: TYPES.ADD_MEMBER_SUCCESS,
  payload,
});

// remove member
export const requestRemoveMember = (payload: RequestRemoveMember) => ({
  type: TYPES.REMOVE_MEMBER,
  payload,
});

export const successRemoveMember = (payload: RequestRemoveMember['id']) => ({
  type: TYPES.REMOVE_MEMBER_SUCCESS,
  payload,
});
