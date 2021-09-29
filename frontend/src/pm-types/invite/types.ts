/* eslint-disable camelcase */
import { IUser } from '../user/types';

export type Permission = string;

export type PermissionsType = {
  permissions: Array<Permission>;
  userdata: IUser;
};

export interface IMember {
  id: number;
  project: number;
  role: string;
  status: string;
  user: IUser;
  user_id: number;
  username?: string;
}

export interface IMemberToFrontend extends IMember {
  permissions: Array<Permission>;
}
