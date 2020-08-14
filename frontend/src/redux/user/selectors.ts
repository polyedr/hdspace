import { AppReduxState } from '$shared/types/app';

export const selectUserData = ({ user }: AppReduxState) => user.userData;
