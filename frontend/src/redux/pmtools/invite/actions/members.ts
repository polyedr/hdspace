import TYPES from '@Redux/actionTypes';
import {
  FromServerMember,
  ToServerFetchMembers,
  ToServerMember,
  ToServerRemoveMember,
} from '@Src/types/pmtools/actions';

// fetch memberss
export const requestFetchMembers = (payload: ToServerFetchMembers) => ({
  type: TYPES.REQUEST_FETCH_MEMBERS,
  payload,
});

export const successfetchMembers = (payload: FromServerMember) => ({
  type: TYPES.FETCH_MEMBERS,
  payload,
});

// edit member
export const requestEditMember = (payload: ToServerMember) => ({
  type: TYPES.REQUEST_EDIT_MEMBER,
  payload,
});

export const successEditMembers = (payload: ToServerMember) => ({
  type: TYPES.EDIT_MEMBER,
  payload,
});

// add member
export const requestAddMember = (payload: ToServerMember) => ({
  type: TYPES.REQUEST_ADD_MEMBER,
  payload,
});

export const successAddMember = (payload: ToServerMember) => ({
  type: TYPES.ADD_MEMBER,
  payload,
});

// remove member
export const requestRemoveMember = (payload: ToServerRemoveMember) => ({
  type: TYPES.REQUEST_REMOVE_MEMBER,
  payload,
});

export const successRemoveMember = (payload: ToServerRemoveMember['id']) => ({
  type: TYPES.REMOVE_MEMBER,
  payload,
});
