import { AppReduxState } from '$shared/types/app';

export const selectUserEmail = ({ user }: AppReduxState) => user.userData.email;
