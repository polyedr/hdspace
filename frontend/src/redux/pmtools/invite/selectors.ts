import { MemberData } from '@Src/types/pmtools/types';
import { createSelector } from 'reselect';
import { InviteRootState } from '../types';

export const selectMembers = (state: InviteRootState) => state.invite.members;

export const selectSearch = (state: InviteRootState) =>
  state.invite.searchResult;

export const selectPermissions = (state: InviteRootState) =>
  state.invite.permissions;

export const selectSearchLoader = (state: InviteRootState) =>
  state.invite.loaderSearch;

export const selectMembersWithPermissions = createSelector(
  selectMembers,
  selectPermissions,
  (members, permissions) =>
    members.map((member: MemberData) => ({
      ...member,
      permissions: permissions.find(
        (item: any) => item.username === member.user.username,
      )?.permissions,
    })),
);
