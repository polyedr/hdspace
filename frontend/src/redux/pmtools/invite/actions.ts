import TYPES from '@Redux/actionTypes';
import {
  ToServerFetchMembers,
  ToServerMember,
  ToServerRemoveMember,
} from '@Src/pm-types/invite/api';

// Search Members
export const requestSearchAction = (payload: any) => ({
  type: TYPES.SEARCH,
  payload,
});

// Members
export const fetchMembersAction = (payload: ToServerFetchMembers) => ({
  type: TYPES.REQUEST_FETCH_MEMBERS,
  payload,
});

export const editMembersAction = (payload: any) => ({
  type: TYPES.REQUEST_EDIT_MEMBER,
  payload,
});

export const addMemberAction = (payload: ToServerMember) => ({
  type: TYPES.REQUEST_ADD_MEMBER,
  payload,
});

export const removeMemberAction = (payload: ToServerRemoveMember) => ({
  type: TYPES.REQUEST_REMOVE_MEMBER,
  payload,
});
