import TYPES from '@Redux/actionTypes';

export const requestPermissionsAction = (projectId: number) => ({
  type: TYPES.REQUEST_PERMISSIONS,
  payload: projectId,
});

export const requestEditPermissionsAction = (data: any) => ({
  type: TYPES.REQUEST_EDIT_PERMISSIONS,
  payload: data,
});

// Search Members
export const requestSearchAction = (title: string) => ({
  type: TYPES.SEARCH,
  payload: title,
});

// Members
export const fetchMembersAction = (id: number) => ({
  type: TYPES.REQUEST_FETCH_MEMBERS,
  payload: id,
});

export const editMembersAction = (editData: any) => ({
  type: TYPES.REQUEST_EDIT_MEMBER,
  payload: editData,
});

export const addMemberAction = (data: any) => ({
  type: TYPES.REQUEST_ADD_MEMBER,
  payload: data,
});

export const removeMemberAction = (data: any) => ({
  type: TYPES.REQUEST_REMOVE_MEMBER,
  payload: data,
});
