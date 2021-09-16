import { createSelector } from 'reselect';
import { InviteRootState } from '../types';

export const selectMembers = (state: InviteRootState) => state.invite.members;

export const selectSearch = (state: InviteRootState) =>
  state.invite.searchResult;

export const selectPermissions = (state: InviteRootState) =>
  state.invite.permissions;

export const selectSearchLoader = (state: InviteRootState) =>
  state.invite.loaderSearch;

export const selectMembersLoader = (state: InviteRootState) =>
  state.invite.loaderMembers;

export const selectMembersWithPermissions = createSelector(
  selectMembers,
  selectPermissions,
  (members, permissions) =>
    members.map((member: any) => ({
      ...member,
      permissions: permissions.find(
        (item: any) => item.userdata.id === member.user_id,
      )?.permissions,
    })),
);
