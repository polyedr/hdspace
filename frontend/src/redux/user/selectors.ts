import { AppReduxState } from '$shared/types/app';

export const selectUserEmail = ({ user }: AppReduxState) => user.userData.email;

export const selectUserData = ({ user }: AppReduxState) => user.userData;
