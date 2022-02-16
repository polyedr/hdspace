import { InviteRootState } from '../types';

/* eslint-disable import/prefer-default-export */
export const selectEmail = (state: InviteRootState) => state.invite.email;
