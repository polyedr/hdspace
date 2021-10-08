import { InviteRootState } from '../types';

export const selectMembers = (state: InviteRootState) => state.invite.members;

export const selectSearch = (state: InviteRootState) =>
  state.invite.searchResult;

export const selectSearchLoader = (state: InviteRootState) =>
  state.invite.loaderSearch;
