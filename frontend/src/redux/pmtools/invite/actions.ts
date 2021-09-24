import TYPES from '@Redux/actionTypes';
import {
  ToServerFetchMembers,
  ToServerMember,
  ToServerRemoveMember,
} from '@Src/pm-types/invite/api';

// Search Members
export const requestSearchAction = (title: string) => ({
  type: TYPES.SEARCH,
  payload: title,
});

// Members
export const fetchMembersAction = (members: ToServerFetchMembers) => ({
  type: TYPES.REQUEST_FETCH_MEMBERS,
  payload: members,
});

export const editMembersAction = (editData: any) => ({
  type: TYPES.REQUEST_EDIT_MEMBER,
  payload: editData,
});

export const addMemberAction = (data: ToServerMember) => ({
  type: TYPES.REQUEST_ADD_MEMBER,
  payload: data,
});

export const removeMemberAction = (data: ToServerRemoveMember) => ({
  type: TYPES.REQUEST_REMOVE_MEMBER,
  payload: data,
});
