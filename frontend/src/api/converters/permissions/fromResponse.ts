import { ServerPermissionsUserData } from '@Src/types/types';
import { convertUserDataFromResponse } from '../fromResponse';

// eslint-disable-next-line import/prefer-default-export
export const convertPermissionsUserDataFromResponse = (
  usersWithPermissions: ServerPermissionsUserData[],
) => {
  return usersWithPermissions.map(({ permissions, userdata }) => ({
    permissions,
    userData: convertUserDataFromResponse(userdata),
  }));
};
